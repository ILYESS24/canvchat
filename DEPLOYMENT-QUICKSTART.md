# 🚀 DÉPLOIEMENT RAPIDE - Kortix sur Render

## ⚠️ IMPORTANT : Problème résolu !

**Le problème de redirection localhost a été corrigé !**

## 📋 Étapes de déploiement

### 1️⃣ Préparation
```bash
cd suna-main/suna-main
npm run build  # Crée le dossier dist/
```

### 2️⃣ Déployer le FRONTEND (Interface)
1. Allez sur https://render.com/
2. Cliquez "New" → "Static Site"
3. Connectez votre repo GitHub
4. Configurez :
   - **Name** : `kortix-frontend`
   - **Root Directory** : `suna-main` (IMPORTANT !)
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
5. Cliquez "Create Static Site"

### 3️⃣ Obtenir l'URL Frontend
Render vous donne une URL comme :
```
https://kortix-frontend-xyz.onrender.com/
```

## ✅ Vérification

**Testez cette URL - vous devriez voir :**
- ✅ L'interface Kortix complète
- ✅ L'espace prompt avec les bulles
- ✅ L'icône Network 🌐 qui ouvre le popup
- ✅ **AUCUNE redirection vers localhost !**

## 🔧 Dépannage

**Si vous voyez encore localhost :**
1. Vérifiez que vous utilisez la **bonne URL Render** (frontend)
2. Redéployez : Manual Deploy → Deploy latest commit
3. Videz le cache de votre navigateur (Ctrl+F5)

**URLs à NE PAS utiliser :**
- ❌ `http://localhost:5173/` (développement)
- ❌ URL backend (celle qui affiche "Kortix AI Worker Backend")

**URL à utiliser :**
- ✅ URL du Static Site Render (frontend)

## 🎯 Résultat final

**Interface Kortix déployée :** `https://kortix-frontend-xyz.onrender.com/`

**Popup intégrations fonctionnel avec l'icône Network !** 🎉
