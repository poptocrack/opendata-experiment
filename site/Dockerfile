# ---- Build stage ----
FROM node:22-alpine AS build

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client + build seed DB (used as template)
ENV DATABASE_URL="file:./prisma/dev.db"
RUN npx prisma generate
RUN npx prisma db push
RUN npx tsx prisma/seed.ts

# Build Next.js
RUN pnpm build

# ---- Production stage ----
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV ADMIN_SECRET=
ENV DATABASE_URL=file:/data/dev.db

# Copy standalone build
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Copy seed DB as template (will be copied to volume on first run only)
COPY --from=build /app/prisma/dev.db ./prisma/seed.db

# Entrypoint: use existing DB from volume, or init from seed
COPY --from=build /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client ./node_modules/.prisma/client

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'if [ ! -f /data/dev.db ]; then' >> /app/start.sh && \
    echo '  echo "First run: initializing DB from seed..."' >> /app/start.sh && \
    echo '  cp /app/prisma/seed.db /data/dev.db' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  echo "Existing DB found, keeping data."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
