import Link from 'next/link';
import { getCommandes } from '../../lib/api';
import StatutBadge from '../../components/StatutBadge';

export default async function MesCommandesPage() {
  let commandes = [];
  let error = null;

  try {
    commandes = await getCommandes();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="commandes-page">
      <Link href="/" className="back-link">
        Retour aux restaurants
      </Link>
      <h1>Mes commandes ({commandes.length})</h1>

      {error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : commandes.length === 0 ? (
        <div className="loading">
          <p>Aucune commande pour le moment.</p>
          <p style={{ marginTop: '8px' }}>
            <Link href="/" style={{ color: 'var(--accent)' }}>
              Parcourir les restaurants
            </Link>
          </p>
        </div>
      ) : (
        <div className="commandes-list">
          {commandes.map((cmd) => (
            <div key={cmd._id} className="commande-card">
              <div className="commande-card-header">
                <h3>
                  {cmd.restaurant?.nom || 'Restaurant'}
                </h3>
                <StatutBadge statut={cmd.statut} />
              </div>

              <div className="commande-card-details">
                <p>{cmd.client}</p>
                <p>{cmd.adresseLivraison}</p>
                <p>{cmd.telephone}</p>
                {cmd.plats && (
                  <p>{cmd.plats.length} plat(s)</p>
                )}
                {cmd.commentaire && (
                  <p>{cmd.commentaire}</p>
                )}
              </div>

              <div className="commande-card-footer">
                <span className="commande-montant">
                  {cmd.montantTotal?.toLocaleString('fr-SN')} FCFA
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}>
                  {new Date(cmd.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}