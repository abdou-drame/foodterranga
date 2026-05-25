# 🚀 Configuration Render pour Wave Payment

## ⚠️ IMPORTANT - À faire maintenant

Votre code a été déployé sur Render, mais vous devez ajouter les variables d'environnement Wave.

## 📋 Étapes de configuration

### 1. Accéder à votre service Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service **foodterranga-api-our-group**
3. Allez dans l'onglet **Environment**

### 2. Ajouter les variables Wave

Ajoutez ces 5 nouvelles variables :

| Clé | Valeur | Note |
|-----|--------|------|
| `WAVE_API_KEY` | `votre_cle_api_wave` | Récupérez sur Wave Dashboard |
| `WAVE_API_URL` | `https://api.sandbox.wave.com/v1` | Sandbox pour tests |
| `WAVE_WEBHOOK_SECRET` | `votre_secret_webhook` | Pour sécurité webhooks |
| `FRONTEND_URL` | `https://terrangafood-abdou-drame.vercel.app` | Votre URL Vercel |
| `API_URL` | `https://foodterranga-api-our-group.onrender.com` | Votre URL Render |

### 3. Obtenir vos clés Wave

**Si vous n'avez pas encore de compte Wave Business :**

1. Allez sur https://www.wave.com/sn/business/
2. Créez un compte développeur
3. Accédez au Dashboard développeur
4. Récupérez :
   - **API Key** (commence par `wave_sn_...`)
   - **Webhook Secret** (commence par `whsec_...`)

### 4. Mode Test vs Production

**Pour les tests (recommandé au début) :**
```
WAVE_API_URL=https://api.sandbox.wave.com/v1
```

**Pour la production (quand prêt) :**
```
WAVE_API_URL=https://api.wave.com/v1
```

### 5. Redémarrer le service

Après avoir ajouté les variables :
1. Cliquez sur **Save Changes**
2. Render redémarrera automatiquement votre service

## ✅ Vérification

### Tester que le déploiement fonctionne :

```bash
curl https://foodterranga-api-our-group.onrender.com/
```

Vous devriez voir :
```json
{
  "message": "Bienvenue sur l'API TerrangaFood 🍛",
  "version": "1.0.0",
  "status": "Online",
  "endpoints": {
    "restaurants": "/api/restaurants",
    "plats": "/api/plats",
    "commandes": "/api/commandes",
    "paiements": "/api/commandes/:id/paiement",
    "webhooks": "/api/webhooks/wave"
  }
}
```

### Tester une commande :

```bash
# 1. Créer une commande
curl -X POST https://foodterranga-api-our-group.onrender.com/api/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "client": "Test Client",
    "telephone": "+221771234567",
    "adresseLivraison": "Saint-Louis",
    "restaurant": "ID_RESTAURANT",
    "plats": ["ID_PLAT"],
    "montantTotal": 5000
  }'

# 2. Initier paiement (remplacez ID_COMMANDE)
curl -X POST https://foodterranga-api-our-group.onrender.com/api/commandes/ID_COMMANDE/paiement/initier
```

## 🔧 Configuration Webhook sur Wave

Une fois vos clés configurées :

1. Allez dans le Dashboard Wave
2. Section **Webhooks**
3. Ajoutez cette URL :
   ```
   https://foodterranga-api-our-group.onrender.com/api/webhooks/wave
   ```
4. Sélectionnez les événements :
   - ✅ `checkout.complete`
   - ✅ `payment.successful`
   - ✅ `payment.failed`

## ⚡ Variables déjà configurées

Ces variables existent déjà sur Render (ne pas toucher) :
- ✅ `MONGODB_URI`
- ✅ `PORT`

## 🎯 Statut actuel

✅ Code déployé sur GitHub
✅ Render a récupéré les changements
⏳ **À FAIRE :** Configurer les variables Wave
⏳ **À FAIRE :** Obtenir les clés Wave

## 📞 Support

**Problèmes Render :**
- Vérifiez les logs : Dashboard > Logs
- Documentation : https://render.com/docs

**Problèmes Wave :**
- Support : support@wave.com
- Documentation : https://developer.wave.com/docs

---

**Une fois configuré, votre système de paiement Wave sera 100% opérationnel ! 🎉**
