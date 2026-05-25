const Commande = require('../models/commande');
const waveService = require('../services/waveService');

exports.initierPaiementWave = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        message: 'Commande non trouvée'
      });
    }

    if (commande.paiement.statut === 'reussi') {
      return res.status(400).json({
        message: 'Cette commande est déjà payée'
      });
    }

    if (commande.statut === 'annulée') {
      return res.status(400).json({
        message: 'Impossible de payer une commande annulée'
      });
    }

    const waveResponse = await waveService.initierPaiement(commande);

    commande.paiement = {
      methode: 'wave',
      statut: 'en cours',
      wavePaymentId: waveResponse.id,
      waveCheckoutUrl: waveResponse.wave_launch_url
    };
    commande.statut = 'en attente de paiement';

    await commande.save();

    res.json({
      message: 'Paiement Wave initié avec succès',
      waveCheckoutUrl: waveResponse.wave_launch_url,
      wavePaymentId: waveResponse.id,
      commande: {
        id: commande._id,
        montantTotal: commande.montantTotal,
        statut: commande.statut
      }
    });
  } catch (error) {
    console.error('Erreur initiation paiement:', error);
    next(error);
  }
};

exports.verifierPaiement = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({
        message: 'Commande non trouvée'
      });
    }

    if (!commande.paiement.wavePaymentId) {
      return res.status(400).json({
        message: 'Aucun paiement Wave associé à cette commande'
      });
    }

    const statutWave = await waveService.verifierStatutPaiement(
      commande.paiement.wavePaymentId
    );

    if (statutWave.checkout_status === 'complete' && statutWave.payment_status === 'successful') {
      commande.paiement.statut = 'reussi';
      commande.paiement.transactionId = statutWave.transaction_id;
      commande.paiement.datePaiement = statutWave.when_completed || new Date();
      commande.paiement.montantPaye = statutWave.amount;
      commande.statut = 'payée';
      await commande.save();

      return res.json({
        message: 'Paiement confirmé avec succès',
        commande: {
          id: commande._id,
          statut: commande.statut,
          paiement: commande.paiement
        }
      });
    }

    if (statutWave.checkout_status === 'failed' || statutWave.payment_status === 'failed') {
      commande.paiement.statut = 'echoue';
      commande.statut = 'en attente';
      await commande.save();

      return res.status(400).json({
        message: 'Le paiement a échoué',
        statut: statutWave
      });
    }

    res.json({
      message: 'Paiement en cours de traitement',
      statut: statutWave.checkout_status,
      commande: {
        id: commande._id,
        statut: commande.statut
      }
    });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    next(error);
  }
};

exports.webhookWave = async (req, res) => {
  try {
    const signature = req.headers['x-wave-signature'];
    const payload = req.body;

    if (!waveService.verifierSignatureWebhook(payload, signature)) {
      return res.status(401).json({
        message: 'Signature webhook invalide'
      });
    }

    const { id: wavePaymentId, checkout_status, payment_status, client_reference, transaction_id, amount, when_completed } = payload;

    const commande = await Commande.findById(client_reference);

    if (!commande) {
      console.error('Commande non trouvée pour webhook:', client_reference);
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (checkout_status === 'complete' && payment_status === 'successful') {
      commande.paiement.statut = 'reussi';
      commande.paiement.transactionId = transaction_id;
      commande.paiement.datePaiement = when_completed || new Date();
      commande.paiement.montantPaye = amount;
      commande.statut = 'payée';
      await commande.save();

      console.log(`✅ Paiement confirmé pour commande ${commande._id}`);
    } else if (checkout_status === 'failed' || payment_status === 'failed') {
      commande.paiement.statut = 'echoue';
      commande.statut = 'en attente';
      await commande.save();

      console.log(`❌ Paiement échoué pour commande ${commande._id}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Wave:', error);
    res.status(500).json({ message: 'Erreur traitement webhook' });
  }
};

exports.obtenirStatutPaiement = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .select('paiement statut montantTotal');

    if (!commande) {
      return res.status(404).json({
        message: 'Commande non trouvée'
      });
    }

    res.json({
      commandeId: commande._id,
      statut: commande.statut,
      montantTotal: commande.montantTotal,
      paiement: commande.paiement
    });
  } catch (error) {
    next(error);
  }
};
