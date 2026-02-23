# =============================================================================
# n8n Build from Cache Image
# =============================================================================
# Purpose: Build n8n application using the pre-cached dependencies image.
#          Produces a compiled n8n application in a minimal Alpine runtime.
#
# Prerequisites:
#   Build the cache image first:
#     ./docker/images/n8n-build-cache/build-cache.sh
#
# Usage:
#   docker build -f docker/images/n8n-custom/Dockerfile \
#     --build-arg CACHE_IMAGE=n8n-build-cache:latest \
#     -t n8n-custom:latest .
# =============================================================================

# --- Stage 1: Build n8n from cache image ---
ARG CACHE_IMAGE=n8n-build-cache:latest
ARG NODE_VERSION=22

FROM ${CACHE_IMAGE} AS builder

WORKDIR /app

# Copy all source code (node_modules already present from cache)
COPY . .

# Build all packages via turbo
ENV CI=true
ENV N8N_SKIP_LICENSES=true
ENV DOCKER_BUILD=true
RUN pnpm build

# Trim frontend package.json and perform selective patch cleanup
RUN node .github/scripts/trim-fe-packageJson.js 2>/dev/null || true

# Keep only backend patches needed for production
RUN node -e " \
  const fs = require('fs'); \
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); \
  const keep = ['pdfjs-dist', 'pkce-challenge', 'bull']; \
  if (pkg.pnpm && pkg.pnpm.patchedDependencies) { \
    const filtered = {}; \
    for (const [k, v] of Object.entries(pkg.pnpm.patchedDependencies)) { \
      if (keep.some(p => k.startsWith(p))) filtered[k] = v; \
    } \
    pkg.pnpm.patchedDependencies = filtered; \
  } \
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2)); \
"

# Create pruned production deployment
RUN NODE_ENV=production DOCKER_BUILD=true \
    pnpm --filter=n8n --prod --legacy deploy --no-optional ./compiled

# --- Stage 2: Production runtime ---
FROM node:${NODE_VERSION}-alpine AS production

# Install minimal runtime dependencies
RUN apk add --no-cache \
    tini \
    tzdata \
    ca-certificates \
    openssl \
    git \
    graphicsmagick \
    libc6-compat && \
    rm -rf /tmp/* /root/.npm /root/.cache

ENV NODE_ENV=production
ENV SHELL=/bin/sh

WORKDIR /home/node

# Copy compiled n8n from builder
COPY --from=builder /app/compiled /usr/local/lib/node_modules/n8n

# Copy entrypoint script
COPY docker/images/n8n/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Rebuild native modules for target platform and set up n8n binary
RUN cd /usr/local/lib/node_modules/n8n && \
    npm rebuild sqlite3 && \
    ln -s /usr/local/lib/node_modules/n8n/bin/n8n /usr/local/bin/n8n && \
    mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node && \
    rm -rf /root/.npm /tmp/*

EXPOSE 5678/tcp
USER node

ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

# Default: start main n8n server
# Override with "worker" or "webhook" in docker-compose
CMD []

LABEL org.opencontainers.image.title="n8n-custom" \
      org.opencontainers.image.description="n8n Workflow Automation - Custom Build"
