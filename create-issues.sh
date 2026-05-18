#!/bin/bash

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "🚀 Création de toutes les issues pour $REPO..."

create_issue() {
  local title="$1"
  local labels="$2"
  local body="$3"
  local status="$4"  # "done", "progress", ou "todo"

  URL=$(gh issue create \
    --title "$title" \
    --label "$labels" \
    --body "$body" \
    --repo "$REPO")

  NUMBER=$(echo $URL | grep -o '[0-9]*$')

  if [ "$status" = "done" ]; then
    gh issue close $NUMBER --repo "$REPO"
    echo "✅ DONE      : $title"
  elif [ "$status" = "progress" ]; then
    echo "🔄 IN PROGRESS: $title"
  else
    echo "📋 TODO      : $title"
  fi
}

# ════════════════════════════════════════════
# ✅ DONE
# ════════════════════════════════════════════

create_issue \
  "[INFRA] Initialiser le monorepo NuxtJS 3 / Nitro" \
  "setup,v1" \
  "Configuration du monorepo Nuxt 3 / Vue 3 / Nitro. ✅ Terminé." \
  "done"

create_issue \
  "[INFRA] Docker Compose — PostgreSQL, Redis, MinIO" \
  "setup,v1" \
  "Conteneurs Docker configurés pour le développement local. ✅ Terminé." \
  "done"

create_issue \
  "[INFRA] Schémas Drizzle ORM complets" \
  "setup,v1" \
  "Schémas de base de données pour tous les modules : users, mentors, resources, events, forum, notifications. ✅ Terminé." \
  "done"

create_issue \
  "[INFRA] Script de seed admin" \
  "setup,v1" \
  "Script pour créer le compte administrateur initial. ✅ Terminé." \
  "done"

create_issue \
  "[AUTH] Moteur JWT + hachage bcrypt" \
  "auth,v1" \
  "Authentification par tokens JWT et hachage des mots de passe avec bcrypt. ✅ Terminé." \
  "done"

create_issue \
  "[AUTH] Page d'inscription — Wizard 3 étapes" \
  "auth,v1" \
  "Formulaire d'inscription avec séparation dynamique Étudiant / Mentor. ✅ Terminé." \
  "done"

create_issue \
  "[AUTH] Page de connexion avec redirections par rôle" \
  "auth,v1" \
  "Page /auth/login avec redirections intelligentes selon le rôle utilisateur. ✅ Terminé." \
  "done"

create_issue \
  "[AUTH] Middleware de protection des routes" \
  "auth,v1" \
  "Middleware global auth.global.ts protégeant les routes privées. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] Layout backoffice avec sidebar et header" \
  "admin,v1" \
  "Layout Admin dédié avec barre latérale et header. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] Dashboard avec KPIs globaux" \
  "admin,v1" \
  "API et interface pour les statistiques globales de la plateforme. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] Gestion des utilisateurs (liste, recherche, suspension)" \
  "admin,v1" \
  "APIs et interface pour lister, chercher et suspendre un compte. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] Validation / refus des candidatures mentors" \
  "admin,mentor,v1" \
  "APIs et interface pour valider ou refuser une candidature mentor. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] CRUD Ressources et Événements (backoffice)" \
  "admin,resource,event,v1" \
  "Formulaire CRUD complet côté Admin pour créer, modifier, dépublier. ✅ Terminé." \
  "done"

create_issue \
  "[ADMIN] Modération des posts signalés" \
  "admin,forum,v1" \
  "API pour traiter les posts signalés dans les forums. ✅ Terminé." \
  "done"

create_issue \
  "[SERVICE] Templates emails transactionnels (Resend)" \
  "setup,v1" \
  "Templates HTML/CSS pour les mails de bienvenue, candidature mentor, validation et refus. ✅ Terminé." \
  "done"

create_issue \
  "[SERVICE] Upload d'images via MinIO (S3)" \
  "setup,v1" \
  "Utilitaire MinIO et route API /api/upload/image.post.ts. ✅ Terminé." \
  "done"

# ════════════════════════════════════════════
# 🔄 IN PROGRESS
# ════════════════════════════════════════════

create_issue \
  "[MENTOR] Brancher les emails lors des actions de mentorat" \
  "mentor,v1" \
  "Les APIs de mentorat existent mais les emails ne sont pas encore envoyés.

## Tâches
- [ ] Email au mentor quand il reçoit une demande
- [ ] Email au mentoré quand sa demande est acceptée
- [ ] Email au mentoré quand sa demande est refusée
- [ ] Email aux deux parties quand une demande expire (5j)

> Le service Resend et les templates sont déjà codés dans \`mail.ts\`." \
  "progress"

create_issue \
  "[MENTOR] Peaufiner l'interface de matching mentors" \
  "mentor,v1" \
  "La page /mentors existe mais le filtrage n'est pas optimal.

## Tâches
- [ ] Filtrer par domaine d'études
- [ ] Filtrer par ville en France
- [ ] Filtrer par disponibilité (présentiel / distanciel)
- [ ] Masquer les mentors en pause ou au max de mentorés
- [ ] Message clair si aucun mentor ne correspond aux filtres" \
  "progress"

create_issue \
  "[PROFIL] Connecter l'upload d'avatar avec MinIO" \
  "auth,v1" \
  "L'utilitaire MinIO et la route \`/api/upload/image.post.ts\` existent déjà.

## Tâches
- [ ] Composant d'upload sur la page Mon compte
- [ ] Appeler la route d'upload et stocker l'URL dans users.avatar_url
- [ ] Afficher l'avatar partout (navbar, profil, fiches mentor)
- [ ] Fallback sur les initiales si pas d'avatar" \
  "progress"

create_issue \
  "[PROFIL] Finaliser la page Mon compte (préférences & mot de passe)" \
  "auth,v1" \
  "Le layout dashboard et les routes API de modification existent.

## Tâches
- [ ] Formulaire de mise à jour des infos (nom, bio, ville, domaine)
- [ ] Formulaire de changement de mot de passe
- [ ] Préférences de notification (email on/off, résumé hebdo)
- [ ] Suppression de compte avec double confirmation (RGPD)
- [ ] Export des données en JSON (RGPD)" \
  "progress"

create_issue \
  "[RESOURCE] Connecter la page publique /resources à la base de données" \
  "resource,v1" \
  "La page /resources est ébauchée mais affiche des données statiques.

## Tâches
- [ ] Appeler l'API GET /api/v1/resources
- [ ] Filtres combinables (thématique, type, niveau)
- [ ] Pagination (20 par page)
- [ ] Recherche full-text
- [ ] Afficher les images depuis les URLs MinIO
- [ ] Page de détail /resources/:id" \
  "progress"

create_issue \
  "[EVENT] Connecter la page publique /events à la base de données" \
  "event,v1.5" \
  "La page /events est ébauchée mais affiche des données statiques.

## Tâches
- [ ] Appeler l'API GET /api/v1/events
- [ ] Filtres par type (France / Bénin / En ligne)
- [ ] Affichage par mois chronologique
- [ ] Bouton Je participe fonctionnel
- [ ] État du bouton si déjà inscrit" \
  "progress"

create_issue \
  "[I18N] Remplacer les textes hardcodés par les clés i18n" \
  "setup,v1" \
  "Le package @nuxtjs/i18n est installé et fr.json est en cours.

## Tâches
- [ ] Landing page
- [ ] Header / navigation
- [ ] Footer
- [ ] Pages d'authentification
- [ ] Messages d'erreur des formulaires" \
  "progress"

# ════════════════════════════════════════════
# 📋 TODO
# ════════════════════════════════════════════

create_issue \
  "[AUTH] Flux mot de passe oublié complet" \
  "auth,v1" \
  "## Tâches
- [ ] Page /auth/forgot-password
- [ ] Route POST /api/v1/auth/forgot-password (token signé, durée 1h)
- [ ] Email de reset via Resend
- [ ] Page /auth/reset-password?token=xxx
- [ ] Invalider le token après utilisation" \
  "todo"

create_issue \
  "[AUTH] Connexion avec Google (OAuth)" \
  "auth,v1" \
  "## Tâches
- [ ] Configurer les credentials Google OAuth dans .env
- [ ] Route GET /api/v1/auth/google
- [ ] Route GET /api/v1/auth/google/callback
- [ ] Créer l'entrée dans oauth_accounts si nouveau compte
- [ ] Gérer le cas où l'email Google existe déjà en base
- [ ] Bouton Google sur les pages login et register" \
  "todo"

create_issue \
  "[SECURITY] Rate limiting sur les routes sensibles via Redis" \
  "auth,setup,v1" \
  "## Tâches
- [ ] Middleware rate-limit.ts utilisant Redis
- [ ] POST /api/v1/auth/login → max 5 tentatives/min/IP
- [ ] POST /api/v1/auth/forgot-password → max 3/heure/IP
- [ ] POST /api/v1/auth/register → max 10/heure/IP
- [ ] Réponse HTTP 429 avec header Retry-After" \
  "todo"

create_issue \
  "[NOTIF] Système de notifications in-app" \
  "notif,v1.5" \
  "## Tâches
- [ ] Cloche dans la navbar avec badge compteur
- [ ] Dropdown listant les 10 dernières notifications
- [ ] Route GET /api/v1/notifications
- [ ] Route PATCH /api/v1/notifications/:id/read
- [ ] Route PATCH /api/v1/notifications/read-all
- [ ] Polling toutes les 30s
- [ ] Notification créée automatiquement lors des actions mentorat" \
  "todo"

create_issue \
  "[FORUM] Module forum — structure et fils de discussion" \
  "forum,v1.5" \
  "## Tâches
- [ ] Page /forum : liste des thématiques
- [ ] Page /forum/:theme : liste des fils (paginés)
- [ ] Page /forum/:theme/:threadId : détail + posts
- [ ] Formulaire création d'un fil
- [ ] Formulaire de réponse avec @mention
- [ ] Routes API CRUD threads et posts
- [ ] Recherche full-text PostgreSQL" \
  "todo"

create_issue \
  "[FORUM] Modération et signalement des posts" \
  "forum,admin,v1.5" \
  "## Tâches
- [ ] Bouton Signaler sur chaque post
- [ ] Post masqué automatiquement dès signalement
- [ ] Section Posts signalés dans le backoffice
- [ ] Actions admin : valider, supprimer, avertir
- [ ] Épingler / fermer un fil" \
  "todo"

create_issue \
  "[EVENT] Rappel email automatique 48h avant les événements" \
  "event,notif,v1.5" \
  "## Tâches
- [ ] server/tasks/event-reminders.ts (Nitro scheduled task)
- [ ] Trouver les événements entre now et now+48h
- [ ] Envoyer un email de rappel à chaque inscrit via Resend
- [ ] Cron : tous les jours à 9h00
- [ ] Éviter les doublons" \
  "todo"

create_issue \
  "[DEVOPS] Dockerfile production et configuration Nginx" \
  "setup,v2" \
  "## Tâches
- [ ] Dockerfile multi-stage pour NuxtJS 3
- [ ] docker-compose.prod.yml
- [ ] Nginx : reverse proxy + SSL Let's Encrypt
- [ ] Script de déploiement deploy.sh
- [ ] Runbook de rollback" \
  "todo"

create_issue \
  "[DEVOPS] PWA — Progressive Web App" \
  "setup,v2" \
  "## Tâches
- [ ] Installer @vite-pwa/nuxt
- [ ] Service Worker (cache-first pour assets statiques)
- [ ] Manifest.json (icône, nom, couleurs CAP ALI)
- [ ] Page offline.html
- [ ] Test sur Android Chrome (3G simulée)" \
  "todo"

echo ""
echo "🎉 Toutes les issues ont été créées !"
echo ""
echo "📋 Todo      : 9 issues"
echo "🔄 In Progress: 7 issues"
echo "✅ Done       : 16 issues (fermées automatiquement)"
echo ""
echo "👉 Va dans GitHub Projects → Add item → ajoute toutes les issues au board."