# 💰 Intégration Wave Payment - TerrangaFood

## Configuration

### 1. Obtenir vos clés API Wave

1. Créez un compte développeur sur [Wave Business](https://www.wave.com/sn/business/)
2. Accédez à votre tableau de bord développeur
3. Récupérez :
   - **API Key** : pour authentifier vos requêtes
   - **Webhook Secret** : pour sécuriser les notifications

### 2. Configurer les variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# Wave Payment
WAVE_API_KEY=wave_sn_prod_xxxxxxxxxxxxxxxx
WAVE_API_URL=https://api.wave.com/v1
WAVE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001
```

**Mode Test :** Utilisez `https://api.sandbox.wave.com/v1` pour les tests

## Utilisation de l'API

### 1. Créer une commande

```bash
POST /api/commandes
Content-Type: application/json

{
  "client": "Abdou Drame",
  "telephone": "+221771234567",
  "adresseLivraison": "Quartier Nord, Saint-Louis",
  "restaurant": "66f1234567890abcdef12345",
  "plats": ["66f1234567890abcdef12346", "66f1234567890abcdef12347"],
  "montantTotal": 15000
}
```

**Réponse :**
```json
{
  "_id": "66f1234567890abcdef12348",
  "client": "Abdou Drame",
  "statut": "en attente",
  "montantTotal": 15000,
  "paiement": {
    "methode": "especes",
    "statut": "en attente"
  }
}
```

### 2. Initier le paiement Wave

```bash
POST /api/commandes/:id/paiement/initier
```

**Réponse :**
```json
{
  "message": "Paiement Wave initié avec succès",
  "waveCheckoutUrl": "https://checkout.wave.com/xxxxxx",
  "wavePaymentId": "wvchk_xxxxxxxxxxxxxxxx",
  "commande": {
    "id": "66f1234567890abcdef12348",
    "montantTotal": 15000,
    "statut": "en attente de paiement"
  }
}
```

**→ Redirigez le client vers `waveCheckoutUrl` pour qu'il paie**

### 3. Vérifier le statut du paiement

```bash
GET /api/commandes/:id/paiement/verifier
```

**Réponse (paiement réussi) :**
```json
{
  "message": "Paiement confirmé avec succès",
  "commande": {
    "id": "66f1234567890abcdef12348",
    "statut": "payée",
    "paiement": {
      "methode": "wave",
      "statut": "reussi",
      "transactionId": "txn_xxxxxxxxxxxxxxxx",
      "datePaiement": "2024-05-25T10:30:00.000Z",
      "montantPaye": 15000
    }
  }
}
```

### 4. Obtenir le statut de paiement

```bash
GET /api/commandes/:id/paiement/statut
```

**Réponse :**
```json
{
  "commandeId": "66f1234567890abcdef12348",
  "statut": "payée",
  "montantTotal": 15000,
  "paiement": {
    "methode": "wave",
    "statut": "reussi",
    "transactionId": "txn_xxxxxxxxxxxxxxxx",
    "datePaiement": "2024-05-25T10:30:00.000Z"
  }
}
```

## Flux de paiement

```
1. Client crée une commande
   └─> Statut: "en attente"

2. Client initie le paiement Wave
   └─> Statut: "en attente de paiement"
   └─> Redirection vers Wave

3. Client paie sur Wave
   └─> Wave notifie via webhook
   └─> Statut: "payée"

4. Restaurant confirme la commande
   └─> Statut: "confirmée"

5. Livraison
   └─> Statut: "en livraison" → "livrée"
```

## Webhooks Wave

Wave envoie des notifications automatiques à :
```
POST /api/webhooks/wave
```

**Payload reçu :**
```json
{
  "id": "wvchk_xxxxxxxxxxxxxxxx",
  "checkout_status": "complete",
  "payment_status": "successful",
  "client_reference": "66f1234567890abcdef12348",
  "transaction_id": "txn_xxxxxxxxxxxxxxxx",
  "amount": 15000,
  "when_completed": "2024-05-25T10:30:00Z"
}
```

**Configuration du webhook dans Wave Dashboard :**
- URL : `https://votre-domaine.com/api/webhooks/wave`
- Événements : `checkout.complete`, `payment.successful`

## Statuts des commandes

| Statut | Description |
|--------|-------------|
| `en attente` | Commande créée, pas encore payée |
| `en attente de paiement` | Paiement Wave initié, en attente du client |
| `payée` | Paiement confirmé par Wave |
| `confirmée` | Restaurant a confirmé la commande |
| `en livraison` | Commande en cours de livraison |
| `livrée` | Commande livrée au client |
| `annulée` | Commande annulée |

## Statuts de paiement

| Statut | Description |
|--------|-------------|
| `en attente` | Paiement pas encore initié |
| `en cours` | Paiement Wave en cours |
| `reussi` | Paiement confirmé |
| `echoue` | Paiement échoué |
| `rembourse` | Paiement remboursé |

## Gestion des erreurs

### Paiement déjà effectué
```json
{
  "message": "Cette commande est déjà payée"
}
```

### Commande annulée
```json
{
  "message": "Impossible de payer une commande annulée"
}
```

### API Key manquante
```json
{
  "message": "Échec initialisation paiement Wave: WAVE_API_KEY non configurée"
}
```

## Tests en local

### 1. Sans Wave (simulation)

Pour tester sans vraie API Wave, vous pouvez marquer manuellement un paiement comme réussi :

```bash
# Dans MongoDB ou via un endpoint de test
db.commandes.updateOne(
  { _id: ObjectId("66f1234567890abcdef12348") },
  {
    $set: {
      "statut": "payée",
      "paiement.statut": "reussi",
      "paiement.methode": "wave",
      "paiement.datePaiement": new Date()
    }
  }
)
```

### 2. Avec Wave Sandbox

Utilisez l'environnement de test Wave :
```env
WAVE_API_URL=https://api.sandbox.wave.com/v1
```

## Support

Pour toute question sur l'intégration Wave :
- Documentation officielle : https://developer.wave.com/docs
- Support Wave : support@wave.com

## Notes importantes

⚠️ **Sécurité :**
- Ne commitez JAMAIS vos clés API dans Git
- Vérifiez toujours la signature des webhooks
- Utilisez HTTPS en production

💡 **Production :**
- Passez à l'URL production : `https://api.wave.com/v1`
- Configurez un domaine HTTPS pour les webhooks
- Testez le flux complet avant le lancement
