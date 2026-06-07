# syntax=docker/dockerfile:1

# ---- Builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install only production dependencies first (for caching)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only needed files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install production deps (already installed in builder, but repeat for safety)
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
