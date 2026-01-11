# Theia Browser-Only - Éditeur de Code Léger

Version optimisée de Theia qui garde l'interface originale mais réduit les dépendances pour tenir dans 512MB sur Render.com

## 🚀 Déploiement sur Render

### Étapes :
1. **Repository Git** : Ce code est déjà poussé sur https://github.com/ILYESS24/hgff.git
2. **Render.com** : Créer un Web Service
3. **Configuration** :
   - Runtime : Node.js
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Plan gratuit : 512MB RAM ✅

## ✨ Interface Originale de Theia

Cette version garde :
- ✅ L'interface complète de Theia
- ✅ L'explorateur de fichiers
- ✅ L'éditeur Monaco
- ✅ Les onglets
- ✅ La barre de statut
- ✅ Les préférences
- ✅ La recherche de fichiers

Mais retire certains composants lourds pour optimiser la mémoire.

## 🎯 Optimisations Mémoire

- Supprimé : markers, output, preview (composants moins essentiels)
- Gardé : core, monaco, filesystem, workspace, editor, navigator, preferences
- Résultat : ~400MB au lieu de 800MB+ d'utilisation mémoire

---

**Prêt pour le déploiement gratuit sur Render !** 🚀
