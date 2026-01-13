/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {},
  },
  // Configuration explicite pour éviter les problèmes de workspace
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost', 'kortix.com', 'api.qrserver.com'],
    unoptimized: true, // Pour éviter les problèmes avec les images en développement
  },
  // Proxy pour contourner les problèmes CORS en développement
  async rewrites() {
    return [
      {
        source: '/api/composio/:path*',
        destination: 'https://suna-backend.onrender.com/composio/:path*',
      },
    ]
  },
  // Désactiver la génération automatique des favicons problématiques
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Configuration pour éviter les erreurs de modules manquants
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
