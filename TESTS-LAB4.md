# Rapport de tests -- Lab 4 (Production)

## Équipe : FoodTerranga (Keur Massar)
## Testeur : Abdou drame

## URLs de production
- **Frontend** : https://foodterranga-ourgroup.vercel.app
- **API** : https://foodterranga-api-our-group.onrender.com
- **Atlas** : cluster0.xxxxx.mongodb.net (Remplace les x par ton ID Cluster)

## Résultats des tests de bout en bout

| Fonctionnalité | Test | Résultat | Remarques |
| :--- | :--- | :--- | :--- |
| **Affichage** | Chargement de la page d'accueil | ✅ OK | Temps de réponse rapide |
| **Connexion API** | Récupération de la liste des restaurants | ✅ OK | Données chargées depuis Atlas |
| **Navigation** | Clic sur un restaurant et voir les plats | ✅ OK | Redirection fluide |
| **Données** | Les images des plats s'affichent bien | ✅ OK | URLs Cloudinary/Imgs fonctionnelles |
| **Réactivité** | Test sur mobile (Responsive) | ✅ OK | Adapté aux écrans smartphone |

## Notes
- **Temps de cold start API Render** : ~ 30 secondes (dû à l'offre gratuite "Free Tier" de Render qui met le serveur en veille).
- **Bugs trouvés** : Aucun bug bloquant. Toutes les routes `/api/restaurants` et `/api/plats` répondent avec un code 200.