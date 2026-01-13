import { Share2, LayoutGrid } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#0A0A0A] border-b border-[#252525] flex items-center justify-between px-6 z-40">
      {/* Left side - Branding */}
      <div className="flex items-center gap-2 text-[#E5E5E5]">
        <span className="text-lg font-normal lowercase">aurion chat</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Share Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#E5E5E5] transition-all duration-200 text-sm lowercase">
          <Share2 size={16} />
          share
        </button>

        {/* Grid Button */}
        <button className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#E5E5E5] transition-all duration-200">
          <LayoutGrid size={18} />
        </button>
      </div>
    </header>
  );
}

