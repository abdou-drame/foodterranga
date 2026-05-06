const Plat = require('../models/plat');

// GET /api/plats — Récupérer tous les plats
exports.getAll = async (req, res, next) => {
  try {
    const plats = await Plat.find().populate('restaurant', 'nom');
    res.json(plats);
  } catch (error) {
    next(error);
  }
};

// GET /api/plats/:id — Récupérer un plat par son ID
exports.getById = async (req, res, next) => {
  try {
    const plat = await Plat.findById(req.params.id).populate('restaurant', 'nom adresse');
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(plat);
  } catch (error) {
    next(error);
  }
};

// GET /api/plats/restaurant/:restaurantId — Plats d'un restaurant
exports.getByRestaurant = async (req, res, next) => {
  try {
    const plats = await Plat.find({ restaurant: req.params.restaurantId });
    res.json(plats);
  } catch (error) {
    next(error);
  }
};

// POST /api/plats — Créer un nouveau plat
exports.create = async (req, res, next) => {
  try {
    const plat = new Plat(req.body);
    const saved = await plat.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', erreurs: messages });
    }
    next(error);
  }
};

// PUT /api/plats/:id — Mettre à jour un plat
exports.update = async (req, res, next) => {
  try {
    const plat = await Plat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json(plat);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Données invalides', erreurs: messages });
    }
    next(error);
  }
};

// DELETE /api/plats/:id — Supprimer un plat
exports.delete = async (req, res, next) => {
  try {
    const plat = await Plat.findByIdAndDelete(req.params.id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    res.json({ message: 'Plat supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
