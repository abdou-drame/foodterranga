const Restaurant = require('../models/restaurant'); // Bien vérifier le 'r' minuscule ici

// GET /api/restaurants — Récupérer tous les restaurants
exports.getAll = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().sort({ note: -1 });
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

// GET /api/restaurants/:id — Récupérer un restaurant par son ID
exports.getById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

// POST /api/restaurants — Créer un nouveau restaurant
exports.create = async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    const saved = await restaurant.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', erreurs: messages });
    }
    next(error);
  }
};

// PUT /api/restaurants/:id — Mettre à jour un restaurant
exports.update = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    res.json(restaurant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', erreurs: messages });
    }
    next(error);
  }
};

// DELETE /api/restaurants/:id — Supprimer un restaurant
exports.delete = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    res.json({ message: 'Restaurant supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};