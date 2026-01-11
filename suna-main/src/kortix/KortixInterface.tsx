import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ChatInput } from "./ChatInput";
import { ModeSelector, Mode } from "./ModeSelector";

type NavItem = "chats" | "library" | "triggers";

export function KortixInterface() {
  const [activeNav, setActiveNav] = useState<NavItem>("triggers");
  const [selectedMode, setSelectedMode] = useState<Mode>("slides");
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (message: string, attachments: string[]) => {
    console.log("Submitting:", { message, attachments, mode: selectedMode });
    // Handle submission logic here
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl px-4 flex flex-col items-center justify-center">
          {/* Hero Question */}
          <h1 className="text-center text-4xl md:text-5xl font-normal text-[#E5E5E5] mb-10 tracking-tight font-poppins">
            what do you want to accomplish?
          </h1>

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
      </main>
    </div>
  );
}
