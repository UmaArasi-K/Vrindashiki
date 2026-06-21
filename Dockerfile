# ================================================================
# Vrindashiki — Multi-Stage Docker Build
# Produces a single Cloud Run image running Express on port 8080.
# Express serves both the REST API (/api/*) and the React SPA.
# ================================================================

# ─────────────────────────────────────────────────────────────────
# Stage 1: Build the React/Vite Frontend
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /build/frontend

# Install deps first (cached layer if package.json unchanged)
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --ignore-scripts

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 2: Build the Node.js/Express Backend
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS backend-builder

WORKDIR /build/backend

# Install ALL deps (including devDeps for tsc)
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --ignore-scripts

# Copy source and compile TypeScript → dist/
COPY backend/ ./
RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 3: Production Image
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Set working directory for the running app
WORKDIR /app

# Install only production deps for the backend
# Copy package.json; also grab the lock file generated during the build stage
COPY backend/package.json ./
COPY --from=backend-builder /build/backend/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled backend
COPY --from=backend-builder /build/backend/dist ./dist

# Copy compiled frontend into the expected relative path
# app.ts resolves frontend/dist relative to __dirname (dist/)
COPY --from=frontend-builder /build/frontend/dist ./frontend/dist

# Cloud Run injects PORT=8080; bind to all interfaces
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Healthcheck so Cloud Run marks the revision healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "dist/server.js"]
