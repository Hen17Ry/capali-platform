# ADR-0005 : API REST plutôt que GraphQL

**Date** : 2026-05-05
**Statut** : Accepté

## Contexte

La plateforme CAP ALI expose des données via une API côté serveur (Nitro) consommée par le frontend SSR (Nuxt) et potentiellement par des clients tiers (application mobile future). Le choix du style d'API impacte :
- La complexité de développement et de maintenance
- La performance réseau (critique pour les utilisateurs en Afrique sur 3G)
- La courbe d'apprentissage pour les contributeurs bénévoles
- L'outillage disponible (documentation, debugging, testing)

## Décision

Nous utilisons une **API REST** avec les conventions Nuxt/Nitro (file-based routing) pour toutes les interactions client-serveur.

## Alternatives considérées

| Alternative       | Avantages                                      | Inconvénients                                              |
| ----------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| **REST** ✅        | Simple, standard HTTP, caching natif, outils matures | Over-fetching/under-fetching possible |
| **GraphQL**        | Requêtes flexibles, un seul endpoint, typage fort | Complexité serveur (resolvers, schema), caching difficile, surcharge pour ce périmètre |
| **tRPC**           | Type-safety de bout en bout, zéro schema       | Couplage fort client-serveur, communauté Vue/Nuxt limitée |
| **gRPC**           | Très performant, contrats stricts (protobuf)   | Pas adapté au web browser, complexité de setup            |

## Conséquences

### Positives
- **Simplicité** : les routes API sont de simples fichiers dans `server/api/`, convention Nuxt native
- **Caching HTTP** : les réponses GET bénéficient du cache navigateur, CDN et Redis
- **Outils** : testable avec curl, Postman, ou directement dans le navigateur
- **Standard universel** : tout développeur web connaît REST, pas de formation nécessaire
- **Performance réseau** : les réponses REST sont prévisibles en taille, pas de parsing de requête complexe côté serveur
- **Compatible SSR** : les appels API internes en SSR sont directs (pas de réseau), très rapide
- **Validation Zod** : chaque route valide ses inputs avec `h3-zod`, les erreurs sont explicites

### Négatives
- **Over-fetching** : certaines routes retournent plus de données que nécessaire (mitigé par des projections explicites)
- **Versioning** : si l'API évolue, il faut gérer la rétro-compatibilité (pas de problème tant que le client est dans le même monorepo)
- **Pas de subscription native** : pour des fonctionnalités temps réel (notifications), il faudra ajouter WebSocket ou SSE

### Risques
- Si une application mobile native est développée en V2, elle pourrait bénéficier de la flexibilité GraphQL pour réduire les appels réseau. Cependant, REST reste parfaitement viable pour mobile
- L'over-fetching peut impacter les utilisateurs sur 3G → il faudra être attentif à la taille des réponses JSON

## Conventions d'API

### Structure des routes

```
server/api/
├── auth/
│   ├── register.post.ts      → POST /api/auth/register
│   ├── login.post.ts         → POST /api/auth/login
│   └── logout.post.ts        → POST /api/auth/logout
├── mentors/
│   ├── index.get.ts          → GET  /api/mentors
│   ├── [id].get.ts           → GET  /api/mentors/:id
│   └── profile.post.ts       → POST /api/mentors/profile
└── resources/
    ├── index.get.ts          → GET  /api/resources?theme=logement&level=predeparture
    └── [id].get.ts           → GET  /api/resources/:id
```

### Format de réponse standard

```json
// Succès
{
  "data": { ... },
  "meta": {
    "total": 42,
    "page": 1,
    "perPage": 20
  }
}

// Erreur
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le message doit contenir au minimum 100 caractères",
    "fields": {
      "message": ["Minimum 100 caractères requis"]
    }
  }
}
```

### Codes HTTP utilisés

| Code | Usage                                |
| ---- | ------------------------------------ |
| 200  | Succès (GET, PATCH)                  |
| 201  | Ressource créée (POST)              |
| 204  | Suppression réussie (DELETE)         |
| 400  | Erreur de validation                 |
| 401  | Non authentifié                      |
| 403  | Non autorisé (permissions)           |
| 404  | Ressource non trouvée               |
| 409  | Conflit (ex: email déjà utilisé)     |
| 429  | Rate limit dépassé                   |
| 500  | Erreur serveur                       |
