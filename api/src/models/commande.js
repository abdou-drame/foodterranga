const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: [true, 'Le nom du client est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    telephone: {
      type: String,
      required: [true, 'Le téléphone est obligatoire'],
      trim: true
    },
    adresseLivraison: {
      type: String,
      required: [true, "L'adresse de livraison est obligatoire"],
      trim: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Le restaurant est obligatoire']
    },
    plats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plat',
        required: true
      }
    ],
    montantTotal: {
      type: Number,
      required: [true, 'Le montant total est obligatoire'],
      min: [0, 'Le montant ne peut pas être négatif']
    },
    statut: {
      type: String,
      enum: ['en attente', 'en attente de paiement', 'payée', 'confirmée', 'en livraison', 'livrée', 'annulée'],
      default: 'en attente'
    },
    commentaire: {
      type: String,
      trim: true,
      maxlength: [300, 'Le commentaire ne peut pas dépasser 300 caractères']
    },
    paiement: {
      methode: {
        type: String,
        enum: ['wave', 'especes', 'carte'],
        default: 'especes'
      },
      statut: {
        type: String,
        enum: ['en attente', 'en cours', 'reussi', 'echoue', 'rembourse'],
        default: 'en attente'
      },
      transactionId: {
        type: String,
        trim: true
      },
      wavePaymentId: {
        type: String,
        trim: true
      },
      waveCheckoutUrl: {
        type: String,
        trim: true
      },
      datePaiement: {
        type: Date
      },
      montantPaye: {
        type: Number,
        min: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Commande', commandeSchema);