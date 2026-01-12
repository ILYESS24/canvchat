export function KortixHero() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
          Let's build something awesome
        </h1>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="text-3xl font-bold text-black">Kortix</div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Slides', 'Data', 'Docs', 'Canvas', 'Video', 'Research', 'Image'].map((category) => (
            <span
              key={category}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6">
            Kortix: Your Autonomous AI Worker
          </h2>
          <p className="text-xl text-gray-600">
            Built for complex tasks, designed for everything. The ultimate AI assistant that handles it all—from simple requests to mega-complex projects.
          </p>
        </div>
      </div>
    </section>
  );
}
