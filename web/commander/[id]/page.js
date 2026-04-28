import Link from 'next/link';
import CommandeForm from '../../../components/CommandeForm';
import { getRestaurant, getPlatsByRestaurant } from '../../../lib/api';

export default async function CommanderPage({ params }) {
  // On récupère l'ID du restaurant depuis l'URL
  const { id } = params;
  
  let restaurant = null;
  let plats = [];
  let error = null;

  try {
    // Récupération des données depuis ton API (Port 3001)
    restaurant = await getRestaurant(id);
    plats = await getPlatsByRestaurant(id);
  } catch (err) {
    error = err.message;
  }

  // Gestion des erreurs (ex: restaurant inexistant ou API éteinte)
  if (error || !restaurant) {
    return (
      <div className="commande-page">
        <Link href="/" className="back-link">
          ← Retour aux restaurants
        </Link>
        <div className="form-message error">
          <p>{error || 'Restaurant non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commande-page">
      <Link href={`/restaurants/${id}`} className="back-link">
        ← Retour au restaurant
      </Link>
      
      {/* On passe les données au formulaire interactif */}
      <CommandeForm 
        restaurant={restaurant} 
        plats={plats.filter((p) => p.disponible)} 
      />
    </div>
  );
}