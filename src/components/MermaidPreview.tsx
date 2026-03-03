import { useEffect, useState } from "react";
import mermaid from "mermaid";
import { Copy, Check, Code, Image, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MermaidPreviewProps {
  code: string;
}

export function MermaidPreview({ code }: MermaidPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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
      if (!code) return;

      setError(null);

      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Fehler beim Rendern des Diagramms");
      }
    };

    if (!code) {
      setSvgContent("");
      setError(null);
      return;
    }

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

  const handleZoomIn = () => {
    setZoomLevel((current) => Math.min(current + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((current) => Math.max(current - 0.25, 0.5));
  };

  if (!code) {
    return (
      <div className="flex items-center justify-center h-[550px] diagram-preview rounded-lg border border-dashed border-border">
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
          <TabsTrigger value="preview" className="gap-2 text-foreground data-[state=active]:text-foreground">
            <Image className="w-4 h-4" />
            Vorschau
          </TabsTrigger>
          <TabsTrigger value="code" className="gap-2 text-foreground data-[state=active]:text-foreground">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            className="gap-2 text-foreground"
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
            Zoom out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            className="gap-2 text-foreground"
            disabled={zoomLevel >= 4}
          >
            <ZoomIn className="w-4 h-4" />
            Zoom in
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="gap-2 text-foreground"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Kopiert!" : "Code kopieren"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSvg}
            disabled={!svgContent}
            className="gap-2 text-foreground"
          >
            <Download className="w-4 h-4" />
            SVG
          </Button>
        </div>
      </div>

      <TabsContent value="preview" className="mt-0">
        <div
          className={cn(
            "diagram-preview rounded-lg border border-border p-4 min-h-[550px] overflow-auto bg-card",
          )}
        >
          {error ? (
            <div className="text-destructive text-center">
              <p className="font-medium">Rendering-Fehler</p>
              <p className="text-sm mt-2 opacity-75">{error}</p>
            </div>
          ) : (
            <div className="w-max min-w-full min-h-full">
              <div
                className="animate-fade-in [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-none"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="code" className="mt-0">
        <pre className="bg-muted rounded-lg p-6 min-h-[550px] overflow-auto font-mono text-sm text-foreground border border-border">
          {code}
        </pre>
      </TabsContent>
    </Tabs>
  );
}
