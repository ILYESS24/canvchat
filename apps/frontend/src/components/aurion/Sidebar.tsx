"use client";

import { useState } from "react";
import {
  MessageSquare,
  BarChart3,
  Zap,
  ChevronRight,
  Plus,
} from "lucide-react";

type NavItem = "chats" | "library" | "triggers";

interface SidebarProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  visible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Sidebar({ activeNav, onNavChange, visible, onMouseEnter, onMouseLeave }: SidebarProps) {
  const [triggersExpanded, setTriggersExpanded] = useState(false);

  const navItems = [
    { id: "chats" as NavItem, icon: MessageSquare, label: "chats" },
    { id: "library" as NavItem, icon: BarChart3, label: "library" },
    { id: "triggers" as NavItem, icon: Zap, label: "triggers" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-[240px] bg-[#0F0F0F] border-r border-[#252525] flex flex-col z-50 transition-all duration-300 ${
        visible ? 'translate-x-0' : '-translate-x-full'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >

      {/* New Chat Button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#252525] text-[#E5E5E5] text-sm font-normal transition-all duration-200 hover:scale-[1.02] lowercase">
          <Plus size={16} />
          nouveau chat
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-between px-4 border-b border-[#252525]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex flex-col items-center gap-1 py-3 px-3 text-xs font-normal transition-all duration-200 lowercase ${
              activeNav === item.id
                ? "text-[#E5E5E5] border-b-2 border-[#E5E5E5]"
                : "text-[#A0A0A0] hover:text-[#E5E5E5]"
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Trigger Config Section */}
      {activeNav === "triggers" && (
        <div className="px-4 py-3">
          <span className="text-[11px] text-[#666666] lowercase tracking-wider font-normal">
            trigger config
          </span>

          {/* All Triggers */}
          <button
            onClick={() => setTriggersExpanded(!triggersExpanded)}
            className="w-full mt-3 flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-[#E5E5E5] text-sm font-normal transition-all duration-300 lowercase"
          >
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <span>all triggers</span>
            </div>
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${
                triggersExpanded ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Expanded Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              triggersExpanded ? "max-h-40 mt-2" : "max-h-0"
            }`}
          >
            <div className="space-y-1 pl-3">
              <div className="px-3 py-2 text-sm text-[#A0A0A0] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] rounded-md cursor-pointer transition-colors lowercase">
                email trigger
              </div>
              <div className="px-3 py-2 text-sm text-[#A0A0A0] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] rounded-md cursor-pointer transition-colors lowercase">
                schedule trigger
              </div>
              <div className="px-3 py-2 text-sm text-[#A0A0A0] hover:text-[#E5E5E5] hover:bg-[#1A1A1A] rounded-md cursor-pointer transition-colors lowercase">
                webhook trigger
              </div>
            </div>
          </div>

          {/* Add Trigger Button */}
          <button className="w-full mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#E5E5E5] text-sm font-normal transition-all duration-200 lowercase">
            <Plus size={16} />
            add trigger
          </button>

          {/* Trigger Runs */}
          <div className="mt-4 pt-3 border-t border-[#252525]">
            <span className="text-[11px] text-[#666666] lowercase tracking-wider font-normal">
              trigger runs
            </span>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}

