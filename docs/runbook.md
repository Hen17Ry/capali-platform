# 🏥 Runbook Infrastructure — CAP ALI

Guide opérationnel pour le déploiement, la maintenance et le dépannage de la plateforme CAP ALI.

---

## 📋 Table des matières

- [Architecture d'ensemble](#-architecture-densemble)
- [Environnements](#-environnements)
- [Déploiement](#-déploiement)
- [Opérations courantes](#-opérations-courantes)
- [Monitoring et alertes](#-monitoring-et-alertes)
- [Incidents et dépannage](#-incidents-et-dépannage)
- [Sauvegarde et restauration](#-sauvegarde-et-restauration)
- [Rollback](#-rollback)
- [Sécurité](#-sécurité)
- [Contacts](#-contacts)

---

## 🏗️ Architecture d'ensemble

```
                        ┌──────────────┐
                        │   Internet   │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │    Nginx     │
                        │  (SSL/LB)    │
                        └──┬───┬───┬───┘
                           │   │   │
               ┌───────────┘   │   └───────────┐
               │               │               │
        ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
        │   Nuxt App  │ │   Nuxt App  │ │   Nuxt App  │
        │  Réplique 1 │ │  Réplique 2 │ │  Réplique 3 │
        └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
               │               │               │
        ┌──────▼───────────────▼───────────────▼──────┐
        │                Services partagés             │
        │                                              │
        │  ┌──────────┐  ┌─────────┐  ┌────────────┐  │
        │  │PostgreSQL │  │  Redis  │  │   MinIO    │  │
        │  │  Primary  │  │  Cache  │  │  Storage   │  │
        │  │ +Replica  │  │         │  │            │  │
        │  └──────────┘  └─────────┘  └────────────┘  │
        └──────────────────────────────────────────────┘
```

### Composants

| Composant        | Rôle                               | Port(s) |
| ---------------- | ---------------------------------- | ------- |
| **Nginx**        | Terminaison SSL, load balancing    | 80, 443 |
| **Nuxt App**     | SSR, API REST, logique métier      | 3000    |
| **PostgreSQL**   | Base de données principale         | 5432    |
| **Redis**        | Cache, sessions, rate limiting     | 6379    |
| **MinIO**        | Stockage d'objets (avatars, images)| 9000    |
| **Uptime Kuma**  | Monitoring endpoints               | 3001    |
| **Sentry**       | Monitoring erreurs applicatives    | —       |

---

## 🌍 Environnements

| Environnement | Branche  | URL                           | Déploiement          |
| ------------- | -------- | ----------------------------- | -------------------- |
| **Local**     | feature  | http://localhost:3000          | Manuel               |
| **Staging**   | develop  | https://staging.capali.org    | Auto (merge develop) |
| **Production**| main     | https://capali.org            | Manuel (tag release) |

### Variables d'environnement par environnement

```bash
# Variables obligatoires (toutes les instances)
DATABASE_URL=postgresql://user:password@host:5432/capali_db
REDIS_URL=redis://host:6379
JWT_SECRET=<secret-unique-par-environnement>
APP_URL=https://capali.org

# Email (Resend)
RESEND_API_KEY=re_xxx

# Stockage (MinIO)
MINIO_ENDPOINT=https://storage.capali.org
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
MINIO_BUCKET=capali

# OAuth Google
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Production uniquement
NODE_ENV=production
SENTRY_DSN=https://xxx@sentry.io/xxx
```

> ⚠️ **Ne jamais committer de secrets dans le dépôt.** Utiliser les GitHub Secrets pour la CI/CD et les variables d'environnement sur le serveur.

---

## 🚀 Déploiement

### Déploiement en production (procédure standard)

```bash
# 1. S'assurer que develop est stable et testé sur staging
git checkout main
git pull origin main

# 2. Merger develop dans main
git merge develop

# 3. Créer un tag de release (semantic versioning)
git tag -a v1.0.0 -m "Release v1.0.0 — MVP Auth & Mentorat"
git push origin main --tags

# 4. La CI/CD déclenche le build et le déploiement
# Vérifier le pipeline sur GitHub Actions
```

### Déploiement manuel (si CI/CD indisponible)

```bash
# Sur le serveur de production
ssh deploy@capali-prod

# 1. Pull la dernière version
cd /opt/capali
git pull origin main

# 2. Installer les dépendances
npm ci --production

# 3. Appliquer les migrations
npm run db:migrate

# 4. Build de production
npm run build

# 5. Redémarrer l'application (zero-downtime avec PM2/systemd)
# Option A : PM2
pm2 reload capali --update-env

# Option B : systemd
sudo systemctl restart capali@{1..3}

# 6. Vérifier le déploiement
curl -s https://capali.org/api/health | jq .
```

### Vérification post-déploiement

```bash
# Checklist post-déploiement
# [ ] L'application répond sur https://capali.org
# [ ] L'API /api/health renvoie status: ok
# [ ] Les migrations sont appliquées
# [ ] Pas d'erreur dans les logs (dernières 5 minutes)
# [ ] Uptime Kuma confirme le statut UP
# [ ] Sentry ne montre pas de nouvelles erreurs
```

---

## 🔄 Opérations courantes

### Consulter les logs

```bash
# Logs de l'application Nuxt (PM2)
pm2 logs capali --lines 100

# Logs systemd
journalctl -u capali@1 -f --since "5 minutes ago"

# Logs PostgreSQL
docker logs capali_postgres --tail 100 -f

# Logs Redis
docker logs capali_redis --tail 50

# Logs Nginx
tail -f /var/log/nginx/capali_access.log
tail -f /var/log/nginx/capali_error.log
```

### Gestion de la base de données

```bash
# Connexion à PostgreSQL
docker exec -it capali_postgres psql -U capali -d capali_db

# Vérifier l'état des migrations
npm run db:studio

# Compter les utilisateurs
docker exec capali_postgres psql -U capali -d capali_db -c "SELECT COUNT(*) FROM users;"

# Vérifier les connexions actives
docker exec capali_postgres psql -U capali -d capali_db -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

### Gestion du cache Redis

```bash
# Connexion à Redis
docker exec -it capali_redis redis-cli

# Vérifier l'utilisation mémoire
docker exec capali_redis redis-cli INFO memory | grep used_memory_human

# Vider le cache (ATTENTION : perte de toutes les sessions)
docker exec capali_redis redis-cli FLUSHDB

# Vider une clé spécifique
docker exec capali_redis redis-cli DEL "cache:resources:list"
```

### Gestion MinIO

```bash
# Vérifier le statut
curl -f http://localhost:9000/minio/health/live

# Lister les buckets via mc (MinIO Client)
mc alias set capali http://localhost:9000 capali_minio capali_minio_password
mc ls capali/
mc ls capali/capali/avatars/
```

---

## 📊 Monitoring et alertes

### Uptime Kuma

**URL Console** : http://monitoring.capali.org:3001

Endpoints surveillés (intervalle : 60 secondes) :

| Endpoint                      | Type  | Seuil alerte |
| ----------------------------- | ----- | ------------ |
| `https://capali.org`          | HTTPS | > 5s         |
| `https://capali.org/api/health`| HTTPS | > 3s        |
| PostgreSQL `5432`             | TCP   | Indisponible |
| Redis `6379`                  | TCP   | Indisponible |
| MinIO `9000`                  | HTTP  | > 5s         |

**Canaux d'alerte** : Email + Telegram

### Sentry

**Dashboard** : https://sentry.io/organizations/capali/

Configuration :
- Alertes email si > 10 erreurs identiques en 1 heure
- Alertes Telegram si erreur critique (5xx) en production
- Rétention des événements : 90 jours

### Métriques clés à surveiller

| Métrique                     | Seuil normal | Action si dépassé           |
| ---------------------------- | ------------ | --------------------------- |
| CPU serveur                  | < 70%        | Ajouter une réplique        |
| RAM serveur                  | < 80%        | Analyser les fuites mémoire |
| Espace disque                | < 85%        | Nettoyer les anciens logs   |
| Connexions PostgreSQL actives| < 80 / 100   | Augmenter pool_size         |
| Mémoire Redis                | < 256 Mo     | Revoir la politique d'expiration |
| Temps de réponse API (p95)   | < 300ms      | Optimiser les requêtes/cache|
| Taux d'erreur 5xx            | < 0.1%       | Investiguer immédiatement   |

---

## 🚨 Incidents et dépannage

### L'application ne répond pas (502/503)

```bash
# 1. Vérifier que les process Nuxt tournent
pm2 status
# ou
systemctl status capali@{1..3}

# 2. Vérifier les logs pour des erreurs
pm2 logs capali --lines 50 --err

# 3. Vérifier que Nginx est actif
systemctl status nginx
nginx -t  # Tester la configuration

# 4. Redémarrer si nécessaire
pm2 restart capali
sudo systemctl restart nginx
```

### PostgreSQL ne répond plus

```bash
# 1. Vérifier le statut du container
docker ps -a | grep postgres
docker logs capali_postgres --tail 50

# 2. Vérifier l'espace disque
df -h /var/lib/docker/volumes/

# 3. Vérifier les connexions
docker exec capali_postgres psql -U capali -d capali_db -c \
  "SELECT state, count(*) FROM pg_stat_activity GROUP BY state;"

# 4. Tuer les requêtes bloquées (> 5 minutes)
docker exec capali_postgres psql -U capali -d capali_db -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';"

# 5. Redémarrer le container
docker restart capali_postgres
```

### Redis saturé

```bash
# 1. Vérifier la mémoire
docker exec capali_redis redis-cli INFO memory

# 2. Identifier les grosses clés
docker exec capali_redis redis-cli --bigkeys

# 3. Vider les clés de cache (garder les sessions)
docker exec capali_redis redis-cli --scan --pattern "cache:*" | \
  xargs -L 1 docker exec -i capali_redis redis-cli DEL

# 4. Si critique, redémarrer (ATTENTION : perte des sessions)
docker restart capali_redis
```

### Erreur de migration

```bash
# 1. Vérifier l'état actuel des migrations
docker exec capali_postgres psql -U capali -d capali_db -c \
  "SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 5;"

# 2. Si une migration a échoué, corriger le schéma puis réessayer
npm run db:migrate

# 3. En dernier recours, rollback manuel (voir section Rollback)
```

### Espace disque plein

```bash
# 1. Vérifier l'espace
df -h

# 2. Nettoyer les anciens logs
find /var/log -name "*.log" -mtime +30 -delete
journalctl --vacuum-time=7d

# 3. Nettoyer les images Docker inutilisées
docker system prune -af

# 4. Vérifier la taille des volumes Docker
docker system df -v
```

---

## 💾 Sauvegarde et restauration

### Sauvegarde automatique (cron)

```bash
# Ajouter au crontab du serveur : crontab -e
# Backup PostgreSQL quotidien à 3h00 — rétention 30 jours
0 3 * * * /opt/capali/scripts/backup-db.sh >> /var/log/capali/backup.log 2>&1
```

### Script de sauvegarde PostgreSQL

```bash
#!/bin/bash
# /opt/capali/scripts/backup-db.sh

BACKUP_DIR="/opt/capali/backups/postgres"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="capali_db_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Dump compressé
docker exec capali_postgres pg_dump -U capali -d capali_db | gzip > "${BACKUP_DIR}/${FILENAME}"

# Vérifier que le backup n'est pas vide
if [ ! -s "${BACKUP_DIR}/${FILENAME}" ]; then
    echo "[ERREUR] Backup vide : ${FILENAME}"
    # Envoyer une alerte (Telegram, email, etc.)
    exit 1
fi

echo "[OK] Backup créé : ${FILENAME} ($(du -h "${BACKUP_DIR}/${FILENAME}" | cut -f1))"

# Supprimer les backups de plus de N jours
find "${BACKUP_DIR}" -name "capali_db_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "[OK] Anciens backups nettoyés (rétention : ${RETENTION_DAYS} jours)"
```

### Restauration

```bash
# 1. Stopper l'application
pm2 stop capali

# 2. Restaurer depuis un backup
gunzip -c /opt/capali/backups/postgres/capali_db_20260505_030000.sql.gz | \
  docker exec -i capali_postgres psql -U capali -d capali_db

# 3. Redémarrer l'application
pm2 restart capali

# 4. Vérifier l'intégrité
curl -s https://capali.org/api/health | jq .
```

### Sauvegarde MinIO

```bash
# Sync vers un répertoire de backup
mc mirror capali/capali /opt/capali/backups/minio/
```

---

## ⏪ Rollback

### Rollback applicatif (code)

```bash
# 1. Identifier le tag de la version précédente
git tag -l --sort=-creatordate | head -5

# 2. Checkout la version précédente
git checkout v0.9.0

# 3. Réinstaller et rebuild
npm ci --production
npm run build

# 4. Redémarrer
pm2 reload capali --update-env
```

### Rollback de migration (base de données)

> ⚠️ **Drizzle ne supporte pas le rollback automatique.** Les rollbacks doivent être manuels.

```bash
# 1. Identifier la dernière migration appliquée
docker exec capali_postgres psql -U capali -d capali_db -c \
  "SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1;"

# 2. Écrire manuellement le SQL de rollback
# (Exemple : annuler l'ajout d'une colonne)
docker exec capali_postgres psql -U capali -d capali_db -c \
  "ALTER TABLE users DROP COLUMN IF EXISTS new_column;"

# 3. Supprimer l'entrée de migration dans la table de suivi
docker exec capali_postgres psql -U capali -d capali_db -c \
  "DELETE FROM drizzle.__drizzle_migrations WHERE hash = 'xxx';"
```

---

## 🔐 Sécurité

### Certificats SSL (Let's Encrypt)

```bash
# Renouveler manuellement (normalement automatique via cron Certbot)
sudo certbot renew --nginx

# Vérifier l'expiration
sudo certbot certificates
```

### Rotation des secrets

| Secret              | Fréquence     | Procédure                               |
| ------------------- | ------------- | --------------------------------------- |
| `JWT_SECRET`        | Tous les 6 mois | Changer la variable, redémarrer l'app (invalide toutes les sessions) |
| `MINIO_SECRET_KEY`  | Tous les 6 mois | Changer dans MinIO + variable env       |
| `RESEND_API_KEY`    | Si compromis   | Regénérer dans le dashboard Resend      |
| `DATABASE_URL`      | Si compromis   | Changer le mot de passe PostgreSQL + var env |

### Logs d'accès

- **Rétention** : 90 jours maximum (conformité RGPD)
- **Stockage** : `/var/log/nginx/` + journalctl
- **Nettoyage** : `logrotate` configuré pour rotation hebdomadaire

---

## 📞 Contacts

| Rôle                   | Contact                         | Quand contacter                    |
| ---------------------- | ------------------------------- | ---------------------------------- |
| Lead technique         | À définir                       | Incidents critiques, architecture  |
| Fondatrices CAP ALI    | À définir                       | Décisions produit, communication   |
| Hébergeur              | À définir                       | Problèmes serveur, réseau          |

---

> **Dernière mise à jour** : Mai 2026
>
> **Prochaine revue planifiée** : À chaque release majeure
