# 🚀 Déploiement Kortix sur Render - Guide Complet

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
Start Command     : python start.py
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
```

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
