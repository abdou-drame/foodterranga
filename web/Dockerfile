# === Dockerfile Frontend TerrangaFood ===

# Image de base légère Node.js 20 sur Alpine
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances (pour optimiser le cache)
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Variable d’environnement par défaut (surchargée par docker-compose)
ENV NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Compiler l’application Next.js
RUN npm run build

# Documenter le port utilisé par Next.js
EXPOSE 3000

# Lancer l’application en mode production
CMD ["npm", "start"]