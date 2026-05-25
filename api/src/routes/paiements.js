const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

// POST /api/commandes/:id/paiement/initier - Initier un paiement Wave
router.post('/:id/paiement/initier', paiementController.initierPaiementWave);

// GET /api/commandes/:id/paiement/verifier - Vérifier le statut du paiement
router.get('/:id/paiement/verifier', paiementController.verifierPaiement);

// GET /api/commandes/:id/paiement/statut - Obtenir le statut du paiement
router.get('/:id/paiement/statut', paiementController.obtenirStatutPaiement);

module.exports = router;
