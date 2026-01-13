import type { NextConfig } from 'next';

// Backend URL for Render deployment
const getBackendUrl = (): string => {
  // Use Render backend URL
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://suna-backend.onrender.com';
};

const nextConfig = (): NextConfig => ({
  // Configuration for production deployment only
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),

  // Enable src directory for app router
  srcDir: './src',

  // Only disable checks in production builds
  ...(process.env.NODE_ENV === 'production' ? {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  } : {}),

  // Enable trailing slash for better SEO
  trailingSlash: true,

  serverExternalPackages: ['@supabase/supabase-js'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Images configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

});

export default nextConfig;
