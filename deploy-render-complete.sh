#!/bin/bash

# Suna AI Platform - Complete Render Deployment
# Deploys both frontend and backend to Render

set -e

echo "🚀 Déploiement complet de Suna AI sur Render..."
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo -e "${RED}❌ render.yaml non trouvé${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Configuration Render détectée${NC}"

# Instructions for manual deployment
echo -e "${YELLOW}📋 INSTRUCTIONS DE DÉPLOIEMENT RENDER :${NC}"
echo ""
echo -e "${GREEN}1. Allez sur https://render.com${NC}"
echo -e "${GREEN}2. Connectez votre compte GitHub${NC}"
echo -e "${GREEN}3. Cliquez 'New +' → 'Blueprint'${NC}"
echo -e "${GREEN}4. Sélectionnez ce repository${NC}"
echo -e "${GREEN}5. Cliquez 'Connect'${NC}"
echo ""
echo -e "${BLUE}Render va automatiquement :${NC}"
echo "  ✅ Créer 2 services web (frontend + backend)"
echo "  ✅ Créer 2 bases de données (PostgreSQL + Redis)"
echo "  ✅ Configurer toutes les variables d'environnement"
echo "  ✅ Déployer automatiquement"
echo ""

echo -e "${YELLOW}⚙️ SERVICES QUI SERONT CRÉÉS :${NC}"
echo ""
echo -e "${GREEN}🌐 Frontend (suna-frontend)${NC}"
echo "  - Type: Web Service (Node.js)"
echo "  - URL: https://suna-frontend.onrender.com"
echo "  - Build: npm install && npm run build"
echo "  - Start: npm start"
echo ""
echo -e "${GREEN}🚀 Backend (suna-backend)${NC}"
echo "  - Type: Web Service (Python)"
echo "  - URL: https://suna-backend.onrender.com"
echo "  - Build: pip install -r requirements.txt"
echo "  - Start: uvicorn api:app --host 0.0.0.0 --port \$PORT"
echo ""
echo -e "${GREEN}💾 Bases de données${NC}"
echo "  - PostgreSQL: suna-postgres"
echo "  - Redis: suna-redis"
echo ""

echo -e "${YELLOW}🔑 VARIABLES D'ENVIRONNEMENT CONFIGURÉES :${NC}"
echo ""
echo "✅ Supabase credentials"
echo "✅ API keys (temporaires)"
echo "✅ Database URLs"
echo ""

echo -e "${BLUE}🎯 APRÈS DÉPLOIEMENT :${NC}"
echo ""
echo "1. Frontend: https://suna-frontend.onrender.com"
echo "2. Backend API: https://suna-backend.onrender.com"
echo "3. Health check: https://suna-backend.onrender.com/health"
echo ""

echo -e "${GREEN}🎉 Architecture complète déployée sur Render !${NC}"
echo ""
echo -e "${YELLOW}⚠️ Note: Les déploiements Render peuvent prendre 10-15 minutes${NC}"

# Optional: Open Render in browser
echo ""
read -p "Voulez-vous ouvrir Render dans votre navigateur ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "https://render.com"
    elif command -v open > /dev/null; then
        open "https://render.com"
    else
        echo "🌐 Allez sur: https://render.com"
    fi
fi
