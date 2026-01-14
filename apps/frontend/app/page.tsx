"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Sparkles, X, FileText, Image as ImageIcon, Loader2, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// OpenRouter model selection based on query type
const selectBestModel = (query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes("code") || q.includes("programming") || q.includes("debug")) {
    return "anthropic/claude-3.5-sonnet";
  }
  if (q.includes("write") || q.includes("story") || q.includes("creative")) {
    return "openai/gpt-4-turbo";
  }
  if (q.includes("math") || q.includes("calculate") || q.includes("analyze")) {
    return "anthropic/claude-3.5-sonnet";
  }
  if (q.includes("presentation") || q.includes("slide")) {
    return "openai/gpt-4-turbo";
  }
  if (q.length < 50) {
    return "mistralai/mixtral-8x7b-instruct";
  }
  
  return "anthropic/claude-3.5-sonnet";
};

export default function LandingPage() {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [phase, setPhase] = useState<"landing" | "chat">("landing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamedContent]);

  const callOpenRouter = async (userMessage: string) => {
    const model = selectBestModel(userMessage);
    setSelectedModel(model);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Interface"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "Tu es un assistant IA avancé et polyvalent. Tu réponds de manière claire, structurée et utile. Tu utilises des emojis pour rendre tes réponses plus engageantes."
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage }
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullContent += content;
                  setStreamedContent(fullContent);
                }
              } catch (e) {
                // Skip
              }
            }
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error("OpenRouter Error:", error);
      return "Désolé, une erreur s'est produite. Veuillez réessayer.";
    }
  };

  const handleSubmit = async () => {
    if (!message.trim() && files.length === 0) return;

    const userMessage = message.trim();
    setMessage("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage
    };

    if (phase === "landing") {
      setPhase("chat");
    }

    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setStreamedContent("");

    const response = await callOpenRouter(userMessage);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsGenerating(false);
    setStreamedContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev: File[]) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev: File[]) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon size={14} className="text-white/70" />;
    return <FileText size={14} className="text-white/70" />;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // ========================================
  // INTERFACE LANDING (PAGE D'ACCUEIL)
  // ========================================
  if (phase === "landing") {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Art - Van Gogh Starry Night */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          
          {/* Title */}
          <div className="mb-16 animate-slide-down">
            <h1 
              className="text-6xl md:text-8xl font-serif italic text-white/90 tracking-wide text-center drop-shadow-2xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ignite curiosity
            </h1>
          </div>

          {/* Prompt Area */}
          <div className="w-full max-w-4xl animate-slide-up">
            {/* Files Preview */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="group flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-xl rounded-2xl hover:bg-white/10 transition-all"
                  >
                    {getFileIcon(file)}
                    <span className="text-xs text-white/80 max-w-[120px] truncate">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="p-0.5 hover:bg-white/20 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <X size={12} className="text-white/70" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Container */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-[32px] blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all duration-300 hover:bg-white/8 focus-within:bg-white/10">
                <div className="flex items-center gap-3 px-5 py-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <Paperclip size={20} className="text-white/70" />
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How can I help you today?"
                    rows={1}
                    className="flex-1 bg-transparent text-white text-base placeholder-white/40 resize-none focus:outline-none min-h-[28px] max-h-[200px] py-1"
                    style={{ scrollbarWidth: 'none' }}
                  />

                  <button
                    onClick={toggleRecording}
                    className={`flex-shrink-0 p-2 rounded-2xl transition-all ${
                      isRecording ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <Mic size={20} />
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() && files.length === 0}
                    className={`flex-shrink-0 p-2 rounded-2xl transition-all ${
                      message.trim() || files.length > 0
                        ? "bg-white/90 text-black hover:bg-white hover:scale-105"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.md,.csv,.json"
            />

            <p className="text-center text-white/30 text-xs mt-4">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // INTERFACE CHAT
  // ========================================
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Art - Van Gogh Starry Night */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        
        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className="animate-message-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3">
                      <p className="text-sm text-white/90 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center">
                        <Sparkles size={12} className="text-white/70" />
                      </div>
                      <span className="text-xs text-white/50 font-medium">
                        {selectedModel.split("/")[1] || "ai"}
                      </span>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3 max-w-[85%]">
                      <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Streaming Response */}
            {isGenerating && streamedContent && (
              <div className="animate-message-in">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center animate-pulse">
                      <Sparkles size={12} className="text-white/70" />
                    </div>
                    <span className="text-xs text-white/50 font-medium">
                      {selectedModel.split("/")[1] || "ai"} • generating...
                    </span>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-3 max-w-[85%]">
                    <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                      {streamedContent}
                      <span className="inline-block w-1.5 h-4 bg-white/60 animate-blink ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {isGenerating && !streamedContent && (
              <div className="flex items-center gap-3 animate-fade-in">
                <Loader2 size={18} className="text-white/40 animate-spin" />
                <span className="text-sm text-white/50">Selecting best model & generating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2">
              <div className="flex flex-col gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Décris ce dont tu as besoin d'aide..."
                  rows={2}
                  disabled={isGenerating}
                  className="w-full bg-transparent text-white text-sm placeholder-white/40 resize-none focus:outline-none px-3 py-3 min-h-[72px] max-h-[200px]"
                  style={{ scrollbarWidth: 'none' }}
                />
                
                <div className="flex items-center justify-between px-2 pb-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-2xl bg-white/5 text-white/70 hover:bg-white/10 transition-all"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleRecording}
                      className={`p-2 rounded-2xl transition-all ${
                        isRecording ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Mic size={16} />
                    </button>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={isGenerating || (!message.trim() && files.length === 0)}
                      className={`p-2 rounded-2xl transition-all ${
                        message.trim() && !isGenerating
                          ? "bg-white/90 text-black hover:bg-white hover:scale-105"
                          : "bg-white/5 text-white/30 cursor-not-allowed"
                      }`}
                    >
                      {isGenerating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.md,.csv,.json"
      />
    </div>
  );
}
