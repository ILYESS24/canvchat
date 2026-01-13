import {
  Presentation,
  BarChart3,
  FileText,
  Layers,
  Video,
  Search,
  Image,
} from "lucide-react";

type Mode =
  | "slides"
  | "data"
  | "docs"
  | "canvas"
  | "video"
  | "research"
  | "image";

interface ModeSelectorProps {
  selectedMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modes: { id: Mode; icon: React.ElementType; label: string }[] = [
  { id: "slides", icon: Presentation, label: "slides" },
  { id: "data", icon: BarChart3, label: "data" },
  { id: "docs", icon: FileText, label: "docs" },
  { id: "canvas", icon: Layers, label: "canvas" },
  { id: "video", icon: Video, label: "video" },
  { id: "research", icon: Search, label: "research" },
  { id: "image", icon: Image, label: "image" },
];

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="mx-auto max-w-4xl w-full px-4 mt-8">
      <div className="flex items-center justify-center flex-wrap gap-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] relative h-10 px-3 sm:px-4 gap-2 shrink-0 rounded-2xl cursor-pointer border-[1.5px] transition-all duration-200 ${
              selectedMode === mode.id
                ? "bg-muted border-border text-foreground"
                : "bg-background/50 border-border/40 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted dark:bg-card/30 dark:hover:bg-muted"
            }`}
          >
            <span className="transition-colors duration-200 [&>svg]:w-4 [&>svg]:h-4">
              <mode.icon />
            </span>
            <span className="transition-colors duration-200 capitalize">
              {mode.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Mode };

