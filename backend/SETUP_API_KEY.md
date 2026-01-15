# 🔑 Configuration de la clé API OpenRouter

## ⚠️ Erreur actuelle : 401 "User not found"

Cela signifie que la clé API OpenRouter est **invalide, expirée ou révoquée**.

---

## 🔧 Solution : Obtenir une nouvelle clé API

### 1️⃣ Créer/Obtenir une clé API sur OpenRouter

1. Va sur : **https://openrouter.ai/keys**
2. Connecte-toi ou crée un compte
3. Crée une **nouvelle clé API**
4. **Copie la clé** (elle commence par `sk-or-v1-...`)
5. **Ajoute des crédits** : https://openrouter.ai/credits

---

## 2️⃣ Configurer la clé dans le backend

### Option A : Fichier `.env` (pour test local)

Crée un fichier `backend/.env` avec :

```bash
OPENROUTER_API_KEY=sk-or-v1-VOTRE_NOUVELLE_CLE_ICI
ENV_MODE=local
PORT=8000
OR_SITE_URL=https://kortix.com
OR_APP_NAME=Kortix AI
```

### Option B : Variables d'environnement (pour Render)

1. Va sur le **dashboard Render** : https://dashboard.render.com
2. Sélectionne ton service `kortix-backend`
3. Va dans **Environment** → **Environment Variables**
4. Ajoute ou modifie :
   ```
   OPENROUTER_API_KEY = sk-or-v1-VOTRE_NOUVELLE_CLE_ICI
   ```
5. Clique sur **Save Changes**
6. Le service va redémarrer automatiquement

---

## 3️⃣ Redémarrer le backend

```bash
# Arrête le backend actuel (Ctrl+C)
# Puis relance :
cd backend
python api.py
```

---

## ✅ Vérification

Une fois configuré, teste avec :

```bash
curl http://localhost:8000/v1/health
```

Tu devrais voir : `{"status":"ok", ...}`

---

## 🆘 Problèmes courants

- **401 "User not found"** → Clé invalide ou révoquée
- **402 "Payment required"** → Pas assez de crédits sur le compte
- **403 "Forbidden"** → Clé valide mais pas de permissions
- **429 "Too many requests"** → Rate limit dépassé

---

## 📞 Support

Si problème persiste :
- OpenRouter Discord : https://discord.gg/openrouter
- OpenRouter Support : https://openrouter.ai/docs
