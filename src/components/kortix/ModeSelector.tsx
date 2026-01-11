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
  { id: "slides", icon: Presentation, label: "Slides" },
  { id: "data", icon: BarChart3, label: "Data" },
  { id: "docs", icon: FileText, label: "Docs" },
  { id: "canvas", icon: Layers, label: "Canvas" },
  { id: "video", icon: Video, label: "Video" },
  { id: "research", icon: Search, label: "Research" },
  { id: "image", icon: Image, label: "Image" },
];

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="mx-auto max-w-3xl w-full px-4 mt-6">
      <div className="flex items-center justify-center gap-1 p-1 rounded-xl bg-[#121212] border border-[#252525]">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedMode === mode.id
                ? "bg-[#1A1A1A] text-[#E5E5E5] shadow-sm"
                : "text-[#666666] hover:text-[#A0A0A0] hover:bg-[#1A1A1A]/50"
            }`}
          >
            <mode.icon size={16} />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Mode };
