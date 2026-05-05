# 🤝 Contribuer à CAP ALI

Merci de ton intérêt pour CAP ALI ! Ce guide t'aidera à contribuer efficacement au projet, que tu sois développeur, designer ou simplement curieux.

---

## 📋 Table des matières

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Workflow Git](#-workflow-git)
- [Conventions de code](#-conventions-de-code)
- [Conventions de commits](#-conventions-de-commits)
- [Soumettre une Pull Request](#-soumettre-une-pull-request)
- [Structure du projet](#-structure-du-projet)
- [Guide de la base de données](#-guide-de-la-base-de-données)
- [Bonnes pratiques](#-bonnes-pratiques)
- [Besoin d'aide ?](#-besoin-daide-)

---

## 🔧 Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** >= 20 ([télécharger](https://nodejs.org/))
- **Docker** et **Docker Compose** ([télécharger](https://www.docker.com/))
- **Git** ([télécharger](https://git-scm.com/))
- Un éditeur de code (recommandé : [VS Code](https://code.visualstudio.com/) avec les extensions Vue, ESLint, Prettier)

---

## 🚀 Installation

```bash
# 1. Forker le dépôt sur GitHub, puis cloner ton fork
git clone https://github.com/<ton-username>/capali-platform.git
cd capali-platform

# 2. Ajouter le dépôt original comme remote upstream
git remote add upstream https://github.com/Hen17Ry/capali-platform.git

# 3. Copier les variables d'environnement
cp .env.example .env

# 4. Démarrer les services Docker
docker compose up -d

# 5. Installer les dépendances
npm install

# 6. Appliquer les migrations de base de données
npm run db:migrate

# 7. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:3000**.

---

## 🔀 Workflow Git

Nous suivons un workflow **Git Flow simplifié** avec 3 types de branches :

### Branches principales

| Branche     | Rôle                                    |
| ----------- | --------------------------------------- |
| `main`      | Production — code stable et déployé     |
| `develop`   | Intégration — dernière version en cours |

### Branches de travail

```
feature/nom-de-la-feature   → Nouvelle fonctionnalité
fix/description-du-bug      → Correction de bug
chore/description            → Tâches techniques (CI, config, refactor)
docs/description             → Documentation
```

### Procédure pour une nouvelle contribution

```bash
# 1. Se placer sur develop et le mettre à jour
git checkout develop
git pull upstream develop

# 2. Créer ta branche de travail
git checkout -b feature/ma-fonctionnalite

# 3. Travailler, committer régulièrement (voir conventions ci-dessous)
git add .
git commit -m "feat(auth): ajouter le formulaire d'inscription"

# 4. Pousser ta branche sur ton fork
git push origin feature/ma-fonctionnalite

# 5. Ouvrir une Pull Request vers `develop` sur GitHub
```

### ⚠️ Règles importantes

- **Ne pousse jamais directement sur `main` ou `develop`**
- Toujours passer par une Pull Request
- Minimum **1 review approuvée** avant merge
- Ta branche doit être à jour avec `develop` avant de merge

---

## 🎨 Conventions de code

### Général

- **TypeScript strict** activé — pas de `any` implicite
- **ESLint** pour la qualité du code : `npm run lint`
- **Prettier** pour le formatage : `npm run format`
- Pas de `console.log` en production (le linter émet un warning)

### Frontend (Vue 3 / Nuxt)

- Utiliser la **Composition API** avec `<script setup lang="ts">`
- Noms de composants en **PascalCase** (`MentorCard.vue`)
- Noms de pages et dossiers en **kebab-case** (`forgot-password.vue`)
- Chaque composant dans un fichier unique (SFC)
- Préférer les composables (`use*.ts`) pour la logique partagée

### Backend (Nitro)

- Routes API dans `server/api/` avec le nommage Nuxt : `resource.get.ts`, `resource.post.ts`
- Valider **tous** les inputs avec **Zod** + `h3-zod`
- Utiliser Drizzle ORM pour toutes les requêtes — **jamais de SQL brut**
- Centraliser la logique d'authentification et de permissions dans les **middlewares**

### Nommage des fichiers

```
Composants Vue :  PascalCase.vue     → MentorCard.vue, ResourceFilter.vue
Pages :           kebab-case.vue     → forgot-password.vue, [id].vue
API routes :      nom.method.ts      → index.get.ts, profile.post.ts
Composables :     use*.ts            → useAuth.ts, useMentorship.ts
Schémas DB :      snake_case.ts      → mentors.ts, forum.ts
```

---

## 📝 Conventions de commits

Nous utilisons les **[Conventional Commits](https://www.conventionalcommits.org/fr/)** :

```
<type>(<scope>): <description courte>

[corps optionnel]

[footer optionnel]
```

### Types autorisés

| Type       | Quand l'utiliser                                |
| ---------- | ----------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                         |
| `fix`      | Correction de bug                               |
| `docs`     | Documentation uniquement                        |
| `style`    | Formatage, point-virgules, etc. (pas de logique)|
| `refactor` | Changement de code qui ne corrige ni n'ajoute   |
| `perf`     | Amélioration de performance                     |
| `test`     | Ajout ou correction de tests                    |
| `chore`    | Tâches de maintenance (CI, dépendances, config) |
| `build`    | Changements liés au build ou aux dépendances    |

### Scopes courants

`auth`, `mentorship`, `resources`, `forum`, `events`, `notifications`, `admin`, `ui`, `db`, `api`, `infra`, `ci`

### Exemples

```bash
feat(auth): ajouter l'inscription par email
fix(mentorship): corriger l'expiration automatique des demandes
docs(readme): ajouter les instructions d'installation
chore(deps): mettre à jour drizzle-orm vers 0.46
refactor(api): extraire la validation dans un middleware
```

---

## 🔃 Soumettre une Pull Request

### Checklist avant de soumettre

- [ ] Le code compile sans erreur (`npm run build`)
- [ ] Le linter passe (`npm run lint`)
- [ ] Les commits suivent les Conventional Commits
- [ ] Le code est testé manuellement
- [ ] Si modification du schéma : migration générée (`npm run db:generate`)
- [ ] Pas de `console.log` ou code de debug oublié
- [ ] Les types TypeScript sont corrects (pas de `any`)

### Template de PR

Quand tu crées ta PR, décris :

```markdown
## Description
Brève description de ce que fait cette PR.

## Type de changement
- [ ] Nouvelle fonctionnalité (feat)
- [ ] Correction de bug (fix)
- [ ] Refactoring (refactor)
- [ ] Documentation (docs)
- [ ] Autre (préciser)

## Comment tester
1. Étape 1
2. Étape 2
3. Résultat attendu

## Captures d'écran (si UI)
<!-- Ajouter des captures si pertinent -->
```

---

## 🗄️ Guide de la base de données

### Modifier le schéma

1. Modifier les fichiers dans `server/db/schema/`
2. Générer la migration : `npm run db:generate`
3. Vérifier le fichier SQL généré dans `server/db/migrations/`
4. Appliquer la migration : `npm run db:migrate`
5. Committer le schéma **et** la migration ensemble

### Visualiser la base

```bash
npm run db:studio
```

### Règles

- Toujours ajouter `createdAt` sur les nouvelles tables
- Utiliser `uuid` pour les clés primaires
- Utiliser `pgEnum` pour les champs à valeurs fixes
- Préférer le **soft delete** (`deletedAt`) à la suppression physique
- Documenter les relations avec des foreign keys et le `onDelete` approprié

---

## 💡 Bonnes pratiques

### Sécurité

- **Valider tous les inputs** côté serveur avec Zod
- Ne jamais faire confiance aux données client
- Utiliser les middlewares pour vérifier l'authentification et les permissions
- Pas de SQL brut — Drizzle ORM uniquement

### Performance

- Priorité **mobile-first** (pensez smartphone Android basique en 4G)
- Utiliser le **SSR** de Nuxt pour les pages publiques
- Mettre en cache avec Redis quand pertinent
- Limiter la taille des bundles JS

### Accessibilité

- Attributs `aria-*` sur les composants interactifs
- Navigation au clavier fonctionnelle
- Contraste de couleurs minimum 4.5:1
- Structure de titres logique (un seul `<h1>` par page)

---

## 🆘 Besoin d'aide ?

- **Questions techniques** : Ouvre une [issue](https://github.com/Hen17Ry/capali-platform/issues) avec le label `question`
- **Bug trouvé** : Ouvre une issue avec le label `bug` et décris les étapes pour reproduire
- **Idée de fonctionnalité** : Ouvre une issue avec le label `enhancement`
- **Architecture** : Consulte les [ADR](./docs/adr/) pour comprendre les décisions techniques

---

> Chaque contribution, même petite, fait avancer la communauté CAP ALI. Merci pour ton engagement ! 🙏
