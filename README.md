# n8n Prozesse

Eine React/Vite-Webanwendung zur KI-gestützten Generierung von Mermaid-Diagrammen für Prozessbeschreibungen.

## Features

- Diagramm-Generierung aus natürlicher Sprache
- Diagrammtypen:
  - Flowchart / BPMN
  - Sequenzdiagramm
  - Klassendiagramm
  - Aktivitätsdiagramm
  - ER-Diagramm
- Live-Vorschau mit Zoom
- SVG-Export

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Anschließend im Browser öffnen:

- `http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm test
```

## Konfiguration

Die Diagramm-Generierung läuft über die Supabase Edge Function `generate-diagram` und benötigt einen gesetzten `LOVABLE_API_KEY`.

## Lizenz

Dieses Projekt steht unter der GNU General Public License v3.0. Siehe [LICENSE](./LICENSE).
