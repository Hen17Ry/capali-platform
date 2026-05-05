# ADR-0002 : PostgreSQL 16 + Drizzle ORM

**Date** : 2026-05-05
**Statut** : Accepté

## Contexte

La plateforme CAP ALI gère des données relationnelles complexes : utilisateurs, profils mentors, demandes de mentorat, ressources catégorisées, forums avec fils de discussion, événements avec inscriptions. Les relations entre ces entités sont nombreuses et structurées.

Le projet a besoin de :
- Un moteur de base de données fiable, performant et gratuit
- Un ORM type-safe compatible TypeScript
- La génération et la gestion des migrations
- Le support des types PostgreSQL avancés (UUID, JSONB, enums)

## Décision

Nous utilisons **PostgreSQL 16** comme SGBD et **Drizzle ORM** comme couche d'accès aux données.

## Alternatives considérées

| Alternative                | Avantages                              | Inconvénients                                      |
| -------------------------- | -------------------------------------- | -------------------------------------------------- |
| **PostgreSQL + Drizzle** ✅ | Type-safe, léger, migrations SQL lisibles, performances | Communauté plus petite que Prisma |
| **PostgreSQL + Prisma**    | Grande communauté, outils visuels (Studio) | Runtime plus lourd (~15 Mo), génération de code, requêtes N+1 fréquentes |
| **MongoDB + Mongoose**     | Flexibilité schéma, facile au début    | Non relationnel, inadapté aux relations complexes du projet |
| **SQLite + Drizzle**       | Zéro config, embarqué                  | Pas adapté à la réplication multi-serveurs, limitations concurrentielles |

## Conséquences

### Positives
- **Type safety de bout en bout** : les schémas Drizzle génèrent les types TypeScript, pas de décalage entre le code et la BDD
- **Requêtes SQL transparentes** : Drizzle génère du SQL lisible, facile à débugger et à optimiser
- **Léger** : pas de runtime lourd, pas de génération de code
- **Migrations SQL** : les fichiers de migration sont du SQL standard, auditables et versionnés dans Git
- **PostgreSQL 16** : mature, fiable, supporte UUID natif, JSONB, full-text search, réplication streaming
- **Enums PostgreSQL** : utilisés pour les statuts (user_status, mentorship_status, etc.) → intégrité au niveau BDD

### Négatives
- **Pas de rollback automatique** des migrations : les rollbacks doivent être écrits manuellement
- **Drizzle Studio** est moins mature que Prisma Studio
- **Documentation Drizzle** moins abondante que Prisma (mais suffisante)

### Risques
- Si Drizzle ORM est abandonné par ses mainteneurs, une migration vers un autre ORM serait nécessaire (mais les schémas SQL restent portables)
- Les requêtes complexes avec jointures multiples demandent plus de code que Prisma (pas de `include` implicite)

## Notes d'implémentation

### Configuration

- Pool de connexion : 20 connexions max, timeout 2s, idle 30s (`server/db/index.ts`)
- Schémas organisés par domaine dans `server/db/schema/` avec un barrel export `index.ts`
- Migrations dans `server/db/migrations/`, générées via `npm run db:generate`
- Toutes les tables utilisent `uuid` comme clé primaire avec `defaultRandom()`
- Convention : `createdAt` sur toutes les tables, `deletedAt` pour le soft delete (conformité RGPD)
