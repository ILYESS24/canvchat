'use client';

const showcaseItems = [
  {
    id: 'slides',
    title: 'Slides',
    description: 'Create stunning presentations instantly. From pitch decks to reports to training materials. Adjusts themes, layouts, content structure, or refines existing decks with quick edits and updates.',
    capabilities: ['Pitch decks', 'Training material', 'Report presentations', 'Theme & layout variations', 'Content restructuring', '+ Much more'],
    fileName: 'Nexus Enterprise Automation Platform slide example',
    fileType: 'PPTX',
    buttonText: 'Try it out→'
  },
  {
    id: 'data',
    title: 'Data',
    description: 'Transforms raw data into insights. From spreadsheets to dashboards to visualizations. Cleans datasets, creates charts, builds reports, or refines existing analyses with quick updates.',
    capabilities: ['Dashboards', 'Visualizations', 'Data reports', 'Clean & organize data', 'Generate insights', '+ Much more'],
    fileName: 'Financial Model Dashboard example',
    fileType: 'Preview',
    buttonText: 'Try it out→'
  },
  {
    id: 'docs',
    title: 'Docs',
    description: 'Writes and edits documents effortlessly. From proposals to guides to content pieces. Adjusts tone, structure, formatting, or refines existing documents with quick rewrites and polish.',
    capabilities: ['Proposals', 'Guides & manuals', 'Content pieces', 'Tone & style variations', 'Format & restructure', '+ Much more'],
    fileName: 'Q3 2025 Executive Summary Report example',
    fileType: 'PDF',
    buttonText: 'Try it out→'
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Researches topics comprehensively. From market trends to competitive analysis to deep dives. Gathers sources, synthesizes findings, or refines existing research with quick updates.',
    capabilities: ['Analyze market trends', 'Competitive research', 'Deep topic dives', 'Gather sources', 'Synthesize findings', '+ Much more'],
    fileName: 'Detailed Competitor Profiles research example',
    fileType: 'PDF',
    buttonText: 'Try it out→'
  },
  {
    id: 'images',
    title: 'Images',
    description: 'Create images on demand. From product shots to social graphics to full illustrations. Adjusts style, lighting, colors, and layout, or refines existing visuals with quick edits and touch-ups.',
    capabilities: ['Generate product shots', 'Create social graphics', 'Make illustrations', 'Style & lighting variations', 'Logo / asset creation', '+ Much more'],
    fileName: 'Growth Isn\'t Linear graphic example',
    fileType: 'image',
    buttonText: 'Try it out→'
  }
];

export function KortixShowcase() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {showcaseItems.map((item, index) => (
            <div key={item.id} className="flex flex-col lg:flex-row items-center gap-12">
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  {item.title}
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {item.description}
                </p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.capabilities.map((capability, capIndex) => (
                    <span
                      key={capIndex}
                      className="bg-white text-gray-700 px-3 py-1 rounded text-sm border border-gray-200"
                    >
                      {capability}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  {item.buttonText}
                </button>
              </div>

              {/* Preview */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Computer Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-black">Kortix</div>
                      <div className="text-lg font-bold text-black">Kortix</div>
                      <div className="text-lg font-bold text-black">Kortix Computer</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Running</span>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="bg-gray-900 h-64 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-lg font-medium mb-2">{item.fileName}</div>
                      <div className="text-sm text-gray-400">{item.fileType}</div>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="bg-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">📄</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.fileType}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
