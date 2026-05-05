# ADR-0001 : NuxtJS 3 comme framework full-stack

**Date** : 2026-05-05
**Statut** : Accepté

## Contexte

CAP ALI est une plateforme communautaire développée par une équipe bénévole de 2-3 personnes. Le projet nécessite :
- Un rendu côté serveur (SSR) pour le SEO et la performance sur mobile en Afrique (connexions 3G)
- Une API REST backend pour la logique métier
- Une interface réactive et moderne côté client
- Une base de code unifiée pour minimiser la complexité opérationnelle
- Le support de l'internationalisation (i18n) dès la V1

L'équipe a une expertise existante en Vue.js.

## Décision

Nous utilisons **NuxtJS 3** avec le moteur serveur **Nitro** comme framework full-stack unique (monorepo).

## Alternatives considérées

| Alternative         | Avantages                              | Inconvénients                                      |
| ------------------- | -------------------------------------- | -------------------------------------------------- |
| **NuxtJS 3** ✅     | SSR natif, Vue 3, Nitro, écosystème riche, monorepo full-stack | Communauté plus petite que Next.js |
| **Next.js (React)** | Très large communauté, Vercel hosting  | Équipe formée en Vue, pas en React. Écosystème React plus fragmenté |
| **SvelteKit**        | Performance excellente, syntaxe simple | Écosystème encore jeune, moins de composants prêts à l'emploi |
| **Vue 3 + Express séparé** | Flexibilité totale               | Deux projets à maintenir, déploiement plus complexe, SSR manuel |

## Conséquences

### Positives
- **Un seul dépôt** : frontend et backend dans le même projet, déploiement simplifié
- **SSR natif** : les pages publiques (ressources, accueil) sont rendues côté serveur → SEO optimisé et chargement rapide en Afrique
- **Nitro** : serveur universel, déployable partout (Node.js, Docker, edge)
- **Auto-imports** : composants, composables et utils importés automatiquement → productivité accrue
- **@nuxtjs/i18n** : module officiel d'internationalisation prêt à l'emploi
- **File-based routing** : structure de fichiers = structure de routes → facile à comprendre pour les nouveaux contributeurs

### Négatives
- **Couplage** : le frontend et le backend évoluent ensemble. Un changement backend peut impacter le frontend
- **Complexité Nuxt** : les conventions et la "magie" Nuxt (auto-imports, plugins) ont une courbe d'apprentissage
- **Verrouillage** : difficile de migrer le backend vers un autre framework si besoin

### Risques
- Si l'équipe grandit avec des développeurs non-Vue, la montée en compétences sera plus longue qu'avec React/Next.js
- Les mises à jour majeures de Nuxt peuvent nécessiter des migrations coûteuses
