# 🚀 Déploiement de Kortix sur Render

Ce guide explique comment déployer la plateforme Kortix complète sur Render.

## 📋 Prérequis

- **Compte Render** : [render.com](https://render.com)
- **Repository GitHub/GitLab** avec le code Kortix
- **Clés API** : OpenAI, Anthropic, Supabase

## 🏗️ Architecture sur Render

```
Internet
    ↓
Render Static Site (Frontend Next.js)
    ↓
Render Web Service (Backend FastAPI)
    ↓
├── Render PostgreSQL (Base de données)
└── Render Redis (Cache)
```

## 🚀 Déploiement Automatique (recommandé)

### Option 1 : Utiliser render.yaml

```bash
# Valider la configuration
./deploy-render.sh validate

# Déployer automatiquement (si Render CLI installé)
./deploy-render.sh auto
```

### Option 2 : Déploiement Manuel via Dashboard

## 📋 Instructions de Déploiement Manuel

### 1. **Connexion du Repository**

1. Allez sur [render.com](https://render.com)
2. Cliquez sur "New" → "Blueprint" ou "Web Service"
3. Connectez votre repository GitHub/GitLab
4. Sélectionnez le repository `kortix`

### 2. **Création du Backend (Web Service)**

```
Service Type    : Web Service
Runtime         : Python 3
Root Directory  : backend/
Build Command   : pip install -r requirements.txt
Start Command   : uvicorn api:app --host 0.0.0.0 --port $PORT
```

**Variables d'environnement** :
```
ENV_MODE=production
SUPABASE_URL=https://votre-project.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
OPENAI_API_KEY=sk-votre_cle_openai
ANTHROPIC_API_KEY=sk-ant-votre_cle_anthropic
PYTHONPATH=/app
WORKERS=2
THREADS=2
```

### 3. **Création du Frontend (Static Site)**

```
Service Type    : Static Site
Root Directory  : apps/frontend/
Build Command   : pnpm install && pnpm build
Publish Directory: .next
```

**Variables d'environnement** :
```
NEXT_PUBLIC_BACKEND_URL=https://votre-backend-service.onrender.com/v1
NEXT_PUBLIC_URL=https://votre-frontend-service.onrender.com
NEXT_PUBLIC_ENV_MODE=production
```

### 4. **Création des Bases de Données**

#### PostgreSQL
- Type : `PostgreSQL`
- Version : Latest
- Plan : Starter (gratuit) ou supérieur

#### Redis
- Type : `Redis`
- Version : Latest
- Plan : Starter (gratuit) ou supérieur

### 5. **Connexion des Services**

Dans les paramètres de chaque service, liez :
- Backend → PostgreSQL (DATABASE_URL)
- Backend → Redis (REDIS_URL)

## 🔧 Configuration Avancée

### Health Checks

Pour le backend, ajoutez un health check :
```
Health Check Path: /health
Health Check Timeout: 30
```

### Scaling Automatique

Configurez l'autoscaling dans les paramètres avancés :
- Min instances : 1
- Max instances : 5
- CPU threshold : 70%

### Custom Domain

1. Allez dans les paramètres du service
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions de Render

## 🔒 Sécurité

### Variables d'Environnement

Toutes les clés API sont stockées comme variables d'environnement :
- ✅ Pas de secrets en dur dans le code
- ✅ Chiffrement automatique par Render
- ✅ Accès isolé par service

### CORS Configuration

Le backend configure automatiquement CORS pour le frontend.

## 📊 Monitoring et Logs

### Logs en Temps Réel

```bash
# Via Render Dashboard
Service → Logs → View Logs

# Ou via Render CLI (si installé)
render logs kortix-backend
```

### Métriques

- **CPU/Memory** : Dashboard → Metrics
- **Requests** : Automatic monitoring
- **Errors** : Logs et alerts

## 🚀 Optimisations Performance

### Backend
- **Gunicorn** avec workers optimisés
- **Connection pooling** automatique
- **Caching Redis** pour les sessions

### Frontend
- **Next.js optimization** automatique
- **CDN global** de Render
- **Compression** gzip/brotli

### Base de Données
- **Connection pooling** automatique
- **Read replicas** disponibles
- **Automatic backups**

## 🔄 Mise à Jour

### Déploiement Automatique

Chaque push sur la branche principale déclenche :
1. Build automatique
2. Tests (si configurés)
3. Déploiement progressif
4. Rollback automatique en cas d'erreur

### Rollback

En cas de problème :
1. Allez dans Render Dashboard
2. Service → Deploys
3. Sélectionnez un déploiement précédent
4. Cliquez "Rollback"

## 🐛 Dépannage

### Erreurs Courantes

1. **Build échoue** :
```bash
# Vérifiez les logs de build
# Cause souvent : dépendances manquantes dans requirements.txt
```

2. **Application ne démarre pas** :
```bash
# Vérifiez la commande start
# Vérifiez les variables d'environnement
```

3. **Timeout de build** :
```bash
# Augmentez le timeout dans les paramètres avancés
# Optimisez les dépendances
```

### Debug Local

Testez localement avant le déploiement :

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn api:app --reload

# Frontend
cd apps/frontend
pnpm install
pnpm dev
```

## 💰 Coûts

### Plan Gratuit
- 750 heures/mois
- 1 GB RAM par service
- Base de données gratuite limitée

### Plans Payants
- **Web Service** : $7/mois par service
- **PostgreSQL** : $7/mois
- **Redis** : $7/mois
- **Static Site** : Gratuit

## 🎯 Checklist Déploiement

- [ ] Repository connecté à Render
- [ ] Backend service créé et déployé
- [ ] Frontend service créé et déployé
- [ ] PostgreSQL database créée
- [ ] Redis instance créée
- [ ] Variables d'environnement configurées
- [ ] Services interconnectés
- [ ] Domaines configurés (optionnel)
- [ ] Tests fonctionnels effectués
- [ ] Monitoring activé

---

## 📞 Support

- **Documentation Render** : https://docs.render.com/
- **Discord Kortix** : https://discord.com/invite/RvFhXUdZ9H
- **Support Render** : support@render.com

**URL finale** : `https://kortix-frontend.onrender.com`
