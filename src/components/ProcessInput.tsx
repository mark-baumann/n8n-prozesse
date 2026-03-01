import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface ProcessInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function ProcessInput({ value, onChange, onGenerate, isLoading }: ProcessInputProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Beschreibe deinen Prozess oder Ablauf hier...

Beispiel für Flowchart:
'Ein Benutzer meldet sich an. Das System prüft die Anmeldedaten. Bei erfolgreicher Prüfung wird das Dashboard angezeigt, sonst eine Fehlermeldung.'

Beispiel für Sequenzdiagramm:
'Der Client sendet eine Anfrage an den Server. Der Server fragt die Datenbank ab und gibt das Ergebnis an den Client zurück.'"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] font-mono text-sm resize-none bg-card border-border focus:border-primary focus:ring-primary/20"
        />
      </div>
      
      <Button
        onClick={onGenerate}
        disabled={!value.trim() || isLoading}
        className="w-full gradient-primary text-primary-foreground font-medium h-12 text-base transition-all hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generiere Diagramm...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Diagramm generieren
          </>
        )}
      </Button>
    </div>
  );
}
