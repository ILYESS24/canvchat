# 🚀 Déploiement Kortix sur Render

## 📋 Architecture Déploiement

Kortix utilise une **architecture séparée** :
- **Frontend** : Interface React (Static Site)
- **Backend** : API FastAPI (Web Service)

### 🏠 Développement Local
```bash
# Terminal 1 - Frontend
cd suna-main/suna-main
npx vite --host --port 5173

# Terminal 2 - Backend (optionnel)
cd suna-main/backend
python simple_api.py
```

**URLs locales :**
- Frontend : `http://localhost:5173/`
- Backend : `http://localhost:8000/`

### 🌐 Production sur Render
**2 déploiements séparés :**
- **Frontend** → Static Site : `https://kortix-frontend-xyz.onrender.com/`
- **Backend** → Web Service : `https://kortix-backend-xyz.onrender.com/`

## 🛠️ Déployer sur Render

### Étape 1 : Build l'application
```bash
cd suna-main
npm run build
```

### Étape 2 : Créer un compte Render
1. Allez sur https://render.com/
2. Créez un compte gratuit

### Étape 3 : Connecter GitHub
1. Connectez votre compte GitHub
2. Sélectionnez ce repository

### Étape 4 : Déployer le Frontend
1. Cliquez "New" → "Static Site"
2. Connectez votre repo GitHub
3. Configurez :
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
4. Cliquez "Create Static Site"

### Étape 5 : Obtenir l'URL
Une fois déployé, Render vous donne une URL comme :
`https://kortix-frontend-xyz.onrender.com/`

## 🎯 Comment accéder à votre app déployée

**APRÈS déploiement sur Render :**
- ❌ **PAS** : `http://localhost:5173/` (c'est local)
- ✅ **OUI** : `https://votre-app.onrender.com/` (URL Render)

## 🔍 Vérifications

### Avant déploiement :
```bash
# Test local
npm run dev  # → http://localhost:5173/

# Build de production
npm run build  # Crée le dossier dist/
npm run preview  # Test le build → http://localhost:4173/
```

### Après déploiement :
1. Allez sur votre URL Render
2. L'interface Kortix devrait s'afficher
3. Testez l'icône Network 🌐

## 🚨 Dépannage

**Si ça ne marche pas :**
1. Vérifiez les logs de build sur Render
2. Assurez-vous que `npm run build` fonctionne localement
3. Vérifiez que le dossier `dist/` est créé

**Erreur commune :**
- Ne pas confondre localhost (développement) avec l'URL Render (production)
