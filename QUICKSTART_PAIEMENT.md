# 🚀 Démarrage rapide - Paiement Wave

## ⚡ En 3 étapes

### 1️⃣ Configuration (2 minutes)

Ajoutez dans `.env` :
```env
WAVE_API_KEY=votre_cle_wave_ici
WAVE_API_URL=https://api.sandbox.wave.com/v1
WAVE_WEBHOOK_SECRET=votre_secret
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### 2️⃣ Démarrage (30 secondes)

```bash
cd api
npm run dev
```

### 3️⃣ Test (1 minute)

**Créer une commande :**
```bash
curl -X POST http://localhost:3001/api/commandes \
  -H "Content-Type: application/json" \
  -d '{
    "client": "Test Client",
    "telephone": "+221771234567",
    "adresseLivraison": "Saint-Louis",
    "restaurant": "ID_RESTAURANT",
    "plats": ["ID_PLAT"],
    "montantTotal": 5000
  }'
```

**Initier paiement :**
```bash
curl -X POST http://localhost:3001/api/commandes/ID_COMMANDE/paiement/initier
```

**Vérifier statut :**
```bash
curl http://localhost:3001/api/commandes/ID_COMMANDE/paiement/statut
```

## ✅ C'est tout !

Votre système de paiement Wave est opérationnel.

**Documentation complète :** `PAIEMENT_WAVE.md`

---

**Astuce :** Utilisez le fichier `api/test-paiement.http` avec REST Client (VS Code) pour tester facilement.
