#!/bin/bash

# Vercel Deployment Script for Suna Web
# This script helps deploy Suna Web platform to Vercel

set -e

echo "🚀 Starting Suna Web deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login:${NC}"
    vercel login
fi

# Deploy to Vercel
echo -e "${BLUE}📦 Deploying to Vercel...${NC}"

# Set production environment
export VERCEL_ENV=production

# Deploy
vercel --prod

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${BLUE}🌐 Your app should be live at the URL shown above${NC}"

# Instructions for environment variables
echo -e "${YELLOW}⚙️  Don't forget to set environment variables in Vercel dashboard:${NC}"
echo "   - BACKEND_URL (if using external backend)"
echo "   - DATABASE_URL"
echo "   - REDIS_URL"
echo "   - SUPABASE_URL, SUPABASE_ANON_KEY, etc."
echo ""
echo -e "${BLUE}📖 Next steps:${NC}"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Test your application"
echo "3. Configure custom domain (optional)"
