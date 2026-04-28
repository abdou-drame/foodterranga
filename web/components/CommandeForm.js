'use client';

import { useState } from 'react';
import { creerCommande } from '../lib/api';

export default function CommandeForm({ restaurant, plats }) {
  const [client, setClient] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [platsChoisis, setPlatsChoisis] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cocher / décocher un plat
  const togglePlat = (platId) => {
    setPlatsChoisis((prev) =>
      prev.includes(platId)
        ? prev.filter((id) => id !== platId)
        : [...prev, platId]
    );
  };

  // Calculer le total en temps réel
  const total = plats
    .filter((p) => platsChoisis.includes(p._id))
    .reduce((sum, p) => sum + p.prix, 0);

  // Soumettre la commande
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await creerCommande({
        client,
        telephone,
        adresseLivraison: adresse,
        restaurant: restaurant._id,
        plats: platsChoisis,
        montantTotal: total,
        commentaire,
      });

      setMessage({
        type: 'success',
        text: 'Commande envoyée avec succès !'
      });

      // Réinitialiser le formulaire
      setClient('');
      setTelephone('');
      setAdresse('');
      setCommentaire('');
      setPlatsChoisis([]);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="commande-form">
      <h2>Commander chez {restaurant.nom}</h2>

      {message && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Votre nom</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="ex : Moussa Diop"
            required
          />
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="ex : +221 77 123 45 67"
            required
          />
        </div>

        <div className="form-group">
          <label>Adresse de livraison</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="ex : Keur Massar, Villa 12"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Choisissez vos plats ({platsChoisis.length} sélectionné(s))
          </label>
          <div className="plats-selection">
            {plats.map((plat) => (
              <label
                key={plat._id}
                className={`plat-checkbox ${
                  platsChoisis.includes(plat._id) ? 'selected' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={platsChoisis.includes(plat._id)}
                  onChange={() => togglePlat(plat._id)}
                />
                <div className="plat-checkbox-info">
                  <div className="nom">{plat.nom}</div>
                  <div className="prix">
                    {plat.prix.toLocaleString('fr-SN')} FCFA
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Commentaire (optionnel)</label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="ex : Sans piment svp"
            rows={3}
          />
        </div>

        {platsChoisis.length > 0 && (
          <div className="total-section">
            <span>Total</span>
            <span>{total.toLocaleString('fr-SN')} FCFA</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-commander"
          disabled={loading || platsChoisis.length === 0}
        >
          {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
        </button>
      </form>
    </div>
  );
}