# == Dockerfile API TerrangaFood ==
# Étape 1 : Image de base
FROM node:20-alpine

# Étape 2 : Répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers de dépendances
# (on copie d’abord package*.json pour profiter
# du cache Docker lors du npm install)
COPY package.json package-lock.json* ./

# Étape 4 : Installer les dépendances
RUN npm install --production

# Étape 5 : Copier le code source
COPY . .

# Étape 6 : Documenter le port
EXPOSE 3001

# Étape 7 : Commande de démarrage
CMD ["node", "src/app.js"]