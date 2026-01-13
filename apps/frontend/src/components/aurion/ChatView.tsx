"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, CheckCircle, Presentation, FileText, BarChart3, Layers, Video, Search, Image, X, ChevronRight, Sparkles } from "lucide-react";
import { Mode } from "./ModeSelector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: Mode;
  isTyping?: boolean;
}

interface ChatViewProps {
  initialMessage: string;
  initialMode: Mode;
  onBack: () => void;
}

const modeIcons: Record<Mode, React.ElementType> = {
  slides: Presentation,
  data: BarChart3,
  docs: FileText,
  canvas: Layers,
  video: Video,
  research: Search,
  image: Image,
};

const modeLabels: Record<Mode, string> = {
  slides: "slides",
  data: "data",
  docs: "docs",
  canvas: "canvas",
  video: "video",
  research: "research",
  image: "image",
};

export function ChatView({ initialMessage, initialMode, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState<Mode>(initialMode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with the first message
  useEffect(() => {
    if (initialMessage) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: initialMessage,
        mode: initialMode,
      };
      setMessages([userMsg]);

      // Simulate AI response
      setTimeout(() => {
        setIsGenerating(true);
        generateAIResponse(initialMessage, initialMode);
      }, 500);
    }
  }, []);

  const generateAIResponse = async (userMessage: string, mode: Mode) => {
    // Simulate typing effect
    const responses: Record<Mode, string> = {
      slides: `parfait ! l'outil de présentation est maintenant activé. commençons par la phase 1 : confirmation du sujet.

avant de créer votre présentation de lancement de produit, j'ai besoin de quelques informations pour la personnaliser au maximum :

📋 présentation de lancement de produit

pour créer une présentation impactante, j'ai besoin de précisions :

1. quel est le produit/service que vous lancez ? (nom, domaine, type)
2. qui est votre audience cible ? (investisseurs, clients, partenaires, équipe interne, etc.)
3. quels sont vos objectifs principaux ? (générer de l'intérêt, conclure des ventes, attirer des investisseurs, etc.)
4. avez-vous des spécifications particulières ? (nombre de slides, durée, style, éléments spécifiques à inclure)

donnez-moi autant de détails que possible pour que je crée une présentation vraiment adaptée à votre produit ! 🚀

⏳ aurion continuera à travailler de manière autonome après ta réponse.`,
      data: `excellent ! je vais vous aider à créer une visualisation de données professionnelle.

pour commencer, j'ai besoin de quelques informations :

1. quel type de données souhaitez-vous visualiser ?
2. quel est l'objectif de cette visualisation ?
3. avez-vous des préférences de format (graphiques, tableaux, dashboards) ?

partagez vos données et je m'occupe du reste ! 📊`,
      docs: `je suis prêt à vous aider à créer votre document.

pour un résultat optimal, précisez-moi :

1. quel type de document (rapport, article, présentation) ?
2. quelle est la longueur souhaitée ?
3. quel ton adopter (formel, décontracté, technique) ?

je commence dès que vous me donnez les détails ! 📄`,
      canvas: `mode canvas activé ! je peux vous aider à créer des designs visuels.

que souhaitez-vous créer ?

1. infographie
2. poster
3. design de réseaux sociaux
4. autre chose ?

décrivez votre vision ! 🎨`,
      video: `mode vidéo activé ! je peux vous aider avec :

1. scripts de vidéo
2. storyboards
3. sous-titres
4. descriptions

que puis-je faire pour vous ? 🎬`,
      research: `mode recherche activé ! je vais effectuer une recherche approfondie.

sur quel sujet souhaitez-vous des informations ?

je peux couvrir :
- analyses de marché
- études sectorielles
- recherches académiques
- veille concurrentielle

lancez votre requête ! 🔍`,
      image: `mode image activé ! je peux générer des images pour vous.

décrivez l'image souhaitée avec :

1. le sujet principal
2. le style (réaliste, illustration, artistique)
3. les couleurs dominantes
4. l'ambiance générale

à vous de jouer ! 🖼️`,
    };

    const response = responses[mode];

    // Simulate typing character by character
    let currentText = "";
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      isTyping: true,
    }]);

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10));
      currentText += response[i];
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMsgId
          ? { ...msg, content: currentText }
          : msg
      ));
    }

    setMessages(prev => prev.map(msg =>
      msg.id === assistantMsgId
        ? { ...msg, isTyping: false }
        : msg
    ));

    setIsGenerating(false);
    setShowPreview(true);
    setPreviewContent(modeLabels[mode]);
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      mode: selectedMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsGenerating(true);

    setTimeout(() => {
      generateAIResponse(inputValue, selectedMode);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const ModeIcon = modeIcons[selectedMode];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showPreview ? 'mr-[400px]' : ''}`}>
        {/* Chat Header */}
        <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#0A0A0A] border-b border-[#252525] flex items-center justify-between px-6 z-40">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#E5E5E5] transition-colors text-sm lowercase"
          >
            <ChevronRight size={16} className="rotate-180" />
            retour
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[#E5E5E5] text-sm lowercase">aurion chat</span>
          </div>
          <div className="w-20" />
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pt-20 pb-32 px-4 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.role === "user" ? (
                  <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-[#252525] text-[#E5E5E5] text-sm lowercase">
                    {message.content}
                  </div>
                ) : (
                  <div className="max-w-[80%] space-y-3">
                    <div className="flex items-center gap-2 text-[#A0A0A0] text-xs lowercase">
                      <Sparkles size={14} />
                      aurion
                    </div>
                    <div className="text-[#E5E5E5] text-sm whitespace-pre-wrap lowercase leading-relaxed">
                      {message.content}
                      {message.isTyping && (
                        <span className="inline-block w-2 h-4 bg-[#E5E5E5] ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Exemples de prompts section */}
            {messages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground/60">Exemples de prompts</p>
                  <button
                    data-slot="button"
                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 gap-1.5 has-[&_svg]:px-2.5 h-6 w-6 p-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <div style={{ transform: 'none' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-refresh-cw w-3.5 h-3.5"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M8 16H3v5"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <div
                      className="group cursor-pointer rounded-xl border border-border hover:bg-muted transition-colors duration-150"
                      style={{ opacity: 1, transform: 'none' }}
                      onClick={() => setInputValue("Créer un pitch deck de Série A avec la taille du marché, la traction et les projections financières")}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed flex-1">
                          Créer un pitch deck de Série A avec la taille du marché, la traction et les projections financières
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up-right w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 shrink-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div
                      className="group cursor-pointer rounded-xl border border-border hover:bg-muted transition-colors duration-150"
                      style={{ opacity: 1, transform: 'none' }}
                      onClick={() => setInputValue("Concevoir une présentation all-hands couvrant les mises à jour de l'entreprise et la vision")}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed flex-1">
                          Concevoir une présentation all-hands couvrant les mises à jour de l'entreprise et la vision
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up-right w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 shrink-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div
                      className="group cursor-pointer rounded-xl border border-border hover:bg-muted transition-colors duration-150"
                      style={{ opacity: 1, transform: 'none' }}
                      onClick={() => setInputValue("Concevoir une présentation de lancement de produit avec des vidéos de démo et des témoignages clients")}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed flex-1">
                          Concevoir une présentation de lancement de produit avec des vidéos de démo et des témoignages clients
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up-right w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 shrink-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div
                      className="group cursor-pointer rounded-xl border border-border hover:bg-muted transition-colors duration-150"
                      style={{ opacity: 1, transform: 'none' }}
                      onClick={() => setInputValue("Développer un deck de formation pour les nouvelles fonctionnalités et flux de travail du produit")}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed flex-1">
                          Développer un deck de formation pour les nouvelles fonctionnalités et flux de travail du produit
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-up-right w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 shrink-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-[240px] right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent pt-8 pb-6 px-4 z-30">
          <div className={`max-w-3xl mx-auto transition-all duration-300 ${showPreview ? 'mr-[200px]' : ''}`}>
            <div className="relative rounded-2xl bg-[#121212] border border-[#252525] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 focus-within:border-[#3A3A3A]">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="décris ce dont tu as besoin d'aide..."
                className="w-full min-h-[60px] max-h-[200px] px-5 pt-4 pb-14 bg-transparent text-[#E5E5E5] text-sm placeholder-[#666666] resize-none focus:outline-none scrollbar-thin lowercase"
                rows={2}
              />

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Mode Tag */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#252525] text-sm text-[#A0A0A0] lowercase">
                    <ModeIcon size={14} />
                    <span>{modeLabels[selectedMode]}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isGenerating}
                  className="p-3 rounded-full bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                  aria-label="envoyer"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#0F0F0F] border-l border-[#252525] flex flex-col animate-in slide-in-from-right duration-300 z-50">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#252525]">
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#666666] hover:text-[#A0A0A0] transition-all duration-200"
            >
              <X size={18} />
            </button>
            <span className="text-[#E5E5E5] text-sm lowercase">aurion computer</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#252525] text-[#A0A0A0] text-sm lowercase hover:bg-[#252525] transition-colors">
                action
              </button>
              <button className="px-3 py-1.5 rounded-lg text-[#A0A0A0] text-sm lowercase hover:bg-[#1A1A1A] transition-colors">
                library
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#252525] mb-4">
              <CheckCircle size={28} className="text-[#A0A0A0]" />
            </div>
            <h3 className="text-[#E5E5E5] text-lg lowercase mb-2">
              {previewContent} mode ready
            </h3>
            <p className="text-[#666666] text-sm lowercase mb-6">
              1 tool activated
            </p>
            <button className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#252525] text-[#A0A0A0] text-sm lowercase hover:bg-[#252525] transition-colors">
              {previewContent} tool
            </button>
          </div>

          {/* Preview Footer */}
          <div className="px-4 py-4 border-t border-[#252525]">
            <div className="flex items-center justify-between">
              <span className="text-[#666666] text-xs lowercase">ready</span>
              <div className="flex items-center gap-2 text-[#A0A0A0] text-xs lowercase">
                <span>get aurion apps</span>
                <span>mobile & desktop</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

