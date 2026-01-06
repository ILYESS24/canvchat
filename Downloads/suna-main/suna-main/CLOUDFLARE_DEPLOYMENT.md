# 🚀 Déploiement de Kortix sur Render

Ce guide explique comment déployer la plateforme Kortix complète sur Render.

## 📋 Prérequis

1. **Compte Cloudflare** avec un domaine configuré
2. **Wrangler CLI** installé : `npm install -g wrangler`
3. **Python 3.11+** avec `uv` installé
4. **Node.js 18+** avec npm

## 🔧 Configuration Initiale

### 1. Connexion à Cloudflare

```bash
wrangler auth login
```

### 2. Configuration des Ressources Cloudflare

Exécutez le script de déploiement pour configurer automatiquement les ressources :

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh setup
```

Cela va créer :
- **KV Namespace** : Remplacement de Redis pour le cache
- **D1 Database** : Base de données principale
- **R2 Bucket** : Stockage de fichiers
- **Queue** : Traitement des tâches en arrière-plan

### 3. Variables d'Environnement

Mettez à jour les variables d'environnement dans `backend/wrangler.toml` :

```toml
SUPABASE_URL = "votre_supabase_url"
SUPABASE_ANON_KEY = "votre_cle_anon"
SUPABASE_SERVICE_ROLE_KEY = "votre_cle_service"
OPENAI_API_KEY = "votre_cle_openai"
ANTHROPIC_API_KEY = "votre_cle_anthropic"
```

Utilisez Wrangler pour définir les secrets :

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put OPENAI_API_KEY
# ... autres secrets
```

## 🚀 Déploiement

### Option 1 : Déploiement Complet Automatique

```bash
./deploy-cloudflare.sh all
```

### Option 2 : Déploiement Composant par Composant

#### Backend (API FastAPI)
```bash
cd backend
npm install
uv export --format requirements-txt --output-file requirements.txt
wrangler deploy
```

#### Frontend (Next.js)
```bash
cd apps/frontend
npm install
npm run build
wrangler pages deploy .vercel/output/static
```

## 🔄 Architecture Cloudflare

```
Internet
    ↓
Cloudflare Pages (Frontend Next.js)
    ↓
Cloudflare Workers (Backend API Python)
    ↓
├── Cloudflare KV (Cache)
├── Cloudflare D1 (Database)
├── Cloudflare R2 (File Storage)
└── Cloudflare Queue (Background Tasks)
```

## 📊 Services Déployés

### Frontend
- **URL** : `https://kortix-frontend.pages.dev`
- **Technologie** : Next.js avec Cloudflare Pages
- **Build** : Automatique via Git ou manuel

### Backend API
- **URL** : `https://kortix-backend.your-domain.workers.dev`
- **Technologie** : FastAPI sur Cloudflare Workers Python
- **Features** :
  - API REST complète
  - Authentification Supabase
  - Intégration IA (OpenAI, Anthropic)
  - Cache intelligent

### Base de Données
- **KV Cache** : Remplacement haute performance de Redis
- **D1 Database** : Base de données SQLite distribuée
- **R2 Storage** : Stockage objet pour fichiers

### Tâches en Arrière-Plan
- **Queues** : Traitement asynchrone des agents
- **Workers** : Exécution des tâches automatisées

## 🔧 Migration des Données

### De Supabase vers Cloudflare D1

1. Exportez vos données Supabase :
```sql
-- Exemple d'export d'une table
SELECT * FROM agents;
```

2. Créez les tables dans D1 via Wrangler :
```bash
wrangler d1 execute kortix-db --file=migration.sql
```

### Migration du Cache Redis vers KV

Le code inclut un adaptateur automatique (`cloudflare_adapter.py`) qui :
- Traduit les appels Redis en appels KV
- Préserve la compatibilité de l'API existante

## 📈 Monitoring et Logs

### Logs d'Accès
```bash
wrangler tail --format=pretty
```

### Métriques Cloudflare
- **Dashboard** : cloudflare.com → Analytics
- **Real-time logs** : Via Wrangler CLI
- **Performance** : Métriques automatiques

## 🔒 Sécurité

### Variables d'Environnement
- Toutes les clés API sont stockées comme secrets
- Pas de secrets en dur dans le code
- Rotation automatique des tokens

### CORS Configuration
- Frontend autorisé uniquement
- Headers de sécurité activés
- Rate limiting configuré

## 🚀 Optimisations Performance

### Edge Computing
- Code exécuté près des utilisateurs
- Cache global via CDN
- Latence minimale

### Scaling Automatique
- Workers scale automatiquement
- Pas de gestion de serveurs
- Pay-per-request

## 🐛 Dépannage

### Erreurs Courantes

1. **Erreur de build Python** :
```bash
# Vérifiez les dépendances
uv sync
uv export --format requirements-txt --output-file requirements.txt
```

2. **Problème de KV** :
```bash
# Vérifiez la configuration KV
wrangler kv:key list --namespace-id YOUR_KV_ID
```

3. **Erreur de déploiement** :
```bash
# Logs détaillés
wrangler deploy --verbose
```

## 📞 Support

- **Documentation Cloudflare** : https://developers.cloudflare.com/
- **Wrangler CLI** : `wrangler --help`
- **Discord Kortix** : https://discord.com/invite/RvFhXUdZ9H

---

## 🎯 Checklist Déploiement

- [ ] Wrangler CLI installé et connecté
- [ ] Ressources Cloudflare créées (KV, D1, R2, Queue)
- [ ] Secrets configurés
- [ ] Domaines configurés
- [ ] Frontend déployé
- [ ] Backend déployé
- [ ] Tests fonctionnels effectués
- [ ] Monitoring activé

**URL finale** : `https://kortix-frontend.pages.dev`
