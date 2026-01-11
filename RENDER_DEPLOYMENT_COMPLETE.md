# 🚀 SUNA AI - GUIDE COMPLET DE DÉPLOIEMENT RENDER

## 🎯 Vue d'ensemble

Ce guide détaille **TOUTES** les étapes pour déployer Suna AI complètement sur Render avec :
- Frontend Next.js
- Backend Python/FastAPI
- Base de données PostgreSQL
- Cache Redis
- Authentification Supabase

---

## 📋 PRÉREQUIS

### ✅ Repository GitHub
- Repository connecté : `https://github.com/ILYESS24/canvchat`
- Branche principale : `main`

### ✅ Compte Render
- Inscription gratuite : [render.com](https://render.com)
- Vérification email
- Connexion GitHub activée

---

## 🚀 ÉTAPE 1 : CONNEXION À RENDER

### Commandes à exécuter :

```bash
# 1. Ouvrir Render dans le navigateur
start https://render.com

# 2. Se connecter avec GitHub
# (Cliquer "Continue with GitHub")
```

---

## 🚀 ÉTAPE 2 : CRÉATION DU BLUEPRINT

### Instructions détaillées :

1. **Cliquez** "New +" (coin supérieur droit)
2. **Sélectionnez** "Blueprint"
3. **Cherchez** votre repository `ILYESS24/canvchat`
4. **Cliquez** "Connect"

### ✅ Render détecte automatiquement :
- `render.yaml` dans la racine
- 2 services web (frontend + backend)
- 2 bases de données (PostgreSQL + Redis)

---

## 🚀 ÉTAPE 3 : CONFIGURATION DES SERVICES

### Frontend (suna-frontend)
**Type :** Web Service
**Environnement :** Node.js
**Root Directory :** `apps/frontend`

**Build Command :**
```bash
npm install && npm run build
```

**Start Command :**
```bash
npm start
```

### Backend (suna-backend)
**Type :** Web Service
**Environnement :** Python
**Root Directory :** `backend/`

**Build Command :**
```bash
pip install -r requirements.txt
```

**Start Command :**
```bash
python -c "import os, sys; sys.path.insert(0, '.'); from api import app; import uvicorn; port = int(os.environ.get('PORT', '8000')); uvicorn.run(app, host='0.0.0.0', port=port)"
```

---

## 🚀 ÉTAPE 4 : BASES DE DONNÉES

### PostgreSQL (suna-postgres)
- **Plan :** Starter (gratuit)
- **Database Name :** `suna_db`
- **User :** `suna_user`

### Redis (suna-redis)
- **Plan :** Starter (gratuit)
- **Usage :** Cache et sessions

---

## 🔑 ÉTAPE 5 : VARIABLES D'ENVIRONNEMENT

### Frontend Variables (auto-configurées) :

```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://otxxjczxwhtngcferckz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://otxxjczxwhtngcferckz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend Variables (auto-configurées) :

```bash
ENV_MODE=production
DATABASE_URL=postgresql://[auto-généré]
REDIS_URL=redis://[auto-généré]
SUPABASE_URL=https://otxxjczxwhtngcferckz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=temp_openai_key
ANTHROPIC_API_KEY=temp_anthropic_key
ENCRYPTION_KEY=[générer une clé sécurisée - voir ci-dessous]
```

#### 🔐 Génération de la clé de chiffrement

**Clé Fernet valide générée pour le déploiement :**

```bash
ENCRYPTION_KEY=zO2SZpdS_oVXjW_rJsoXRZmOGtmOdPECNL1nx02MB88=
```

**Comment générer votre propre clé :**
```bash
# Avec Python et cryptography :
python3 -c "from cryptography.fernet import Fernet; print('ENCRYPTION_KEY=' + Fernet.generate_key().decode())"

# OU avec Node.js :
node -e "const crypto = require('crypto'); console.log('ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('base64url'));"
```

**⚠️ IMPORTANT :** Cette clé chiffre les credentials MCP stockés. **Conservez-la en sécurité** et **ne la partagez jamais**.

---

## ⏱️ ÉTAPE 6 : DÉPLOIEMENT

### Temps estimé :
- **Frontend :** 5-10 minutes
- **Backend :** 10-15 minutes
- **Databases :** 2-3 minutes
- **Total :** 15-25 minutes

### Statut de déploiement :
- 🔄 **In Progress** : Déploiement en cours
- ✅ **Live** : Service opérationnel
- ❌ **Failed** : Erreur à corriger

---

## 🌐 ÉTAPE 7 : URLS FINALES

### Après déploiement réussi :

**🏠 Frontend :**
```
https://suna-frontend.onrender.com
```

**🚀 Backend API :**
```
https://suna-backend.onrender.com
```

**🏥 Health Check :**
```
https://suna-backend.onrender.com/health
```

**💾 Databases :**
- PostgreSQL : Connexion string automatique
- Redis : Connexion string automatique

---

## 🔧 COMMANDES DE VÉRIFICATION

### Vérifier les services :
```bash
# Ouvrir les URLs dans le navigateur
start https://suna-frontend.onrender.com
start https://suna-backend.onrender.com/health
```

### Logs de déploiement :
```bash
# Dans le dashboard Render :
# 1. Sélectionner le service
# 2. Onglet "Logs"
# 3. Voir les logs en temps réel
```

### Redéployer manuellement :
```bash
# Dans le dashboard Render :
# 1. Sélectionner le service
# 2. Cliquer "Manual Deploy"
# 3. Sélectionner "Clear build cache"
```

---

## ⚠️ DÉPANNAGE

### Si le frontend ne build pas :
```bash
# Vérifier les logs
# Erreur possible : "Cannot find module" ou "Build failed"
# Solution : Vérifier package.json dans apps/frontend/
```

### Si le backend ne démarre pas :
```bash
# Vérifier les logs
# Erreur possible : "Module not found" ou "Import error"
# Solution : Vérifier requirements.txt
```

### Si les databases ne se connectent pas :
```bash
# Dans Render dashboard :
# Services → [nom-db] → Connection
# Copier l'URL de connexion
# Mettre à jour les variables d'environnement
```

---

## 🎯 TESTS APRÈS DÉPLOIEMENT

### 1. Frontend
- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] Design responsive

### 2. Authentification
- [ ] Connexion Google fonctionne
- [ ] Comptes utilisateur créés
- [ ] Sessions maintenues

### 3. API Backend
- [ ] `GET /health` retourne `{"status": "healthy"}`
- [ ] `GET /api/v1/agents` fonctionne
- [ ] `POST /api/v1/messages` répond

### 4. Base de données
- [ ] Données persistantes
- [ ] Utilisateurs sauvegardés
- [ ] Conversations stockées

---

## 📈 OPTIMISATIONS RECOMMANDÉES

### Performance :
```bash
# Augmenter les plans si nécessaire :
# - Starter → Standard (Frontend)
# - Starter → Standard (Backend)
# - Free → Starter (Databases)
```

### Monitoring :
```bash
# Activer les alertes :
# Dashboard → Settings → Alerts
# - CPU > 80%
# - Memory > 80%
# - Response time > 5s
```

### Backups :
```bash
# PostgreSQL backups :
# Dashboard → Database → Backups
# Programmer des sauvegardes quotidiennes
```

---

## 💰 COÛTS ESTIMÉS

### Gratuit (jusqu'à certaines limites) :
- **Frontend :** 750 heures/mois gratuites
- **Backend :** 750 heures/mois gratuites
- **PostgreSQL :** 750 heures/mois gratuites
- **Redis :** 750 heures/mois gratuites

### Au-delà des limites gratuites :
- **Starter Plans :** ~$7/mois par service

---

## 🚀 ÉTAPES SUIVANTES (OPTIONNEL)

### 1. Domaine personnalisé
```bash
# Dashboard → Settings → Custom Domain
# Ajouter votre-domaine.com
```

### 2. HTTPS/SSL
- ✅ **Automatique** sur Render

### 3. CI/CD
- ✅ **Automatique** via GitHub

### 4. Analytics
```bash
# Ajouter PostHog ou Google Analytics
npm install @posthog/nextjs
```

### 5. IA Réelle
```bash
# Remplacer les mocks par :
# - OpenAI API
# - Anthropic Claude
# - Autres modèles
```

---

## 📞 SUPPORT ET AIDE

### Ressources Render :
- **Documentation :** [docs.render.com](https://docs.render.com)
- **Status :** [status.render.com](https://status.render.com)
- **Support :** support@render.com

### Problèmes courants :
1. **Build timeouts** → Augmenter le plan
2. **Memory limits** → Optimiser le code
3. **Cold starts** → Garder les services actifs

---

## 🎉 CHECKLIST FINALE

- [ ] Repository connecté à Render
- [ ] Blueprint créé avec succès
- [ ] Services déployés (2/2)
- [ ] Databases créées (2/2)
- [ ] Variables d'environnement configurées
- [ ] URLs accessibles et fonctionnelles
- [ ] Authentification testée
- [ ] API endpoints opérationnels
- [ ] Données persistantes

---

## 🏆 RÉSULTAT ATTENDU

**Votre plateforme Suna AI sera complètement déployée avec :**

✅ **Frontend moderne** (Next.js)
✅ **Backend robuste** (Python/FastAPI)
✅ **Base de données** (PostgreSQL)
✅ **Cache performant** (Redis)
✅ **Authentification** (Supabase)
✅ **IA simulée** fonctionnelle
✅ **Interface web exclusive**
✅ **Auto-scaling automatique**
✅ **Monitoring intégré**
✅ **SSL automatique**

---

**🎯 Temps total estimé : 15-25 minutes**

**🚀 Bonne chance pour votre déploiement Render !**
