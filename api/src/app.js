/**
 * @file app.js
 * @description Point d'entrée principal du serveur backend TerrangaFood.
 * Ce fichier configure l'application Express, établit la connexion à MongoDB Atlas,
 * définit les middlewares globaux (CORS, JSON, Error Handling) et centralise
 * les routes de l'API (Restaurants et Plats).
 * @author Abdou Drame (DB)
 * @version 1.0.1
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// --- Configuration de l'environnement ---
// Correction : On utilise ".env" avec le point. 
// __dirname est dans api/src, donc "../../.env" remonte à la racine du projet.
const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log("✅ Mode Local : Fichier .env détecté et chargé.");
} else {
    // En Docker, les variables sont injectées directement, donc pas besoin de fichier .env
    console.log("ℹ️ Mode Docker/Système : Utilisation des variables d'environnement injectées.");
}

const restaurantRoutes = require('./routes/restaurants');
const platRoutes = require('./routes/plats');
const commandeRoutes = require('./routes/commandes');
const paiementRoutes = require('./routes/paiements');
const webhookRoutes = require('./routes/webhooks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware globaux ---
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API TerrangaFood 🍛',
    version: '1.0.0',
    status: 'Online',
    endpoints: {
      restaurants: '/api/restaurants',
      plats: '/api/plats',
      commandes: '/api/commandes',
      paiements: '/api/commandes/:id/paiement',
      webhooks: '/api/webhooks/wave'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/plats', platRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/commandes', paiementRoutes);
app.use('/api/webhooks', webhookRoutes);

// --- Gestion des erreurs ---
app.use(errorHandler);

// --- Connexion MongoDB et démarrage ---
// On vérifie que l'URI n'est pas undefined avant de tenter la connexion
if (!MONGODB_URI) {
    console.error('❌ Erreur : La variable MONGODB_URI est "undefined".');
    console.error('Vérifiez que votre fichier .env est bien à la racine et contient l\'URI sur une seule ligne.');
    process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 URL locale : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });

module.exports = app;