const mongoose = require('mongoose');

const platSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du plat est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'La description ne peut pas dépasser 300 caractères']
    },
    prix: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    categorie: {
      type: String,
      enum: ['entrée', 'plat principal', 'dessert', 'boisson', 'accompagnement'],
      default: 'plat principal'
    },
    image: {
      type: String,
      default: null
    },
    disponible: {
      type: Boolean,
      default: true
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Le restaurant est obligatoire']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Plat', platSchema);
