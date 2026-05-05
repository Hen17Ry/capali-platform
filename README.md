# 🎓 CAP ALI — Plateforme Numérique Communautaire

**Communauté d'Appui au Parcours des Africains et Leaders Inspirants**

Plateforme web communautaire pour accompagner les jeunes Béninois et Africains francophones dans leur parcours d'études et d'installation en France : mentorat, ressources, forums, événements.

---

## 🏗️ Stack Technique

| Composant         | Technologie                    |
| ----------------- | ------------------------------ |
| Framework         | NuxtJS 3 + Nitro (full-stack)  |
| Base de données   | PostgreSQL 16                  |
| ORM               | Drizzle ORM                    |
| Cache / Sessions  | Redis 7                        |
| Stockage fichiers | MinIO (S3-compatible)          |
| Authentification  | JWT + OAuth Google             |
| Email             | Resend                         |
| Validation        | Zod + h3-zod                   |
| Containerisation  | Docker + Docker Compose        |
| CI/CD             | GitHub Actions                 |
| Linter / Formater | ESLint + Prettier              |
| i18n              | @nuxtjs/i18n                   |

---

## 🚀 Installation locale (5 commandes)

### Prérequis

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) et Docker Compose
- [Git](https://git-scm.com/)

### Mise en route

```bash
# 1. Cloner le dépôt
git clone https://github.com/Hen17Ry/capali-platform.git && cd capali-platform

# 2. Copier la config d'environnement
cp .env.example .env

# 3. Démarrer les services (PostgreSQL, Redis, MinIO)
docker compose up -d

# 4. Installer les dépendances et préparer Nuxt
npm install

# 5. Lancer les migrations puis démarrer le serveur de développement
npm run db:migrate && npm run dev
```

L'application est disponible sur **http://localhost:3000**.

### Services complémentaires

| Service            | URL                     | Identifiants par défaut             |
| ------------------ | ----------------------- | ----------------------------------- |
| Application        | http://localhost:3000    | —                                   |
| Drizzle Studio     | `npm run db:studio`     | —                                   |
| MinIO Console      | http://localhost:9001    | `capali_minio` / `capali_minio_password` |
| PostgreSQL         | `localhost:5433`        | `capali` / `capali_password`        |
| Redis              | `localhost:6379`        | —                                   |

---

## 📁 Structure du Projet

```
capali-platform/
├── app/                        # Code client (Vue 3)
│   ├── app.vue                 # Point d'entrée
│   ├── components/             # Composants réutilisables
│   │   ├── ui/                 # Composants UI génériques
│   │   ├── mentor/             # Composants liés au mentorat
│   │   ├── resource/           # Composants ressources
│   │   └── forum/              # Composants forum
│   ├── composables/            # Logique partagée (useAuth, useApi...)
│   ├── layouts/                # Layouts (default, dashboard, admin)
│   └── pages/                  # Pages (routing automatique Nuxt)
│       ├── auth/               # Inscription, connexion
│       ├── dashboard/          # Espace utilisateur
│       ├── mentors/            # Annuaire et profils mentors
│       ├── resources/          # Ressources (articles, vidéos)
│       ├── forum/              # Forums thématiques
│       ├── events/             # Événements
│       └── admin/              # Backoffice administrateur
├── server/                     # Code serveur (Nitro)
│   ├── api/                    # Routes API REST
│   │   ├── auth/               # Authentification
│   │   ├── users/              # Gestion profils
│   │   ├── mentors/            # Profils mentors
│   │   ├── mentorship-requests/# Demandes de mentorat
│   │   ├── resources/          # Ressources (CRUD)
│   │   ├── forum/              # Forums
│   │   ├── events/             # Événements
│   │   ├── notifications/      # Notifications
│   │   └── admin/              # Routes admin
│   ├── db/                     # Base de données
│   │   ├── index.ts            # Connexion PostgreSQL
│   │   ├── schema/             # Schémas Drizzle ORM
│   │   └── migrations/         # Migrations SQL
│   ├── middleware/              # Middlewares Nitro (auth, permissions)
│   └── utils/                  # Utilitaires serveur (Redis, JWT, email)
├── docs/                       # Documentation
│   └── adr/                    # Architecture Decision Records
├── docker-compose.yml          # Services Docker (dev)
├── drizzle.config.ts           # Configuration Drizzle Kit
├── nuxt.config.ts              # Configuration Nuxt
└── .github/workflows/          # CI/CD GitHub Actions
```

---

## 🛠️ Scripts disponibles

| Commande              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Lancer le serveur de développement               |
| `npm run build`       | Build de production                              |
| `npm run preview`     | Prévisualiser le build de production              |
| `npm run lint`        | Vérifier le code avec ESLint                     |
| `npm run format`      | Formater le code avec Prettier                   |
| `npm run db:generate` | Générer une migration à partir des changements de schéma |
| `npm run db:migrate`  | Appliquer les migrations en base                 |
| `npm run db:studio`   | Ouvrir Drizzle Studio (interface BDD visuelle)   |

---

## 🔀 Workflow Git

- **Branches** : `main` (production), `develop` (intégration), `feature/nom-feature`
- **Commits** : format [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- **Pull Requests** : vers `develop` puis `main`, minimum une review approuvée
- **Versioning** : [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH)

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour le guide complet de contribution.

---

## 📖 Documentation

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Guide pour les contributeurs bénévoles
- **[docs/adr/](./docs/adr/)** — Architecture Decision Records
- **[Cahier des Charges](./Cahier_Des_Charges_CAP_ALI.pdf)** — Spécifications fonctionnelles complètes

---

## 📄 Licence

Ce projet est sous licence [MIT](./LICENSE).

---

> **CAP ALI** — *Parce que personne ne devrait affronter seul les défis d'un nouveau pays.*
