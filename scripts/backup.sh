#!/bin/sh
# Daily backup of everything that cannot be rebuilt from git:
#   - site database (page content, revisions, leads) — consistent SQLite snapshot
#   - MySQL: WordPress blog + Perfex CRM
#   - uploaded media: site editor images, WordPress uploads, legacy Payload data
#   - .env (secrets) — kept root-only
#
# Output: /opt/miduva/backups/YYYY-MM-DD_HHMM/  (kept for KEEP_DAYS days)
# Run by root's crontab; see BACKUPS / SETUP-STATUS.md for restore steps.
set -eu

ROOT=/opt/miduva
KEEP_DAYS=${KEEP_DAYS:-14}
STAMP=$(date +%F_%H%M)
DEST="$ROOT/backups/$STAMP"
umask 077
mkdir -p "$DEST"
cd "$ROOT"

# shellcheck disable=SC1091
set -a; . ./.env; set +a

log() { echo "$(date '+%F %T') $*"; }
log "backup started -> $DEST"

# 1. Site SQLite database — VACUUM INTO gives a consistent copy while the app runs.
docker exec miduva-nextjs-1 node -e "
  const { createClient } = require('@libsql/client');
  createClient({ url: 'file:/data/miduva.db' })
    .execute(\"VACUUM INTO '/tmp/miduva-backup.db'\")
    .then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1) });
"
docker cp miduva-nextjs-1:/tmp/miduva-backup.db "$DEST/miduva.db"
docker exec miduva-nextjs-1 rm -f /tmp/miduva-backup.db
gzip "$DEST/miduva.db"

# 2. MySQL (WordPress + Perfex). --single-transaction = no table locks for InnoDB.
docker exec -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" miduva-mysql-1 \
  mysqldump -uroot --single-transaction --routines --triggers --databases wordpress perfex \
  | gzip > "$DEST/mysql.sql.gz"

# 3. Media volumes (changing data, backed up daily).
docker run --rm -v miduva_miduva_data:/src:ro -v "$DEST":/out alpine:3.22 \
  tar czf /out/site-media.tar.gz -C /src --exclude=./miduva.db --exclude=./miduva.db-wal --exclude=./miduva.db-shm .
# WordPress core and plugins are re-downloadable; keep only the uploads.
docker run --rm -v miduva_wp_data:/src:ro -v "$DEST":/out alpine:3.22 \
  tar czf /out/wp-uploads.tar.gz -C /src/wp-content uploads

# Legacy Payload volumes from the earlier site never change: archive them once.
mkdir -p "$ROOT/backups/legacy"
for vol in miduva_payload_db miduva_payload_media; do
  if [ ! -s "$ROOT/backups/legacy/$vol.tar.gz" ] && docker volume inspect "$vol" >/dev/null 2>&1; then
    docker run --rm -v "$vol":/src:ro -v "$ROOT/backups/legacy":/out alpine:3.22 tar czf "/out/$vol.tar.gz" -C /src .
    log "archived legacy volume $vol"
  fi
done

# 4. Secrets.
cp .env "$DEST/env"

# Sanity check: fail loudly if a core file is missing or empty.
for f in miduva.db.gz mysql.sql.gz wp-uploads.tar.gz env; do
  [ -s "$DEST/$f" ] || { log "ERROR: $f missing or empty"; exit 1; }
done

# Retention.
find "$ROOT/backups" -mindepth 1 -maxdepth 1 -type d -name "20*" -mtime +"$KEEP_DAYS" -exec rm -rf {} +

log "backup finished: $(du -sh "$DEST" | cut -f1)"
