import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DIAGRAM_TYPE_PROMPTS: Record<string, string> = {
  flowchart: `You are a Mermaid diagram expert. Convert the user's process description into a Mermaid flowchart (BPMN-style).
Use 'graph TD' or 'graph LR' for the direction.
Use descriptive node IDs and clear labels.
Include decision points with diamond shapes {}.
Use proper arrow syntax: --> for flow, -.-> for dashed, ==> for thick.
Return ONLY the Mermaid code, no explanations.`,

  n8n: `You are an n8n workflow architect and Mermaid expert.
Convert the user's automation description into a Mermaid flowchart that visually resembles n8n.
Use 'flowchart LR' unless a vertical layout is clearly better.
Model realistic n8n nodes (for example: Webhook Trigger, Cron, HTTP Request, Set, IF, Switch, Merge, Code, Wait, Slack, Notion, Postgres, Respond to Webhook).
Use branching for IF/Switch, reconnect branches with Merge where it makes sense, and include success/error paths for important integrations.
Use clear node IDs and labels, for example webhook["Webhook Trigger"] or ifCheck{"IF: valid payload?"}.
Style the graph with classes so node types are visually distinct:
- classDef trigger fill:#1d4ed8,stroke:#93c5fd,color:#eff6ff,stroke-width:2px;
- classDef core fill:#7c3aed,stroke:#c4b5fd,color:#f5f3ff,stroke-width:2px;
- classDef logic fill:#ca8a04,stroke:#fde68a,color:#111827,stroke-width:2px;
- classDef data fill:#0891b2,stroke:#67e8f9,color:#ecfeff,stroke-width:2px;
- classDef app fill:#059669,stroke:#6ee7b7,color:#ecfdf5,stroke-width:2px;
- classDef error fill:#b91c1c,stroke:#fca5a5,color:#fef2f2,stroke-width:2px;
Assign classes to every node with 'class nodeId className;'.
Use short edge labels for conditions (e.g. |yes|, |no|) when helpful.
Return ONLY Mermaid code, no explanations and no markdown fences.`,
  
  sequence: `You are a Mermaid diagram expert. Convert the user's process description into a Mermaid sequence diagram.
Use 'sequenceDiagram' as the type.
Define participants clearly.
Use proper message syntax: ->> for solid, -->> for dashed.
Include activate/deactivate for long processes.
Add notes where helpful.
Return ONLY the Mermaid code, no explanations.`,
  
  class: `You are a Mermaid diagram expert. Convert the user's description into a Mermaid class diagram.
Use 'classDiagram' as the type.
Define classes with attributes and methods.
Use proper relationship arrows: <|-- for inheritance, *-- for composition, o-- for aggregation.
Add cardinality where appropriate.
Return ONLY the Mermaid code, no explanations.`,
  
  activity: `You are a Mermaid diagram expert. Convert the user's process description into a Mermaid state diagram (activity-style).
Use 'stateDiagram-v2' as the type.
Use [*] for start and end states.
Create meaningful state names.
Use --> for transitions.
Include choice states with <<choice>> where there are decisions.
Return ONLY the Mermaid code, no explanations.`,
  
  er: `You are a Mermaid diagram expert. Convert the user's description into a Mermaid ER diagram.
Use 'erDiagram' as the type.
Define entities with their attributes.
Use proper relationship syntax: ||--o{ for one-to-many, ||--|| for one-to-one, }|--|{ for many-to-many.
Add relationship labels.
Return ONLY the Mermaid code, no explanations.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, diagramType } = await req.json();
    
    if (!description || !diagramType) {
      return new Response(
        JSON.stringify({ error: "Description and diagram type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = DIAGRAM_TYPE_PROMPTS[diagramType] || DIAGRAM_TYPE_PROMPTS.flowchart;
    const cleanedDescription = description
      .replace(/mit\s+n8n[-\s]*workflow\s+erstellen[:\-\s]*/gi, "")
      .trim();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: cleanedDescription || description },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let mermaidCode = data.choices?.[0]?.message?.content || "";
    
    // Clean up the response - remove markdown code blocks if present
    mermaidCode = mermaidCode
      .replace(/```mermaid\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    return new Response(
      JSON.stringify({ mermaidCode }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating diagram:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
