import { useState, useRef, KeyboardEvent } from "react";
import { Paperclip, Smile, Mic, ArrowUp, X, Presentation } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string, attachments: string[]) => void;
  selectedMode: string;
  value?: string;
  onChange?: (message: string) => void;
}

export function ChatInput({ onSubmit, selectedMode, value, onChange }: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>(["Slides"]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use selectedMode to avoid unused variable warning
  console.log('ChatInput mode:', selectedMode);

  // Use controlled or uncontrolled mode
  const message = value !== undefined ? value : internalMessage;
  const setMessage = (newMessage: string) => {
    if (onChange) {
      onChange(newMessage);
    } else {
      setInternalMessage(newMessage);
    }
  };

  const handleSubmit = () => {
    if (message.trim() || attachments.length > 0) {
      onSubmit(message, attachments);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = () => {
    // Simulating file upload
    const fileTypes = ["Document", "Image", "PDF", "Spreadsheet"];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    setAttachments((prev) => [...prev, randomType]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setMessage(message + " [Voice transcription]");
      }, 2000);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full px-4">
      <div className="relative rounded-2xl bg-[#121212] border border-[#252525] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 focus-within:border-[#3A3A3A] focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Décris ce dont tu as besoin d'aide..."
          className="w-full min-h-[60px] max-h-[200px] px-5 pt-4 pb-16 bg-transparent text-[#E5E5E5] text-base placeholder-[#666666] resize-none focus:outline-none scrollbar-thin"
          rows={2}
        />

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* Attachment Button */}
            <button
              onClick={handleFileUpload}
              className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#666666] hover:text-[#A0A0A0] transition-all duration-200"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </button>

            {/* AI Assistant Button */}
            <button
              className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#666666] hover:text-[#A0A0A0] transition-all duration-200 relative"
              aria-label="AI Assistant"
            >
              <Smile size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-[#121212]" />
            </button>

            {/* Attachment Chips */}
            <div className="flex items-center gap-2 ml-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#252525] text-sm text-[#A0A0A0]"
                >
                  <Presentation size={14} />
                  <span>{attachment}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="ml-1 p-0.5 rounded hover:bg-[#252525] text-[#666666] hover:text-[#A0A0A0] transition-colors"
                    aria-label={`Remove ${attachment}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Voice Input */}
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isRecording
                  ? "bg-red-500/20 text-red-400"
                  : "hover:bg-[#1A1A1A] text-[#666666] hover:text-[#A0A0A0]"
              }`}
              aria-label="Voice input"
            >
              <Mic size={20} />
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!message.trim() && attachments.length === 0}
              className="p-3 rounded-full bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              aria-label="Send message"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
