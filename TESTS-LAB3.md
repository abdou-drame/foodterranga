# Rapport de tests -- Lab 3 (Docker)

## Équipe : [Nom de guerre de ton équipe]
## Testeur : [abdou drame] (QA)

### Images Docker
| # | Test | OK ? | Notes |
| :--- | :--- | :--- | :--- |
| 1 | docker build API réussit | | |
| 2 | docker build Frontend réussit | | |
| 3 | Image API < 250 Mo | | Taille : |
| 4 | Image Frontend < 500 Mo | | Taille : |

### Docker Compose
| # | Test | OK ? | Notes |
| :--- | :--- | :--- | :--- |
| 5 | docker compose up --build réussit | | |
| 6 | 3 conteneurs en état "Up" | | |
| 7 | Seed fonctionne dans le conteneur | | |
| 8 | API répond sur localhost:3001 | | |
| 9 | Frontend répond sur localhost:3000 | | |

### Fonctionnel
| # | Test | OK ? | Notes |
| :--- | :--- | :--- | :--- |
| 10 | Restaurants affichés | | |
| 11 | Commande créée via formulaire | | |
| 12 | Commande visible dans mes-cmds | | |
| 13 | Données persistent après restart | | (Test: down puis up sans -v) |
| 14 | docker compose down fonctionne | | |
| 15 | docker compose down -v vide la DB | | |