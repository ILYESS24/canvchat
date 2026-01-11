import { RefreshCw } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Minim",
    description: "Développer un deck de vente",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    prompt:
      "Créer une présentation professionnelle pour un deck de vente avec des graphiques modernes",
  },
  {
    id: "2",
    title: "Welcome",
    description: "Concevoir une présentation",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    prompt:
      "Créer une présentation d'accueil professionnelle pour une entreprise",
  },
  {
    id: "3",
    title: "721M",
    description: "Construire une revue",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    prompt: "Créer une revue de données avec visualisations et métriques clés",
  },
  {
    id: "4",
    title: "Number Data",
    description: "Créer une mise à jour",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    prompt:
      "Créer une présentation de mise à jour avec données numériques et pourcentages",
  },
];

interface TemplateGalleryProps {
  onSelectTemplate: (prompt: string) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const handleRefresh = () => {
    // Shuffle or load new templates
    console.log("Refreshing templates...");
  };

  return (
    <div className="mx-auto max-w-4xl w-full px-4 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#666666]">
          Exemples de prompts
        </h3>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[#666666] hover:text-[#A0A0A0] transition-all duration-200"
          aria-label="Refresh templates"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.prompt)}
            className="group relative flex flex-col rounded-xl overflow-hidden bg-[#121212] border border-[#252525] transition-all duration-200 hover:border-[#3A3A3A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={template.imageUrl}
                alt={template.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-lg font-semibold text-white">
                  {template.title}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 text-left">
              <p className="text-sm text-[#A0A0A0] line-clamp-2">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
