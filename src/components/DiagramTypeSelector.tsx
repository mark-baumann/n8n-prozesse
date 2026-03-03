import { cn } from "@/lib/utils";
import { 
  GitBranch, 
  MessageSquare, 
  Box, 
  Activity, 
  Database,
} from "lucide-react";

export type DiagramType = "flowchart" | "sequence" | "class" | "activity" | "er";

interface DiagramTypeSelectorProps {
  selected: DiagramType;
  onSelect: (type: DiagramType) => void;
}

const diagramTypes: { type: DiagramType; label: string; description: string; icon: typeof GitBranch }[] = [
  { 
    type: "flowchart", 
    label: "Flowchart / BPMN", 
    description: "Prozessabläufe & Entscheidungen",
    icon: GitBranch 
  },
  { 
    type: "sequence", 
    label: "Sequenzdiagramm", 
    description: "Interaktionen zwischen Objekten",
    icon: MessageSquare 
  },
  { 
    type: "class", 
    label: "Klassendiagramm", 
    description: "Struktur & Beziehungen",
    icon: Box 
  },
  { 
    type: "activity", 
    label: "Aktivitätsdiagramm", 
    description: "Workflow & Zustände",
    icon: Activity 
  },
  { 
    type: "er", 
    label: "ER-Diagramm", 
    description: "Datenbank-Entitäten",
    icon: Database 
  },
];

export function DiagramTypeSelector({ selected, onSelect }: DiagramTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {diagramTypes.map(({ type, label, description, icon: Icon }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
            "hover:border-primary/50 hover:bg-primary/5",
            selected === type 
              ? "border-primary bg-primary/10 glow-primary-subtle" 
              : "border-border bg-card"
          )}
        >
          <Icon className={cn(
            "w-6 h-6 transition-colors",
            selected === type ? "text-primary" : "text-muted-foreground"
          )} />
          <div className="text-center">
            <div className={cn(
              "text-sm font-medium",
              selected === type ? "text-primary" : "text-foreground"
            )}>
              {label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {description}
            </div>
          </div>
          {selected === type && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
