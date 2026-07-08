# Étape de build
FROM node:20-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application Nuxt
RUN npm run build

# Étape de production
FROM node:20-alpine

WORKDIR /app

# Copie uniquement du build généré (standalone)
COPY --from=builder /app/.output /app/.output

# Configuration du port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Démarrage du serveur Node.js généré par Nitro
CMD ["node", ".output/server/index.mjs"]
