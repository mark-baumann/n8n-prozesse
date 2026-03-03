import { Workflow } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center glow-primary-subtle">
            <Workflow className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ProzessPilot</h1>
            <p className="text-xs text-muted-foreground">Text → Diagramm mit KI</p>
          </div>
        </div>
      </div>
    </header>
  );
}
