/**
 * @file app.js
 * @description Point d'entrée principal du serveur backend TerrangaFood.
 * Ce fichier configure l'application Express, établit la connexion à MongoDB Atlas,
 * définit les middlewares globaux (CORS, JSON, Error Handling) et centralise
 * les routes de l'API (Restaurants et Plats).
 * * @author Abdou Drame (DB )
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const platRoutes = require('./routes/plats');
const errorHandler = require('./middleware/errorHandler');
const commandeRoutes = require('./routes/commandes');

// Charger .env seulement en développement local
// En Docker, les variables sont injectées par docker-compose
const path = require('path');
const fs = require('fs');
const envPath = path.resolve(__dirname, '../../env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware globaux ---
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API TerrangaFood 🍛',
    version: '0.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      plats: '/api/plats',
      commandes: '/api/commandes'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/plats', platRoutes);
app.use('/api/commandes', commandeRoutes);

// --- Gestion des erreurs ---
app.use(errorHandler);

// --- Connexion MongoDB et démarrage ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  });

module.exports = app;
