const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger .env seulement en développement local
// En Docker, les variables sont injectées par docker-compose via 'environment'
const envPath = path.resolve(__dirname, '../../../env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const Restaurant = require('../models/Restaurant');
const Plat = require('../models/Plat');

const restaurants = [
  {
    nom: 'Chez Fatou',
    cuisine: 'Sénégalaise traditionnelle',
    adresse: 'Rue 10, Médina, Dakar',
    telephone: '+221 77 123 45 67',
    description: 'Cuisine familiale sénégalaise authentique. Les meilleurs thiéboudienne et yassa de la Médina.',
    note: 4.5,
    horaires: { ouverture: '08:00', fermeture: '22:00' },
    estOuvert: true
  },
  {
    nom: 'Le Lamantin',
    cuisine: 'Africaine fusion',
    adresse: 'Corniche Ouest, Fann, Dakar',
    telephone: '+221 33 456 78 90',
    description: 'Restaurant gastronomique avec vue sur l\'océan. Fusion de saveurs africaines et européennes.',
    note: 4.2,
    horaires: { ouverture: '11:00', fermeture: '23:00' },
    estOuvert: true
  },
  {
    nom: 'Dibiterie Keur Serigne',
    cuisine: 'Grillades sénégalaises',
    adresse: 'Avenue Cheikh Anta Diop, Dakar',
    telephone: '+221 76 234 56 78',
    description: 'Spécialiste du dibi (viande grillée). Ambiance conviviale et prix abordables.',
    note: 4.0,
    horaires: { ouverture: '10:00', fermeture: '01:00' },
    estOuvert: true
  },
  {
    nom: 'Phare des Mamelles',
    cuisine: 'Fruits de mer',
    adresse: 'Route des Mamelles, Ouakam, Dakar',
    telephone: '+221 33 567 89 01',
    description: 'Poissons et fruits de mer frais du jour. Terrasse panoramique sur les Mamelles.',
    note: 4.7,
    horaires: { ouverture: '12:00', fermeture: '23:00' },
    estOuvert: true
  },
  {
    nom: 'Tangana Café',
    cuisine: 'Café & snacks',
    adresse: 'Rue Parchappe, Plateau, Dakar',
    telephone: '+221 78 345 67 89',
    description: 'Petit-déjeuner sénégalais, sandwiches et café Touba. Idéal pour les étudiants.',
    note: 3.8,
    horaires: { ouverture: '06:30', fermeture: '20:00' },
    estOuvert: true
  }
];

const platsParRestaurant = {
  'Chez Fatou': [
    { nom: 'Thiéboudienne', description: 'Riz au poisson avec légumes, le plat national sénégalais', prix: 2500, categorie: 'plat principal' },
    { nom: 'Yassa Poulet', description: 'Poulet mariné aux oignons et citron, servi avec du riz blanc', prix: 2000, categorie: 'plat principal' },
    { nom: 'Mafé', description: 'Sauce à l\'arachide avec viande de bœuf et riz', prix: 2000, categorie: 'plat principal' },
    { nom: 'Bissap', description: 'Jus d\'hibiscus glacé, sucré à la menthe', prix: 500, categorie: 'boisson' }
  ],
  'Le Lamantin': [
    { nom: 'Filet de Thiof Grillé', description: 'Mérou grillé, purée de patate douce, sauce bissap', prix: 7500, categorie: 'plat principal' },
    { nom: 'Tartare de Thon Dakarois', description: 'Thon rouge local, avocat, mangue verte et citron vert', prix: 5500, categorie: 'entrée' },
    { nom: 'Jus de Bouye', description: 'Jus de fruit du baobab, glacé', prix: 1500, categorie: 'boisson' }
  ],
  'Dibiterie Keur Serigne': [
    { nom: 'Dibi Agneau', description: 'Côtelettes d\'agneau grillées au charbon, oignons et moutarde', prix: 3000, categorie: 'plat principal' },
    { nom: 'Ataya', description: 'Thé à la menthe sénégalais, préparé en 3 services', prix: 300, categorie: 'boisson' }
  ],
  'Phare des Mamelles': [
    { nom: 'Crevettes Géantes Grillées', description: 'Crevettes de Casamance, beurre ail-persil, riz parfumé', prix: 8000, categorie: 'plat principal' },
    { nom: 'Salade de Poulpe', description: 'Poulpe tendre, légumes croquants, vinaigrette citron', prix: 4000, categorie: 'entrée' }
  ],
  'Tangana Café': [
    { nom: 'Ndambé Baguette', description: 'Baguette garnie de haricots niébé en sauce tomate épicée', prix: 800, categorie: 'plat principal' },
    { nom: 'Café Touba', description: 'Café infusé au poivre de Selim, spécialité sénégalaise', prix: 300, categorie: 'boisson' }
  ]
};

async function seed() {
  try {
    console.log('⏳ Connexion à MongoDB...');
    // Utilisation de process.env.MONGODB_URI (défini dans .env ou injecté par Docker)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Nettoyer les collections
    await Restaurant.deleteMany({});
    await Plat.deleteMany({});
    console.log('🗑️ Collections nettoyées');

    // 2. Insérer les restaurants
    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`🏪 ${savedRestaurants.length} restaurants insérés`);

    // 3. Insérer les plats liés
    let totalPlats = 0;
    for (const restaurant of savedRestaurants) {
      const platsData = platsParRestaurant[restaurant.nom];
      if (platsData) {
        const platsAvecRef = platsData.map((plat) => ({
          ...plat,
          restaurant: restaurant._id
        }));
        await Plat.insertMany(platsAvecRef);
        totalPlats += platsAvecRef.length;
      }
    }
    console.log(`🍽️ ${totalPlats} plats insérés`);

    console.log('\n✅ Seed terminé avec succès !');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  }
}

seed();