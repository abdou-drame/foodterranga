# Guide de déploiement -- TerrangaFood

## 1. MongoDB Atlas
- **Cluster** : terrangafood-cluster (M0 Free, AWS Paris)
- **Utilisateur** : terrangafood-admin
- **Accès réseau** : 0.0.0.0/0 (Ouvert pour le développement)
- **Base de données** : terrangafood

## 2. Initialisation des données (Seed)
Pour peupler la base de données avec les 5 restaurants et 27 plats, exécutez la commande suivante depuis le dossier `api/` :
```bash
MONGODB_URI="votre_uri_atlas" node src/seed/seed.js
## 3. Vercel (Frontend Next.js)
- **Projet** : terrangafood-abdou-drame
- **URL** : https://terrangafood-abdou-drame.vercel.app
- **Root Directory** : web
- **Framework** : Next.js (auto-détecté)
- **Variable** : NEXT_PUBLIC_API_URL
  - **Valeur** : https://foodterranga-api-our-group.onrender.com/api
- **Déploiement continu** : Activé (push sur main)

## 4. Render (Backend Node.js/Express)
- **ID Service** : srv-d7tnu21po60c73adsn2g
- **URL API** : https://foodterranga-api-our-group.onrender.com
- **Dernier Commit** : e0ad4e8 (harmonisation finale de tous les modèles)
- **Déploiement continu** : Activé
