"use client";

import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ModeSelector, Mode } from "./ModeSelector";
import { ChatView } from "./ChatView";

type View = "home" | "chat";

export function KortixInterface() {
  const [selectedMode, setSelectedMode] = useState<Mode>("slides");
  const [inputMessage, setInputMessage] = useState("");
  const [currentView, setCurrentView] = useState<View>("home");
  const [chatInitialMessage, setChatInitialMessage] = useState("");
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

  const handleSubmit = (message: string) => {
    if (message.trim()) {
      setChatInitialMessage(message);
      setCurrentView("chat");
    }
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setInputMessage("");
    setChatInitialMessage("");
  };

  // Render Chat View
  if (currentView === "chat") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <ChatView
          initialMessage={chatInitialMessage}
          initialMode={selectedMode}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Hero Question */}
        <h1 className="text-center text-4xl md:text-5xl font-light text-[#E5E5E5] tracking-tight lowercase mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          what do you want to accomplish?
        </h1>

        {/* Upgrade Banner */}
        {showUpgradeBanner && (
          <div className="bg-card border border-border rounded-3xl p-2 w-full transition-all duration-200 cursor-pointer hover:shadow-md mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center relative ml-2">
                <div className="absolute" style={{ opacity: 1, transform: 'none' }}>
                  <div className="flex items-center">
                    <img alt="Plus" className="object-contain" src="/plan-icons/plus.svg" style={{ height: '14px', width: 'auto' }} />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-medium text-foreground truncate">Unlock the full Kortix experience</h4>
                </div>
                <span className="text-xs text-muted-foreground truncate block">Kortix Advanced mode, 100+ Integrations, Triggers, Custom AI Workers &amp; more</span>
              </div>
              <button
                onClick={() => setShowUpgradeBanner(false)}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:hover:bg-accent/50 size-9 h-8 w-8 flex-shrink-0 hover:bg-muted/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 text-muted-foreground hover:text-foreground transition-colors">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          onSubmit={handleSubmit}
          selectedMode={selectedMode}
          value={inputMessage}
          onChange={setInputMessage}
        />

        {/* Mode Selector */}
        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />
      </div>
    </div>
  );
}

