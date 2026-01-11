#!/bin/bash

# Deploy to Cloudflare Pages
echo "🚀 Deploying Suna to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Build the frontend
echo "📦 Building frontend..."
cd apps/frontend
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare Pages..."
cd ../..
npx wrangler pages deploy apps/frontend/out --compatibility-date 2024-01-01

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on Cloudflare Pages"
else
    echo "❌ Deployment failed"
    exit 1
fi
