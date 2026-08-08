# ── Stage 1: Build React/Vite Frontend Application ──────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies list
COPY package*.json ./

# Install npm packages
RUN npm ci --silent

# Copy source code
COPY . .

# Build production bundle
RUN npm run build

# ── Stage 2: Production Nginx Server Image ─────────────────────────
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
