# 🚀 DÉPLOIEMENT FRONTEND - INSTRUCTIONS SIMPLES

## 🎯 OBJECTIF : Voir l'interface Kortix (pas le backend)

**Vous voulez voir ça :**
- ✅ Interface avec espace prompt
- ✅ Bulles search/new chat/plus
- ✅ Sidebar Chats/Library/Triggers
- ✅ Icône Network 🌐 cliquable

**Pas ça :**
- ❌ "Kortix AI Worker Backend"

## 📋 ÉTAPES PRÉCISES :

### 1️⃣ Allez sur Render
**URL :** https://render.com/

### 2️⃣ Supprimez l'ancien déploiement
- Cliquez sur votre service actuel
- Settings → Delete

### 3️⃣ Créez un NOUVEAU Static Site
- **Clic gauche :** "New"
- **Clic gauche :** "Static Site"

### 4️⃣ Connectez GitHub
- Sélectionnez votre repo : `ILYESS24/canvchat`
- Cliquez "Connect"

### 5️⃣ CONFIGURATION EXACTE :
```
Name: kortix-frontend
Root Directory: suna-main
Build Command: npm install && npm run build
Publish Directory: dist
```

### 6️⃣ Déployez
- Cliquez "Create Static Site"
- Attendez 2-3 minutes le build

### 7️⃣ RÉSULTAT :
**URL générée :** `https://kortix-frontend-xyz.onrender.com/`

## ✅ VÉRIFICATION :
Ouvrez l'URL - vous devez voir :
- Interface noire avec titre "What do you want to accomplish?"
- Espace prompt centré
- Bulles en bas
- Sidebar à gauche

## 🚨 SI ÇA NE MARCHE PAS :
1. Vérifiez que "Root Directory" = `suna-main`
2. Regardez les logs de build sur Render
3. Vérifiez que le build réussit (`npm run build`)

## 🎉 FIN :
Vous aurez enfin l'interface Kortix complète ! 🎯
