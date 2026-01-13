import { X, Sparkles } from "lucide-react";

interface UpgradeBannerProps {
  onDismiss: () => void;
}

export function UpgradeBanner({ onDismiss }: UpgradeBannerProps) {
  return (
    <div className="relative mx-auto max-w-3xl w-full px-4 mb-6 animate-in fade-in duration-300">
      <div className="flex items-start justify-between gap-4 px-5 py-4 rounded-xl bg-[#1A1A1A] border border-[#252525] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-4">
          {/* Ultra Badge */}
          <div className="flex-shrink-0 px-2 py-1 rounded-md bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border border-cyan-500/30">
            <span className="text-xs font-normal text-cyan-400 lowercase tracking-wide flex items-center gap-1">
              <Sparkles size={12} />
              ultra
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-normal text-[#E5E5E5] lowercase">
              unlock the full aurion experience
            </h3>
            <p className="text-sm text-[#A0A0A0] lowercase">
              aurion advanced mode, 100+ integrations, triggers, custom ai
              workers & more
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#252525] text-[#666666] hover:text-[#A0A0A0] transition-all duration-200"
          aria-label="dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

