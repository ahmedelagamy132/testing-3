# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: install ALL dependencies (incl. native modules like better-sqlite3)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# better-sqlite3 needs a C++ build toolchain
RUN apk add --no-cache libc6-compat python3 make g++

COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: build Next.js + Payload
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Payload reads PAYLOAD_SECRET at runtime; a placeholder here keeps the build
# from crashing on import. Override with the real secret at runtime via .env.
ENV PAYLOAD_SECRET=build-placeholder-not-used-at-runtime
ENV DATABASE_URI=file:/data/payload.db

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: lean production runner
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy built app
COPY --from=builder /app/.next      ./.next
COPY --from=builder /app/public     ./public

# Copy payload source + tsconfig so `npm run payload:seed` works at runtime
# (tsconfig provides the @payload-config path alias that tsx needs)
COPY --from=builder /app/payload        ./payload
COPY --from=builder /app/payload.config.ts ./payload.config.ts
COPY --from=builder /app/tsconfig.json  ./tsconfig.json

# Copy node_modules with native bindings (better-sqlite3 .node files)
COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./

# Media upload directory — also mounted as a Docker volume
RUN mkdir -p public/media \
 && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]
