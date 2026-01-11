import React, { useState } from "react";
import {
  ChevronDown,
  Paperclip,
  Mic,
  ArrowRight,
  MonitorPlay,
  BarChart3,
  FileText,
  Layout,
  Video,
  Search,
  Image as ImageIcon,
  X,
  RefreshCw,
  Cloud,
  Network,
  Library,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HomeViewProps {
  onStartChat: () => void;
}

export const HomeView = ({ onStartChat }: HomeViewProps) => {
  const [activeTab, setActiveTab] = useState("Slides");
  const [showIntegrationsPopup, setShowIntegrationsPopup] = useState(false);

  // Debug logging pour éviter les erreurs asynchrones
  React.useEffect(() => {
    console.log('🔍 HomeView mounted - React version:', React.version);
    console.log('🔍 Popup state:', showIntegrationsPopup);

    // Cleanup function pour éviter les memory leaks
    return () => {
      console.log('🧹 HomeView unmounting...');
    };
  }, [showIntegrationsPopup]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0D0D0D] text-[#F5F5F5] font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-transparent flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1A1A1A] px-2 py-1 rounded-md transition-colors">
          <span className="font-heading font-bold text-lg">AURION CHAT</span>
          <ChevronDown className="w-4 h-4 text-[#A0A0A0]" />
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-5xl mx-auto w-full overflow-y-auto scrollbar-hide">

        {/* Hero Text */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center tracking-tight">
          Qu'est-ce que tu veux accomplir ?
        </h1>

        {/* Upgrade Banner */}
        <div className="w-full max-w-3xl bg-[#151515] border border-[#2A2A2A] rounded-xl p-4 mb-6 flex items-center justify-between relative group">
          <div className="flex items-center gap-3">
            <Badge className="bg-[#2A2A2A] text-[#A0A0A0] hover:bg-[#2A2A2A] border-0 px-2 py-0.5 text-xs font-normal">⌘ Plus</Badge>
            <div>
              <div className="font-medium text-sm">Unlock the full Kortix experience</div>
              <div className="text-xs text-[#A0A0A0]">Kortix Advanced mode, 100+ Integrations, Triggers, Custom AI Workers & more</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A]">
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Main Input Area */}
        <div className="w-full max-w-3xl relative mb-6">
          <div className="bg-[#151515] border border-[#2A2A2A] rounded-2xl p-4 min-h-[140px] flex flex-col shadow-lg transition-all focus-within:border-[#333] focus-within:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <textarea
              placeholder="Décris ce dont tu as besoin d'aide..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-[#F5F5F5] placeholder:text-[#555] text-lg min-h-[60px] outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onStartChat();
                }
              }}
            />

            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-[#F5F5F5]">
                  <Paperclip className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#0066FF] hover:bg-[#2A2A2A] relative border border-[#333]/50">
                    <Cloud className="w-4 h-4 fill-current" />
                </Button>

                <button
                  className="h-9 w-9 rounded-full text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-[#F5F5F5] transition-all duration-200 flex items-center justify-center border border-transparent hover:border-[#3A3A3A] hover:scale-105 active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🌐 Network icon clicked! Opening integrations popup...');
                    try {
                      setShowIntegrationsPopup(true);
                      console.log('✅ Popup state set successfully');
                    } catch (error) {
                      console.error('❌ Error opening popup:', error);
                    }
                  }}
                  title="Voir toutes les intégrations"
                >
                  <Network className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 bg-[#222] rounded-full px-3 py-1.5 border border-[#333] cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                  <MonitorPlay className="w-3.5 h-3.5 text-[#F5F5F5]" />
                  <span className="text-xs font-medium">Slides</span>
                  <X className="w-3 h-3 text-[#A0A0A0] ml-1" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-[#F5F5F5]">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={onStartChat}
                  className="h-9 w-9 rounded-xl bg-[#2A2A2A] hover:bg-[#333] text-[#F5F5F5] border border-[#333]"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="w-full max-w-3xl flex items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          <TypeButton icon={<MonitorPlay className="w-4 h-4" />} label="Slides" active={activeTab === "Slides"} onClick={() => setActiveTab("Slides")} />
          <TypeButton icon={<BarChart3 className="w-4 h-4" />} label="Data" active={activeTab === "Data"} onClick={() => setActiveTab("Data")} />
          <TypeButton icon={<FileText className="w-4 h-4" />} label="Docs" active={activeTab === "Docs"} onClick={() => setActiveTab("Docs")} />
          <TypeButton icon={<Layout className="w-4 h-4" />} label="Canvas" active={activeTab === "Canvas"} onClick={() => setActiveTab("Canvas")} />
          <TypeButton icon={<Video className="w-4 h-4" />} label="Video" active={activeTab === "Video"} onClick={() => setActiveTab("Video")} />
          <TypeButton icon={<Search className="w-4 h-4" />} label="Research" active={activeTab === "Research"} onClick={() => setActiveTab("Research")} />
          <TypeButton icon={<ImageIcon className="w-4 h-4" />} label="Image" active={activeTab === "Image"} onClick={() => setActiveTab("Image")} />
        </div>

        {/* Template Gallery */}
        <div className="w-full max-w-4xl">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm text-[#555] font-medium">Exemples de prompts</h3>
             <Button variant="ghost" size="icon" className="h-6 w-6 text-[#555] hover:text-[#A0A0A0]">
               <RefreshCw className="w-3 h-3" />
             </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <TemplateCard
               image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80"
               title="Minim"
               subtitle="Développer un deck de vente"
               onClick={onStartChat}
             />
             <TemplateCard
               title="Welcome to this presentation!"
               subtitle="Concevoir une présentation"
               type="text"
               onClick={onStartChat}
             />
             <TemplateCard
               title="721M"
               subtitle="Construire une revue"
               extra="10,000 3112K"
               type="data"
               color="bg-[#00D9B4]"
               onClick={onStartChat}
             />
             <TemplateCard
               title="%"
               subtitle="Créer une mise à jour"
               topText="Number Data"
               type="big-text"
               onClick={onStartChat}
             />
           </div>
        </div>

      </main>

      {/* Integrations Popup */}
      {showIntegrationsPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                  <Network className="w-5 h-5 text-[#F5F5F5]" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-bold text-[#F5F5F5]">Toutes les Intégrations</h2>
                  <p className="text-sm text-[#A0A0A0]">Découvrez tous les outils et capacités de Kortix</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log('❌ Closing integrations popup...');
                  try {
                    setShowIntegrationsPopup(false);
                    console.log('✅ Popup closed successfully');
                  } catch (error) {
                    console.error('❌ Error closing popup:', error);
                  }
                }}
                className="h-8 w-8 text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#2A2A2A]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
              <div className="space-y-8">
                {/* AI Agents */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    🤖 Agents IA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <IntegrationCard
                      icon="🧠"
                      title="Data Analyst"
                      description="Analyse des données et création de rapports"
                      status="active"
                    />
                    <IntegrationCard
                      icon="💻"
                      title="Code Assistant"
                      description="Aide programmation et développement"
                      status="active"
                    />
                    <IntegrationCard
                      icon="📝"
                      title="Content Writer"
                      description="Création de contenu marketing"
                      status="active"
                    />
                  </div>
                </div>

                {/* Content Types */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    📄 Types de Contenu
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ContentTypeCard icon={<MonitorPlay className="w-5 h-5" />} title="Slides" color="text-blue-400" />
                    <ContentTypeCard icon={<BarChart3 className="w-5 h-5" />} title="Data" color="text-purple-400" />
                    <ContentTypeCard icon={<FileText className="w-5 h-5" />} title="Docs" color="text-green-400" />
                    <ContentTypeCard icon={<Layout className="w-5 h-5" />} title="Canvas" color="text-orange-400" />
                    <ContentTypeCard icon={<Video className="w-5 h-5" />} title="Video" color="text-red-400" />
                    <ContentTypeCard icon={<Search className="w-5 h-5" />} title="Research" color="text-cyan-400" />
                    <ContentTypeCard icon={<ImageIcon className="w-5 h-5" />} title="Image" color="text-pink-400" />
                  </div>
                </div>

                {/* Special Modes */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    ⚡ Modes Spéciaux
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModeCard
                      title="Presentation Mode"
                      description="Création de présentations avec Kortix Computer"
                      features={["Mode immersif", "Outil Computer intégré", "Vidéos et démos"]}
                      color="bg-blue-500/20 border-blue-500/30"
                    />
                    <ModeCard
                      title="Ultra/Pro Mode"
                      description="Accès aux fonctionnalités avancées"
                      features={["100+ intégrations", "AI Workers personnalisés", "Triggers avancés"]}
                      color="bg-cyan-500/20 border-cyan-500/30"
                    />
                  </div>
                </div>

                {/* Automation & Triggers */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    🔧 Automatisation
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TriggerTypeCard icon="📧" title="Email" />
                    <TriggerTypeCard icon="🔗" title="Webhook" />
                    <TriggerTypeCard icon="⏰" title="Schedule" />
                    <TriggerTypeCard icon="🔌" title="API" />
                  </div>
                </div>

                {/* Tools & Features */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    🛠️ Outils & Fonctionnalités
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ToolCard
                      icon={<Cloud className="w-5 h-5" />}
                      title="Kortix Computer"
                      description="Environnement d'exécution avancé"
                    />
                    <ToolCard
                      icon={<Library className="w-5 h-5" />}
                      title="Library"
                      description="Gestion du contenu généré"
                    />
                    <ToolCard
                      icon={<Zap className="w-5 h-5" />}
                      title="Triggers System"
                      description="Automatisation des workflows"
                    />
                    <ToolCard
                      icon={<Paperclip className="w-5 h-5" />}
                      title="File Upload"
                      description="Import de documents et médias"
                    />
                    <ToolCard
                      icon={<Mic className="w-5 h-5" />}
                      title="Voice Input"
                      description="Saisie vocale intelligente"
                    />
                    <ToolCard
                      icon={<RefreshCw className="w-5 h-5" />}
                      title="Template Gallery"
                      description="Exemples de prompts prédéfinis"
                    />
                  </div>
                </div>

                {/* Technical Stack */}
                <div>
                  <h3 className="text-lg font-heading font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    🏗️ Stack Technique
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TechCard title="React 18" description="Frontend moderne" />
                    <TechCard title="TypeScript" description="Type safety" />
                    <TechCard title="FastAPI" description="Backend Python" />
                    <TechCard title="Tailwind CSS" description="Styling framework" />
                    <TechCard title="Radix UI" description="Composants accessibles" />
                    <TechCard title="Lucide Icons" description="Bibliothèque d'icônes" />
                    <TechCard title="Vite" description="Build tool rapide" />
                    <TechCard title="Supabase" description="Base de données" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const TypeButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
      active
        ? "bg-[#F5F5F5] text-black border-[#F5F5F5]"
        : "bg-transparent text-[#A0A0A0] border-[#2A2A2A] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const TemplateCard = ({ image, title, subtitle, topText, type = "image", color, onClick }: any) => {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className={cn(
        "h-32 rounded-xl overflow-hidden mb-3 border border-[#2A2A2A] relative transition-transform group-hover:-translate-y-1 group-hover:shadow-lg",
        type === "text" ? "bg-white text-black p-4 flex items-center" :
        type === "data" ? "bg-[#1A1A1A] p-4 flex flex-col justify-between" :
        type === "big-text" ? "bg-[#F5F5F5] text-black p-4" : "bg-[#1A1A1A]"
      )}>
        {type === "image" && (
          <div className="h-full w-full relative">
            <img src={image} alt="" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-end p-4">
               <span className="text-white font-heading font-bold text-xl">{title}</span>
            </div>
          </div>
        )}

        {type === "text" && (
           <h3 className="font-heading text-2xl font-bold leading-tight">{title}</h3>
        )}

        {type === "data" && (
           <div className="w-full h-full flex flex-col">
             <div className="flex justify-between items-start">
               <div className={cn("px-2 py-0.5 rounded text-xs font-bold", color ? "bg-[#00D9B4] text-black" : "bg-gray-200")}>
                 {title}
               </div>
               <div className="text-[10px] text-gray-400">Overview of Key<br/>Yearly Achievements</div>
             </div>
             <div className="flex items-end gap-2 mt-auto">
                <span className="text-xs bg-gray-800 text-white px-1 rounded">4,876</span>
                <span className="text-2xl text-white font-mono">721M</span>
             </div>
           </div>
        )}

        {type === "big-text" && (
          <div className="h-full flex flex-col">
            <div className="text-xs font-bold uppercase mb-1">{topText}</div>
            <div className="text-[10px] text-gray-500">Visualization</div>
            <div className="mt-auto self-end text-6xl font-light">{title}</div>
          </div>
        )}
      </div>
      <div className="text-xs text-[#A0A0A0] group-hover:text-[#F5F5F5] transition-colors">{subtitle}</div>
    </div>
  )
};

// Integration Components
const IntegrationCard = ({ icon, title, description, status }: { icon: string, title: string, description: string, status: string }) => (
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#3A3A3A] transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
    </div>
    <h4 className="font-medium text-[#F5F5F5] mb-1">{title}</h4>
    <p className="text-sm text-[#A0A0A0]">{description}</p>
  </div>
);

const ContentTypeCard = ({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) => (
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 flex items-center gap-3 hover:border-[#3A3A3A] transition-colors">
    <div className={`w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <span className="text-sm font-medium text-[#F5F5F5]">{title}</span>
  </div>
);

const ModeCard = ({ title, description, features, color }: { title: string, description: string, features: string[], color: string }) => (
  <div className={`border rounded-xl p-4 ${color}`}>
    <h4 className="font-medium text-[#F5F5F5] mb-2">{title}</h4>
    <p className="text-sm text-[#A0A0A0] mb-3">{description}</p>
    <ul className="space-y-1">
      {features.map((feature, index) => (
        <li key={index} className="text-xs text-[#A0A0A0] flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-current"></span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const TriggerTypeCard = ({ icon, title }: { icon: string, title: string }) => (
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 text-center hover:border-[#3A3A3A] transition-colors">
    <div className="text-2xl mb-2">{icon}</div>
    <span className="text-sm font-medium text-[#F5F5F5]">{title}</span>
  </div>
);

const ToolCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 hover:border-[#3A3A3A] transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center text-[#F5F5F5]">
        {icon}
      </div>
      <h4 className="font-medium text-[#F5F5F5]">{title}</h4>
    </div>
    <p className="text-sm text-[#A0A0A0]">{description}</p>
  </div>
);

const TechCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 text-center hover:border-[#3A3A3A] transition-colors">
    <h4 className="font-medium text-[#F5F5F5] text-sm mb-1">{title}</h4>
    <p className="text-xs text-[#A0A0A0]">{description}</p>
  </div>
);
