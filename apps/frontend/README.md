# Suna Web - Application Complète

**🚀 Architecture Full-Stack Vercel - Frontend + Backend API Routes**

## 🎯 Vue d'ensemble

Suna Web est une application complète déployée entièrement sur Vercel, utilisant :

- **Frontend** : Next.js 15 avec App Router
- **Backend** : API Routes Next.js (Serverless Functions)
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Déploiement** : Vercel (Frontend + API)

## 🏗️ Architecture

```
🌐 Vercel Platform
├── 🎨 Frontend (Next.js App Router)
├── 🚀 API Routes (Serverless Functions)
│   ├── /api/v1/agents - Gestion des agents IA
│   ├── /api/v1/threads - Gestion des conversations
│   ├── /api/v1/messages - Messages et chat IA
│   ├── /api/v1/projects - Gestion des projets
│   └── /api/v1/health - Health check
├── 💾 Supabase (Base de données + Auth)
└── ⚡ Vercel CDN (Distribution globale)
```

## ✨ Fonctionnalités

### 🤖 Agents IA
- Création et gestion d'agents personnalisés
- Modèles multiples (GPT-4, Claude-3, etc.)
- Configuration avancée des agents

### 💬 Chat & Conversations
- Interface de chat moderne
- Historique des conversations
- Threads organisés

### 📁 Projets
- Organisation des travaux
- Gestion des ressources
- Collaboration d'équipe

### 🔐 Authentification
- Connexion Google
- Gestion des utilisateurs
- Sessions sécurisées

## 🚀 Déploiement

L'application est entièrement déployée sur Vercel avec :

- **Build automatique** à chaque push
- **API Routes** déployées comme serverless functions
- **CDN global** pour des performances optimales
- **Auto-scaling** selon la charge

## 🛠️ Développement Local

```bash
# Installation des dépendances
pnpm install

# Démarrage en développement
pnpm dev

# Build de production
pnpm build
```

## 📡 API Routes

### Agents
- `GET /api/v1/agents` - Liste des agents
- `POST /api/v1/agents` - Créer un agent

### Threads
- `GET /api/v1/threads` - Liste des conversations
- `POST /api/v1/threads` - Créer une conversation

### Messages
- `GET /api/v1/messages?thread_id=123` - Messages d'une conversation
- `POST /api/v1/messages` - Envoyer un message (avec réponse IA simulée)

### Projets
- `GET /api/v1/projects` - Liste des projets
- `POST /api/v1/projects` - Créer un projet

### Health
- `GET /api/v1/health` - État du service

## 🎨 Interface Utilisateur

- **Design moderne** avec Tailwind CSS
- **Responsive** (mobile, tablette, desktop)
- **Thème sombre/clair**
- **Animations fluides** avec Framer Motion
- **Accessibilité** intégrée

## 🔧 Technologies

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : Radix UI
- **State Management** : Zustand
- **API Client** : Fetch API (avec gestion d'erreurs)
- **Base de données** : Supabase
- **Authentification** : Supabase Auth
- **Déploiement** : Vercel

## 🌟 Avantages de l'Architecture

### ✅ Simplicité
- Tout sur une seule plateforme (Vercel)
- Configuration unifiée
- Maintenance simplifiée

### ✅ Performance
- Serverless functions optimisées
- CDN global Vercel
- Cache intelligent

### ✅ Évolutivité
- Auto-scaling automatique
- Pay-as-you-go
- Support mondial

### ✅ Développement
- Hot reload en développement
- TypeScript pour la sécurité
- Tests intégrés

Cette architecture permet de déployer une application web complète avec backend fonctionnel sans gérer d'infrastructure serveur séparée.

## Quick Setup

The easiest way to get your frontend configured is to use the setup wizard from the project root:

```bash
cd .. # Navigate to project root if you're in the frontend directory
python setup.py
```

This will configure all necessary environment variables automatically.

## Environment Configuration

The setup wizard automatically creates a `.env.local` file with the following configuration:

```sh
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/v1
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ENV_MODE=LOCAL
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Development Notes

- The frontend connects to the backend API at `http://localhost:8000/v1`
- Supabase is used for authentication and database operations
- The app runs on `http://localhost:3000` by default
- Environment variables are automatically configured by the setup wizard
