import Link from 'next/link';
import PlatCard from '../../../components/PlatCard';
import { getRestaurant, getPlatsByRestaurant } from '../../../lib/api';

export default async function RestaurantDetailPage({ params }) {
  const { id } = params;
  let restaurant = null;
  let plats = [];
  let error = null;

  try {
    restaurant = await getRestaurant(id);
    plats = await getPlatsByRestaurant(id);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <Link href="/" className="back-link">← Retour aux restaurants</Link>
        <div className="error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ paddingTop: '40px' }}>
        <Link href="/" className="back-link">← Retour aux restaurants</Link>
        <div className="error">
          <p>Restaurant non trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-detail">
      <Link href="/" className="back-link">← Retour aux restaurants</Link>

      <div className="restaurant-detail-header">
        <h1>{restaurant.nom}</h1>
        <p>{restaurant.description}</p>
        <div className="restaurant-detail-info">
          <span>🍽️ {restaurant.cuisine}</span>
          <span>📍 {restaurant.adresse}</span>
          {restaurant.telephone && <span>📞 {restaurant.telephone}</span>}
          <span>🕐 {restaurant.horaires?.ouverture} — {restaurant.horaires?.fermeture}</span>
          <span>⭐ {restaurant.note}/5</span>
        </div>
      </div>
      {/* Ajouter après la div restaurant-detail-info */}
<div style={{ marginTop: '20px' }}>
  <Link
    href={`/commander/${restaurant._id}`}
    style={{
      display: 'inline-block',
      padding: '10px 24px',
      background: '#52B788', // Un beau vert pour TerrangaFood
      color: 'white',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      textDecoration: 'none' // Pour enlever le soulignement du lien
    }}
  >
    Commander ici
  </Link>
</div>

      <section className="plats-section">
        <h2>Menu ({plats.length} plats)</h2>

        {plats.length === 0 ? (
          <p className="loading">Aucun plat disponible pour ce restaurant.</p>
        ) : (
          <div className="plats-grid">
            {plats.map((plat) => (
              <PlatCard key={plat._id} plat={plat} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
