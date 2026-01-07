#!/bin/bash

# Render Deployment Script for Kortix
# This script helps deploy the entire Kortix platform to Render

set -e

echo "🚀 Starting Kortix deployment to Render..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}⚠️  Render CLI not found. Using manual instructions instead.${NC}"
    echo -e "${BLUE}📋 Manual Render Deployment Instructions:${NC}"
    echo ""
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create services using render.yaml or manually:"
    echo ""
    echo "   Backend (Web Service):"
    echo "   - Runtime: Python 3"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: python start.py"
    echo ""
    echo "   Frontend (Static Site):"
    echo "   - Build Command: pnpm install && pnpm build"
    echo "   - Publish Directory: apps/frontend/.next"
    echo ""
    echo "   Database (PostgreSQL): Auto-create via Render dashboard"
    echo "   Redis: Auto-create via Render dashboard"
    echo ""
    echo "4. Set environment variables from render-env-example.txt"
    exit 0
fi

# Function to check Render login
check_login() {
    echo -e "${BLUE}🔍 Checking Render authentication...${NC}"
    if ! render whoami &> /dev/null; then
        echo -e "${RED}❌ Not logged in to Render. Please login:${NC}"
        render login
    fi
}

# Function to deploy using render.yaml
deploy_with_yaml() {
    echo -e "${BLUE}📄 Deploying using render.yaml configuration...${NC}"

    if [ ! -f "render.yaml" ]; then
        echo -e "${RED}❌ render.yaml not found in current directory${NC}"
        exit 1
    fi

    echo "Deploying services..."
    render deploy render.yaml

    echo -e "${GREEN}✅ Services deployed! Check your Render dashboard for status.${NC}"
}

# Function to provide manual deployment instructions
manual_instructions() {
    echo -e "${BLUE}📋 Manual Render Deployment Instructions:${NC}"
    echo ""
    echo "Deploy each service manually on Render (NO Docker):"
    echo ""
    echo "1. ${YELLOW}Connect your repository${NC}:"
    echo "   - Go to https://render.com"
    echo "   - Connect your GitHub repository: https://github.com/ILYESS24/canvchat"
    echo ""
    echo "2. ${YELLOW}Create Backend Service${NC}:"
    echo "   - Service Type: Web Service"
    echo "   - Runtime: Python 3"
    echo "   - Root Directory: backend/"
    echo "   - Build Command: pip install -r ../requirements.txt"
    echo "   - Start Command: uvicorn api:app --host 0.0.0.0 --port \$PORT"
    echo ""
    echo "3. ${YELLOW}Create Frontend Service${NC}:"
    echo "   - Service Type: Static Site"
    echo "   - Root Directory: apps/frontend/"
    echo "   - Build Command: pnpm install && pnpm build"
    echo "   - Publish Directory: .next"
    echo ""
    echo "4. ${YELLOW}Create Database Services${NC}:"
    echo "   - PostgreSQL: Create 'kortix-postgres' (managed PostgreSQL)"
    echo "   - Redis: Create 'kortix-redis' (managed Redis)"
    echo ""
    echo "5. ${YELLOW}Set Environment Variables${NC}:"
    echo "   For Backend:"
    echo "   - ENV_MODE=production"
    echo "   - SUPABASE_URL=your_supabase_url"
    echo "   - SUPABASE_ANON_KEY=your_anon_key"
    echo "   - SUPABASE_SERVICE_ROLE_KEY=your_service_key"
    echo "   - OPENAI_API_KEY=your_openai_key"
    echo "   - ANTHROPIC_API_KEY=your_anthropic_key"
    echo "   - DATABASE_URL=[PostgreSQL connection string]"
    echo "   - REDIS_URL=[Redis connection string]"
    echo ""
    echo "   For Frontend:"
    echo "   - NEXT_PUBLIC_BACKEND_URL=[Backend service URL]/v1"
    echo "   - NEXT_PUBLIC_ENV_MODE=production"
    echo ""
    echo "6. ${YELLOW}Link Services${NC}:"
    echo "   - In Render dashboard, link databases to backend service"
    echo "   - Update frontend NEXT_PUBLIC_BACKEND_URL with actual backend URL"
    echo ""
}

# Function to validate deployment
validate_deployment() {
    echo -e "${BLUE}🔍 Validating deployment configuration...${NC}"

    # Check if render.yaml exists
    if [ -f "render.yaml" ]; then
        echo -e "${GREEN}✅ render.yaml found${NC}"
    else
        echo -e "${YELLOW}⚠️  render.yaml not found - using manual deployment${NC}"
    fi

    # Check backend requirements
    if [ -f "backend/requirements.txt" ]; then
        echo -e "${GREEN}✅ Backend requirements.txt found${NC}"
    else
        echo -e "${RED}❌ Backend requirements.txt missing${NC}"
    fi

    # Check frontend package.json
    if [ -f "apps/frontend/package.json" ]; then
        echo -e "${GREEN}✅ Frontend package.json found${NC}"
    else
        echo -e "${RED}❌ Frontend package.json missing${NC}"
    fi

    # Check environment template
    if [ -f "render-env-example.txt" ]; then
        echo -e "${GREEN}✅ Environment template found${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment template not found${NC}"
    fi
}

# Main deployment flow
case "$1" in
    "auto")
        check_login
        deploy_with_yaml
        ;;
    "validate")
        validate_deployment
        ;;
    "manual"|*)
        manual_instructions
        ;;
esac

echo -e "${GREEN}🎉 Render deployment setup completed!${NC}"
echo -e "${BLUE}📖 Next steps:${NC}"
echo "1. Complete the deployment in Render dashboard"
echo "2. Set up environment variables"
echo "3. Configure custom domain (optional)"
echo "4. Test your application"
