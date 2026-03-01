import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DiagramType } from "@/components/DiagramTypeSelector";
import { toast } from "sonner";

export function useDiagramGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidCode, setMermaidCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateDiagram = async (description: string, diagramType: DiagramType) => {
    if (!description.trim()) {
      toast.error("Bitte gib eine Beschreibung ein");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-diagram", {
        body: { description, diagramType },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.mermaidCode) {
        setMermaidCode(data.mermaidCode);
        toast.success("Diagramm erfolgreich generiert!");
      } else {
        throw new Error("Keine Diagramm-Daten erhalten");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    mermaidCode,
    error,
    generateDiagram,
    setMermaidCode,
  };
}
