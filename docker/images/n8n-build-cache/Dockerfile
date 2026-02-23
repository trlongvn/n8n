# =============================================================================
# n8n Build Cache Image
# =============================================================================
# Purpose: Pre-install all pnpm dependencies so subsequent builds can run
#          offline without internet access.
#
# IMPORTANT: The root .dockerignore uses a whitelist approach (starts with *)
# which blocks the files needed by this Dockerfile. You MUST use the
# build-cache.sh script or specify a custom .dockerignore:
#
#   docker build \
#     -f docker/images/n8n-build-cache/Dockerfile \
#     -t n8n-build-cache:latest \
#     --build-context app-src=. \
#     .
#
# Recommended: use the helper script which handles this automatically:
#   ./docker/images/n8n-build-cache/build-cache.sh
# =============================================================================

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS build-cache

# Install system dependencies required for native modules (sqlite3, etc.)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    openssh

# Install pnpm (match packageManager version from package.json)
ARG PNPM_VERSION=10.22.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# --- Stage 1: Copy only dependency-definition files ---
# These files change less frequently than source code, so Docker can cache
# the pnpm install layer effectively.

# Root config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Patches (referenced by pnpm.patchedDependencies in package.json)
COPY patches/ patches/

# --- Workspace package.json files ---
# We only need the package.json from each workspace package (not the source code)
# to allow pnpm to resolve the dependency graph.

# packages/* (top-level)
COPY packages/cli/package.json packages/cli/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/node-dev/package.json packages/node-dev/package.json
COPY packages/nodes-base/package.json packages/nodes-base/package.json
COPY packages/workflow/package.json packages/workflow/package.json

# packages/@n8n/*
COPY packages/@n8n/ai-utilities/package.json packages/@n8n/ai-utilities/package.json
COPY packages/@n8n/ai-workflow-builder.ee/package.json packages/@n8n/ai-workflow-builder.ee/package.json
COPY packages/@n8n/api-types/package.json packages/@n8n/api-types/package.json
COPY packages/@n8n/backend-common/package.json packages/@n8n/backend-common/package.json
COPY packages/@n8n/backend-test-utils/package.json packages/@n8n/backend-test-utils/package.json
COPY packages/@n8n/benchmark/package.json packages/@n8n/benchmark/package.json
COPY packages/@n8n/chat-hub/package.json packages/@n8n/chat-hub/package.json
COPY packages/@n8n/client-oauth2/package.json packages/@n8n/client-oauth2/package.json
COPY packages/@n8n/codemirror-lang/package.json packages/@n8n/codemirror-lang/package.json
COPY packages/@n8n/codemirror-lang-html/package.json packages/@n8n/codemirror-lang-html/package.json
COPY packages/@n8n/codemirror-lang-sql/package.json packages/@n8n/codemirror-lang-sql/package.json
COPY packages/@n8n/config/package.json packages/@n8n/config/package.json
COPY packages/@n8n/constants/package.json packages/@n8n/constants/package.json
COPY packages/@n8n/crdt/package.json packages/@n8n/crdt/package.json
COPY packages/@n8n/create-node/package.json packages/@n8n/create-node/package.json
COPY packages/@n8n/db/package.json packages/@n8n/db/package.json
COPY packages/@n8n/decorators/package.json packages/@n8n/decorators/package.json
COPY packages/@n8n/di/package.json packages/@n8n/di/package.json
COPY packages/@n8n/errors/package.json packages/@n8n/errors/package.json
COPY packages/@n8n/eslint-config/package.json packages/@n8n/eslint-config/package.json
COPY packages/@n8n/eslint-plugin-community-nodes/package.json packages/@n8n/eslint-plugin-community-nodes/package.json
COPY packages/@n8n/extension-sdk/package.json packages/@n8n/extension-sdk/package.json
COPY packages/@n8n/imap/package.json packages/@n8n/imap/package.json
COPY packages/@n8n/json-schema-to-zod/package.json packages/@n8n/json-schema-to-zod/package.json
COPY packages/@n8n/node-cli/package.json packages/@n8n/node-cli/package.json
COPY packages/@n8n/nodes-langchain/package.json packages/@n8n/nodes-langchain/package.json
COPY packages/@n8n/permissions/package.json packages/@n8n/permissions/package.json
COPY packages/@n8n/scan-community-package/package.json packages/@n8n/scan-community-package/package.json
COPY packages/@n8n/stylelint-config/package.json packages/@n8n/stylelint-config/package.json
COPY packages/@n8n/syslog-client/package.json packages/@n8n/syslog-client/package.json
COPY packages/@n8n/task-runner/package.json packages/@n8n/task-runner/package.json
COPY packages/@n8n/typescript-config/package.json packages/@n8n/typescript-config/package.json
COPY packages/@n8n/utils/package.json packages/@n8n/utils/package.json
COPY packages/@n8n/vitest-config/package.json packages/@n8n/vitest-config/package.json
COPY packages/@n8n/workflow-sdk/package.json packages/@n8n/workflow-sdk/package.json

# packages/frontend/**
COPY packages/frontend/editor-ui/package.json packages/frontend/editor-ui/package.json
COPY packages/frontend/@n8n/chat/package.json packages/frontend/@n8n/chat/package.json
COPY packages/frontend/@n8n/composables/package.json packages/frontend/@n8n/composables/package.json
COPY packages/frontend/@n8n/design-system/package.json packages/frontend/@n8n/design-system/package.json
COPY packages/frontend/@n8n/i18n/package.json packages/frontend/@n8n/i18n/package.json
COPY packages/frontend/@n8n/rest-api-client/package.json packages/frontend/@n8n/rest-api-client/package.json
COPY packages/frontend/@n8n/stores/package.json packages/frontend/@n8n/stores/package.json
COPY packages/frontend/@n8n/storybook/package.json packages/frontend/@n8n/storybook/package.json

# packages/extensions/**
COPY packages/extensions/insights/package.json packages/extensions/insights/package.json

# packages/testing/**
COPY packages/testing/containers/package.json packages/testing/containers/package.json
COPY packages/testing/janitor/package.json packages/testing/janitor/package.json
COPY packages/testing/performance/package.json packages/testing/performance/package.json
COPY packages/testing/playwright/package.json packages/testing/playwright/package.json

# Copy scripts needed by package.json lifecycle hooks (preinstall, prepare)
COPY scripts/block-npm-install.js scripts/block-npm-install.js
COPY scripts/prepare.mjs scripts/prepare.mjs

# --- Stage 2: Install all dependencies ---
ENV DOCKER_BUILD=true
RUN pnpm install --frozen-lockfile

# Copy turbo.json and tsconfig for build support
COPY turbo.json tsconfig.json ./

# --- Final image ready ---
# At this point, the image contains:
#   /app/node_modules/       - all hoisted dependencies
#   /app/packages/*/node_modules/ - workspace-specific deps
#   /app/pnpm-lock.yaml      - lockfile for reproducibility
#
# To build n8n, copy your source code into /app/ and run:
#   pnpm build
