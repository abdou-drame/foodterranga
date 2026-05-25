# 🍛 TerrangaFood — Equipe our-group —

Plateforme de commande de plats auprès de restaurants saint louis.

**Projet pédagogique** — Architecture Logicielle 2 — L3 Génie Logiciel — UCAD / ESP

## Stack technique

| Module | Stack |
|--------|-------|
| Backend API | Express.js, MongoDB, Mongoose |
| Frontend | Next.js 14 (App Router) |
| Base de données | MongoDB (local ou Atlas) |

## Démarrage rapide

### Prérequis

- Node.js 20 LTS
- MongoDB (local ou compte Atlas)
- Git

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/[votre-pseudo]/terrangafood-[equipe].git
cd terrangafood-[equipe]

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec votre URI MongoDB

# Installer les dépendances API
cd api
npm install

# Installer les dépendances Frontend
cd ../web
npm install
```

### Lancement

```bash
# Terminal 1 — API (port 3001)
cd api
npm run dev

# Terminal 2 — Frontend (port 3000)
cd web
npm run dev
```

### Initialiser les données

```bash
cd api
npm run seed
```

## Structure du projet

```
terrangafood/
├── api/                    # Backend Express
│   ├── src/
│   │   ├── models/         # Modèles Mongoose
│   │   ├── routes/         # Routes Express
│   │   ├── controllers/    # Logique métier
│   │   ├── middleware/      # Middleware
│   │   ├── seed/           # Données initiales
│   │   └── app.js          # Point d'entrée
│   └── package.json
├── web/                    # Frontend Next.js
│   ├── app/                # Pages (App Router)
│   ├── components/         # Composants réutilisables
│   ├── lib/                # Utilitaires
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Licence

Projet pédagogique — Usage académique uniquement.

## Fonctionnalités existantes
- Affichage de la liste des restaurants
- Page de détail d’un restaurant avec ses plats
- Système de commandes complet
- **Paiement en ligne via Wave** 💳
- API REST : endpoints /restaurants, /plats, /commandes et /paiements
- Webhooks pour notifications de paiement automatiques

## Documentation supplémentaire

- **[PAIEMENT_WAVE.md](./PAIEMENT_WAVE.md)** : Guide complet d’intégration Wave Payment
