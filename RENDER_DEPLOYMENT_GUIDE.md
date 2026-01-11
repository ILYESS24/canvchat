# 🚀 Déploiement Kortix sur Render - Guide Complet

## 🚨 CRITIQUE: Vérifiez la commande de démarrage

**Si vous voyez l'erreur "Could not import module api", vérifiez que Render utilise :**

```
Start Command: python start.py
```

**PAS cette commande :**
```
uvicorn api:app --host 0.0.0.0 --port $PORT  ❌ WRONG
```

### 🔧 Comment corriger :

1. Allez dans votre service Render → Settings
2. Modifiez "Start Command" pour `python start.py`
3. Re-déployez

## ❌ Problème Résolu

L'erreur `failed to read dockerfile: open Dockerfile: no such file or directory` était causée par l'utilisation de Docker avec des chemins incorrects.

## ✅ Solution Implémentée

- ❌ Supprimé les `Dockerfile`s (causaient des conflits)
- ❌ Supprimé `render.yaml` (incompatible)
- ✅ Utilisation des **runtimes natifs Render**
- ✅ Configuration pour **Python 3** (backend) et **Static Site** (frontend)

## 🎯 Déploiement Manuel sur Render

### 1. **Connexion Repository**
- Allez sur https://render.com
- Connectez https://github.com/ILYESS24/canvchat
- Autorisez l'accès au repository

### 2. **Créer le Backend Service**

```
Service Type      : Web Service
Name              : kortix-backend
Runtime           : Python 3
Root Directory    : backend/
Build Command     : pip install -r requirements.txt
Start Command     : python -c "import os, sys; sys.path.insert(0, '.'); from api import app; import uvicorn; port = int(os.environ.get('PORT', '8000')); uvicorn.run(app, host='0.0.0.0', port=port)"
```

**Variables d'environnement pour Backend :**
```
ENV_MODE=production
SUPABASE_URL=https://votre-project.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
OPENAI_API_KEY=sk-votre_cle_openai
ANTHROPIC_API_KEY=sk-ant-votre_cle_anthropic
DATABASE_URL=[URL PostgreSQL Render]
REDIS_URL=[URL Redis Render]
PYTHONPATH=/app
ENCRYPTION_KEY=[clé de chiffrement sécurisée - voir ci-dessous]
```

#### 🔐 Clé de chiffrement (OBLIGATOIRE)

**Clé Fernet valide générée :**
```bash
ENCRYPTION_KEY=cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=
```

**Comment générer votre propre clé :**
```bash
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
# OU avec Node.js :
node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(32).toString('base64'));"
```

⚠️ **La clé doit faire exactement 44 caractères (base64 encodé 32 bytes)**

⚠️ **Cette clé chiffre les credentials MCP. Conservez-la en sécurité !**

### 3. **Créer le Frontend Service**

```
Service Type      : Static Site
Name              : kortix-frontend
Root Directory    : apps/frontend/
Build Command     : pnpm install && pnpm build
Publish Directory : .next
```

**Variables d'environnement pour Frontend :**
```
NEXT_PUBLIC_BACKEND_URL=https://kortix-backend.onrender.com/v1
NEXT_PUBLIC_ENV_MODE=production
```

### 4. **Créer les Bases de Données**

#### PostgreSQL
```
Service Type : PostgreSQL
Name         : kortix-postgres
Version      : Latest
```

#### Redis
```
Service Type : Redis
Name         : kortix-redis
Version      : Latest
```

### 5. **Lier les Services**

1. Dans les paramètres du backend → "Linked Databases"
2. Ajoutez `kortix-postgres` et `kortix-redis`
3. Les URLs de connexion seront automatiquement injectées

### 6. **Déployer**

1. Cliquez "Create" pour chaque service
2. Attendez que les builds se terminent
3. Vérifiez les logs pour les erreurs
4. Testez les URLs générées

## 🔍 URLs de Service

Après déploiement :
- **Backend** : `https://kortix-backend.onrender.com`
- **Frontend** : `https://kortix-frontend.onrender.com`
- **API Docs** : `https://kortix-backend.onrender.com/docs`

## 🐛 Dépannage

### Build Backend Échoue
```bash
# Vérifiez que requirements.txt existe dans backend/
# Vérifiez les logs Render pour les erreurs de dépendances
```

### Build Frontend Échoue
```bash
# Vérifiez que package.json existe dans apps/frontend/
# Vérifiez les logs pour les erreurs de build
```

### Services ne Peuvent pas se Connecter
```bash
# Vérifiez que les variables d'environnement sont correctes
# Vérifiez que les services sont liés dans Render dashboard
```

## 📊 Ressources Utilisées

- **Backend** : ~512MB RAM, ~1GB disk
- **Frontend** : ~256MB RAM, ~500MB disk
- **PostgreSQL** : Gratuit (750MB)
- **Redis** : Gratuit (20MB)

## 🎉 Checklist Déploiement

- [ ] Repository GitHub connecté
- [ ] Backend service déployé avec Docker
- [ ] Frontend service déployé avec Docker
- [ ] PostgreSQL créé et lié
- [ ] Redis créé et lié
- [ ] Variables d'environnement configurées
- [ ] Services démarrés sans erreur
- [ ] URLs accessibles et fonctionnelles

---

**🎯 Prêt pour le déploiement Docker sur Render !**
