# ADR-0004 : JWT + OAuth Google pour l'authentification

**Date** : 2026-05-05
**Statut** : Accepté

## Contexte

La plateforme CAP ALI doit gérer l'authentification de ses utilisateurs avec les contraintes suivantes :
- **Deux méthodes de connexion** : email/mot de passe classique et connexion via Google (OAuth)
- **Architecture stateless** : compatible avec la réplication horizontale (3 instances Nuxt)
- **Sécurité** : protection contre le vol de session, XSS, CSRF
- **Mobile-first** : les utilisateurs sont majoritairement sur smartphone Android
- **Simplicité** : l'équipe bénévole doit pouvoir maintenir le système d'auth

Le module `nuxt-auth-utils` est utilisé pour simplifier l'intégration.

## Décision

Nous utilisons un système d'authentification basé sur :
- **JWT (JSON Web Tokens)** stockés dans des cookies `httpOnly` et `secure`
- **Access token** : courte durée de vie (15 minutes)
- **Refresh token** : longue durée (30 jours, option "Rester connecté")
- **OAuth 2.0 Google** : comme méthode de connexion alternative
- **bcryptjs** : pour le hashing des mots de passe (12 rounds)
- **nuxt-auth-utils** : module Nuxt pour la gestion des sessions côté serveur

## Alternatives considérées

| Alternative                     | Avantages                                  | Inconvénients                                                |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| **JWT + OAuth** ✅               | Stateless, compatible réplication, standard | Complexité de la rotation des tokens                         |
| **Sessions serveur (Redis)**    | Simple, révocation immédiate               | Stateful, requête Redis à chaque requête, moins performant   |
| **Auth-as-a-Service (Auth0, Clerk)** | Zéro code auth, très sécurisé         | Coût mensuel, vendor lock-in, dépendance externe             |
| **Passport.js custom**          | Très flexible                              | Beaucoup de code à maintenir, nombreuses vulnérabilités possibles |

## Conséquences

### Positives
- **Stateless** : les JWT sont auto-vérifiables, pas de lookup en base pour chaque requête
- **Compatible réplication** : n'importe quelle instance Nuxt peut valider un JWT sans état partagé
- **OAuth Google** : réduit la friction d'inscription pour les utilisateurs (un clic)
- **Cookies httpOnly** : les tokens ne sont pas accessibles depuis JavaScript → protection XSS
- **Refresh token 30 jours** : conformément au CDC, option "Rester connecté"

### Négatives
- **Révocation complexe** : un JWT compromis reste valide jusqu'à expiration (15 min max)
- **Taille du cookie** : les JWT sont plus gros qu'un session ID classique
- **Complexité** : la logique de refresh token et rotation nécessite une implémentation soignée

### Risques
- Si le `JWT_SECRET` est compromis, tous les tokens sont invalidés → rotation obligatoire
- Les refresh tokens stockés côté client peuvent être volés (mitigé par les cookies httpOnly + secure)
- OAuth Google crée une dépendance vers l'API Google (rare mais possible : indisponibilité)

## Notes d'implémentation

### Flux d'authentification

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│  Client │         │  Nuxt    │         │PostgreSQL│
│(Browser)│         │ (Nitro)  │         │          │
└────┬────┘         └────┬─────┘         └────┬─────┘
     │                   │                    │
     │  POST /api/auth/login                  │
     │  {email, password} │                    │
     │──────────────────>│                    │
     │                   │  SELECT user       │
     │                   │───────────────────>│
     │                   │  user row          │
     │                   │<───────────────────│
     │                   │                    │
     │                   │  bcrypt.compare()  │
     │                   │  sign JWT          │
     │                   │                    │
     │  Set-Cookie:      │                    │
     │  access_token     │                    │
     │  refresh_token    │                    │
     │<──────────────────│                    │
     │                   │                    │
     │  GET /api/users/me│                    │
     │  Cookie: access_t │                    │
     │──────────────────>│                    │
     │                   │  verify JWT        │
     │                   │  → user payload    │
     │  {user data}      │                    │
     │<──────────────────│                    │
```

### Configuration des cookies

| Propriété  | Valeur        | Raison                              |
| ---------- | ------------- | ----------------------------------- |
| `httpOnly` | `true`        | Inaccessible depuis JavaScript (XSS)|
| `secure`   | `true` (prod) | Transmis uniquement via HTTPS       |
| `sameSite` | `lax`         | Protection CSRF partielle           |
| `path`     | `/`           | Disponible sur toutes les routes    |
| `maxAge`   | `900` (access), `2592000` (refresh) | 15 min / 30 jours |

### Hashing des mots de passe

- Algorithme : **bcrypt** via `bcryptjs`
- Coût : **12 rounds** (configurable dans `nuxt.config.ts` → `runtimeConfig.bcryptRounds`)
- Temps de hash estimé : ~250ms (suffisant pour ne pas bloquer le serveur)
