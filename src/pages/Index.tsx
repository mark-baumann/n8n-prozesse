import { useState } from "react";
import { Header } from "@/components/Header";
import { DiagramTypeSelector, DiagramType } from "@/components/DiagramTypeSelector";
import { ProcessInput } from "@/components/ProcessInput";
import { MermaidPreview } from "@/components/MermaidPreview";
import { useDiagramGenerator } from "@/hooks/useDiagramGenerator";

const Index = () => {
  const [description, setDescription] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const { isLoading, mermaidCode, generateDiagram } = useDiagramGenerator();

  const handleGenerate = () => {
    generateDiagram(description, diagramType);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient-primary">Prozesse visualisieren</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beschreibe deinen Ablauf in natürlicher Sprache und erhalte professionelle Diagramme in Sekunden.
          </p>
        </div>

        {/* Diagram Type Selection */}
        <section className="mb-8 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            1. Wähle den Diagrammtyp
          </h3>
          <DiagramTypeSelector 
            selected={diagramType} 
            onSelect={setDiagramType} 
          />
        </section>

        {/* Input Section */}
        <section className="animate-fade-in mb-8" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            2. Beschreibe den Prozess
          </h3>
          <div className="bg-card rounded-xl border border-border p-6">
            <ProcessInput
              value={description}
              onChange={setDescription}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Preview Section */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            3. Dein Diagramm
          </h3>
          <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
            <MermaidPreview code={mermaidCode} />
          </div>
        </section>

        {/* Features Info */}
        <section className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold mb-2">Blitzschnell</h4>
              <p className="text-sm text-muted-foreground">
                KI-gestützte Generierung in wenigen Sekunden
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold mb-2">5 Diagrammtypen</h4>
              <p className="text-sm text-muted-foreground">
                Flowcharts, Sequenz-, Klassen-, Aktivitäts- & ER-Diagramme
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="font-semibold mb-2">Export</h4>
              <p className="text-sm text-muted-foreground">
                Code kopieren oder als SVG herunterladen
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
