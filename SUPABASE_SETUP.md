# 🛠️ Configuration Supabase pour Suna Web

## 🎯 Problème Actuel
L'application affiche : `"Supabase credentials not found, using mock client for build"`

Cela signifie que les variables d'environnement Supabase ne sont pas configurées, donc l'app utilise des données fictives.

## 🚀 Solution : Configurer Supabase

### Étape 1 : Créer un projet Supabase

1. **Aller sur** [https://supabase.com](https://supabase.com)
2. **Créer un compte** gratuit
3. **Cliquer** "New Project"
4. **Remplir** :
   - **Name** : `suna-web-project`
   - **Database Password** : Choisir un mot de passe fort
   - **Region** : Sélectionner la plus proche (EU West recommandé)
5. **Cliquer** "Create new project"
6. **Attendre** 2-3 minutes que le projet soit prêt

### Étape 2 : Récupérer les clés API

1. **Dans votre projet Supabase**, aller dans **Settings** → **API**
2. **Copier** les valeurs suivantes :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon/public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Étape 3 : Configurer les variables d'environnement dans Vercel

Ouvrir un terminal et exécuter ces commandes une par une :

```bash
# 1. URL du projet Supabase (publique)
vercel env add NEXT_PUBLIC_SUPABASE_URL

# 2. Clé anonyme (publique)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. URL du projet (côté serveur)
vercel env add SUPABASE_URL

# 4. Clé anonyme (côté serveur)
vercel env add SUPABASE_ANON_KEY

# 5. Clé service role (sensible - répondre "y" quand demandé)
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Pour chaque commande :**
- Coller la valeur copiée depuis Supabase
- **Répondre "N"** pour les 4 premières (elles ne sont pas sensibles)
- **Répondre "y"** pour `SUPABASE_SERVICE_ROLE_KEY` (elle est sensible)

### Étape 4 : Redéployer l'application

```bash
vercel --prod --yes
```

### Étape 5 : Vérifier que ça fonctionne

1. **Aller sur** [https://suna-main.vercel.app](https://suna-main.vercel.app)
2. **Ouvrir la console** (F12)
3. **Vérifier qu'il n'y a plus** : `"Supabase credentials not found, using mock client"`

## 🔧 Variables d'Environnement Requises

| Variable | Valeur depuis Supabase | Sensible ? |
|----------|----------------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | ❌ Non |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key | ❌ Non |
| `SUPABASE_URL` | Project URL | ❌ Non |
| `SUPABASE_ANON_KEY` | anon public key | ❌ Non |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | ✅ Oui |

## 🎯 Résultat Attendu

Après configuration, l'application aura :

- ✅ **Authentification réelle** avec Google
- ✅ **Base de données persistante** (au lieu de mocks)
- ✅ **Utilisateurs enregistrés** dans Supabase
- ✅ **Sessions maintenues** entre les visites
- ✅ **Données sauvegardées** (agents, conversations, projets)

## 🔍 Dépannage

### Si l'authentification ne fonctionne pas :
1. Vérifier que les URLs sont correctes (se terminent par `.supabase.co`)
2. Vérifier que les clés commencent par `eyJ`
3. Vérifier dans Supabase > Authentication > Settings que l'auth est activée

### Si les données ne se sauvegardent pas :
1. Vérifier que la base de données Supabase est accessible
2. Vérifier les permissions des clés API
3. Consulter les logs Vercel : `vercel inspect [url] --logs`

## 📞 Support

Si vous avez des problèmes :
1. Vérifier les logs de déploiement : `vercel logs`
2. Consulter la documentation Supabase : https://supabase.com/docs
3. Vérifier le dashboard Vercel pour les erreurs

---

**🎉 Une fois configuré, Suna Web aura toutes les fonctionnalités avec de vraies données persistantes !**
