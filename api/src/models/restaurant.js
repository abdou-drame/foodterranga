const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du restaurant est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    cuisine: {
      type: String,
      required: [true, 'Le type de cuisine est obligatoire'],
      trim: true
    },
    adresse: {
      type: String,
      required: [true, 'L\'adresse est obligatoire'],
      trim: true
    },
    telephone: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    note: {
      type: Number,
      min: [0, 'La note minimale est 0'],
      max: [5, 'La note maximale est 5'],
      default: 0
    },
    image: {
      type: String,
      default: null
    },
    horaires: {
      ouverture: { type: String, default: '08:00' },
      fermeture: { type: String, default: '23:00' }
    },
    estOuvert: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
