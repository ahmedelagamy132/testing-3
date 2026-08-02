# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: install dependencies
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: build Next.js
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

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

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

COPY package*.json ./

# SQLite and Puck media directory — mount `/data` as a volume in production.
RUN mkdir -p /data/puck-media \
 && chown -R nextjs:nodejs /app
RUN chown -R nextjs:nodejs /data

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV MIDUVA_DATABASE_URI=file:/data/miduva.db

CMD ["npm", "start"]
