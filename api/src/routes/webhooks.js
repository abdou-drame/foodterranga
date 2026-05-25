const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

// POST /api/webhooks/wave - Webhook Wave pour notifications de paiement
router.post('/wave', paiementController.webhookWave);

module.exports = router;
