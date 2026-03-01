import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Copy, Check, Code, Image, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MermaidPreviewProps {
  code: string;
}

export function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        primaryColor: "#22d3ee",
        primaryTextColor: "#fff",
        primaryBorderColor: "#0ea5e9",
        lineColor: "#94a3b8",
        secondaryColor: "#1e293b",
        tertiaryColor: "#0f172a",
        background: "#0f172a",
        mainBkg: "#1e293b",
        nodeBorder: "#0ea5e9",
        clusterBkg: "#1e293b",
        edgeLabelBackground: "#1e293b",
      },
      flowchart: {
        curve: "basis",
        padding: 20,
      },
      sequence: {
        mirrorActors: false,
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || !containerRef.current) return;

      setError(null);
      
      try {
        // Clear previous content
        containerRef.current.innerHTML = "";
        
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setSvgContent(svg);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Fehler beim Rendern des Diagramms");
      }
    };

    renderDiagram();
  }, [code]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SVG heruntergeladen!");
  };

  if (!code) {
    return (
      <div className="flex items-center justify-center h-[400px] diagram-preview rounded-lg border border-dashed border-border">
        <div className="text-center text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Dein Diagramm erscheint hier</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="preview" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="preview" className="gap-2">
            <Image className="w-4 h-4" />
            Vorschau
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Kopiert!" : "Code kopieren"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSvg}
            disabled={!svgContent}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            SVG
          </Button>
        </div>
      </div>

      <TabsContent value="preview" className="mt-0">
        <div className={cn(
          "diagram-preview rounded-lg border border-border p-8 min-h-[400px] overflow-auto",
          "flex items-center justify-center bg-card"
        )}>
          {error ? (
            <div className="text-destructive text-center">
              <p className="font-medium">Rendering-Fehler</p>
              <p className="text-sm mt-2 opacity-75">{error}</p>
            </div>
          ) : (
            <div 
              ref={containerRef} 
              className="animate-fade-in [&_svg]:max-w-full [&_svg]:h-auto"
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-0">
        <pre className="bg-muted rounded-lg p-6 min-h-[400px] overflow-auto font-mono text-sm text-foreground border border-border">
          {code}
        </pre>
      </TabsContent>
    </Tabs>
  );
}
