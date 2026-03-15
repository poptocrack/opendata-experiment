# ---- Build stage ----
FROM node:22-alpine AS build

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build the DB and seed
RUN npx prisma generate
RUN npx prisma db push
RUN DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/seed.ts

# Build Next.js
RUN pnpm build

# ---- Production stage ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Copy SQLite DB
COPY --from=build /app/prisma/dev.db ./prisma/dev.db

EXPOSE 3000

CMD ["node", "server.js"]
