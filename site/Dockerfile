# ---- Build stage ----
FROM node:22-alpine AS build

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client + build seed DB (used as template)
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate
RUN npx prisma db push
RUN DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts

# Build Next.js
RUN pnpm build

# ---- Production stage ----
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl sqlite

WORKDIR /app

ENV NODE_ENV=production
ENV ADMIN_SECRET=
ENV DATABASE_URL=file:/data/dev.db

# Copy standalone build
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Copy seed DB as template
COPY --from=build /app/prisma/dev.db ./prisma/seed.db

# Copy Prisma client
COPY --from=build /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client ./node_modules/.prisma/client

# Migration script: sync static data from seed while preserving runtime data
COPY --chmod=755 <<'SCRIPT' /app/start.sh
#!/bin/sh
set -e

SEED_DB="/app/prisma/seed.db"
LIVE_DB="/data/dev.db"

if [ ! -f "$LIVE_DB" ]; then
  echo "First run: initializing DB from seed..."
  cp "$SEED_DB" "$LIVE_DB"
else
  echo "Existing DB found. Migrating static data while preserving runtime..."

  # 1. Backup runtime data
  sqlite3 "$LIVE_DB" ".dump PageView" > /tmp/pageview_backup.sql 2>/dev/null || true
  sqlite3 "$LIVE_DB" ".dump WaitlistEntry" > /tmp/waitlist_backup.sql 2>/dev/null || true
  sqlite3 "$LIVE_DB" ".dump Purchase" > /tmp/purchase_backup.sql 2>/dev/null || true
  sqlite3 "$LIVE_DB" "SELECT id, unlocked FROM ProductIdea;" > /tmp/unlocked_backup.csv 2>/dev/null || true

  # 2. Replace with fresh seed (all static data updated)
  cp "$SEED_DB" "$LIVE_DB"

  # 3. Ensure runtime tables exist
  sqlite3 "$LIVE_DB" "CREATE TABLE IF NOT EXISTS PageView (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, referrer TEXT, country TEXT, device TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);"
  sqlite3 "$LIVE_DB" "CREATE TABLE IF NOT EXISTS WaitlistEntry (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, source TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);"
  sqlite3 "$LIVE_DB" "CREATE TABLE IF NOT EXISTS Purchase (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, token TEXT NOT NULL, stripeSessionId TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP);"
  sqlite3 "$LIVE_DB" "CREATE UNIQUE INDEX IF NOT EXISTS Purchase_token_key ON Purchase(token);"
  sqlite3 "$LIVE_DB" "CREATE UNIQUE INDEX IF NOT EXISTS Purchase_stripeSessionId_key ON Purchase(stripeSessionId);"
  sqlite3 "$LIVE_DB" "CREATE INDEX IF NOT EXISTS idx_pageview_path ON PageView(path);"
  sqlite3 "$LIVE_DB" "CREATE INDEX IF NOT EXISTS idx_pageview_created ON PageView(createdAt);"

  # 4. Restore PageView data
  if [ -s /tmp/pageview_backup.sql ]; then
    echo "Restoring PageView data..."
    # Remove CREATE TABLE and INSERT only the data
    grep "^INSERT" /tmp/pageview_backup.sql | sqlite3 "$LIVE_DB" 2>/dev/null || true
  fi

  # 5. Restore WaitlistEntry data
  if [ -s /tmp/waitlist_backup.sql ]; then
    echo "Restoring WaitlistEntry data..."
    grep "^INSERT" /tmp/waitlist_backup.sql | sqlite3 "$LIVE_DB" 2>/dev/null || true
  fi

  # 6. Restore Purchase data
  if [ -s /tmp/purchase_backup.sql ]; then
    echo "Restoring Purchase data..."
    grep "^INSERT" /tmp/purchase_backup.sql | sqlite3 "$LIVE_DB" 2>/dev/null || true
  fi

  # 7. Restore unlocked status
  if [ -s /tmp/unlocked_backup.csv ]; then
    echo "Restoring unlocked status..."
    while IFS='|' read -r id unlocked; do
      if [ "$unlocked" = "1" ]; then
        sqlite3 "$LIVE_DB" "UPDATE ProductIdea SET unlocked = 1 WHERE id = $id;" 2>/dev/null || true
      fi
    done < /tmp/unlocked_backup.csv
  fi

  # Cleanup
  rm -f /tmp/pageview_backup.sql /tmp/waitlist_backup.sql /tmp/purchase_backup.sql /tmp/unlocked_backup.csv

  echo "Migration complete. Static data updated, runtime data preserved."
fi

exec node server.js
SCRIPT

EXPOSE 3000

CMD ["/app/start.sh"]
