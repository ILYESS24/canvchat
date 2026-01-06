# 🚀 Kortix - Déploiement Render

Configuration complète pour déployer Kortix sur Render.

## 📁 Fichiers de Configuration

- `render.yaml` - Configuration orchestrée des services
- `deploy-render.sh` - Script de déploiement automatisé
- `RENDER_DEPLOYMENT.md` - Guide complet de déploiement
- `render-env-example.txt` - Template des variables d'environnement

## 🚀 Déploiement Rapide

### Option Automatique
```bash
./deploy-render.sh auto
```

### Option Manuelle (recommandée)
```bash
./deploy-render.sh manual
```

Puis suivez les instructions à l'écran pour créer les services dans le dashboard Render.

## 🔧 Services à Créer

### 1. Backend (Web Service)
- **Runtime** : Python 3
- **Build** : `pip install -r requirements.txt`
- **Start** : `uvicorn api:app --host 0.0.0.0 --port $PORT`

### 2. Frontend (Static Site)
- **Build** : `pnpm install && pnpm build`
- **Publish** : `.next`

### 3. Bases de Données
- **PostgreSQL** : Pour la persistance des données
- **Redis** : Pour le cache et les sessions

## 🔐 Variables d'Environnement

Copiez les variables depuis `render-env-example.txt` dans chaque service.

## 📖 Documentation Complète

Voir `RENDER_DEPLOYMENT.md` pour les instructions détaillées.

---

**🎉 Prêt pour le déploiement sur Render !**
