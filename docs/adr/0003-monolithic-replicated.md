# ADR-0003 : Architecture monolithique répliquée

**Date** : 2026-05-05
**Statut** : Accepté

## Contexte

L'architecture de la plateforme doit répondre à plusieurs contraintes :
- **Équipe bénévole de 2-3 personnes** : la complexité opérationnelle doit rester minimale
- **Charge initiale modérée** : quelques centaines à quelques milliers d'utilisateurs attendus en V1
- **Objectif de disponibilité** : 99,5% mensuel (≈ 3h36 de downtime toléré/mois)
- **Budget limité** : hébergement le moins cher possible tout en restant fiable
- **Mobile-first Afrique** : la performance perçue est critique (connexions 3G)

## Décision

Nous adoptons une **architecture monolithique avec réplication horizontale** :
- Une seule application NuxtJS 3 qui embarque le frontend (SSR) et le backend (API REST)
- Réplication sur **3 instances** derrière un load balancer **Nginx**
- L'application est **stateless** : aucun état en mémoire locale, tout est dans PostgreSQL/Redis
- Les sessions et le cache sont gérés par **Redis** (partagé entre les instances)

## Alternatives considérées

| Alternative                          | Avantages                                | Inconvénients                                         |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------------------- |
| **Monolithique répliqué** ✅          | Simple, un seul déploiement, debugging facile | Scaling vertical + horizontal limité |
| **Microservices**                     | Scaling indépendant, isolation des pannes | Sur-ingénierie massive pour 2-3 devs, complexité DevOps, latence réseau inter-services |
| **Serverless (Vercel/Netlify)**       | Zéro infra, scaling automatique          | Vendor lock-in, coûts imprévisibles à l'échelle, cold starts |
| **Monolithique sans réplication**     | Le plus simple                           | Single point of failure, downtime pendant les déploiements |

## Conséquences

### Positives
- **Simplicité** : un seul dépôt, un seul build, un seul type de container à déployer
- **Haute disponibilité** : avec 3 répliques, le service reste disponible même si un nœud tombe
- **Zero-downtime deployment** : les répliques sont redémarrées une par une (rolling restart)
- **Scalabilité suffisante** : pour les besoins prévisibles (< 10 000 utilisateurs), 3 instances suffisent largement
- **Stateless** : ajouter une 4e ou 5e instance ne nécessite aucune modification de code
- **Debugging simplifié** : une seule codebase, pas de traçage distribué nécessaire

### Négatives
- **Scaling limité** : si un module spécifique (ex: forums) consomme beaucoup de ressources, on ne peut pas le scaler indépendamment
- **Blast radius** : un bug dans le code affecte potentiellement toutes les instances
- **Couplage au déploiement** : une modification du module forum nécessite un redéploiement de toute l'application

### Risques
- Si le trafic dépasse les capacités de 5 instances, il faudra envisager une séparation en services
- La réplication PostgreSQL (streaming replica) doit être mise en place pour éviter que la BDD soit un SPOF

## Diagramme de déploiement

```
                    ┌──────────────┐
                    │    Client    │
                    │  (Mobile /   │
                    │   Desktop)   │
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │    Nginx     │
                    │  SSL + LB    │
                    │  (Round-     │
                    │   Robin)     │
                    └──┬───┬───┬───┘
                       │   │   │
          ┌────────────┘   │   └────────────┐
          │                │                │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
   │  NuxtJS 3   │ │  NuxtJS 3   │ │  NuxtJS 3   │
   │  Instance 1 │ │  Instance 2 │ │  Instance 3 │
   │  (stateless)│ │  (stateless)│ │  (stateless)│
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
          │                │                │
          └────────┬───────┘────────────────┘
                   │
          ┌────────▼────────┐
          │  Shared State   │
          │                 │
          │  PostgreSQL 16  │
          │  Redis 7        │
          │  MinIO          │
          └─────────────────┘
```

## Critères de réévaluation

Cette décision devrait être réévaluée si :
- Le nombre d'utilisateurs actifs dépasse **10 000**
- Un module spécifique consomme > 50% des ressources serveur
- L'équipe technique dépasse **5 développeurs actifs**
- Le temps de build/déploiement dépasse **10 minutes**
