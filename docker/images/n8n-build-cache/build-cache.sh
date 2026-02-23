#!/usr/bin/env sh
# =============================================================================
# n8n Build Cache Helper Script
# =============================================================================
# Build a Docker image with all pnpm dependencies pre-installed.
# The resulting image can be used to build n8n without internet access.
#
# Usage:
#   ./docker/images/n8n-build-cache/build-cache.sh [OPTIONS]
#
# Options:
#   --tag TAG       Image tag (default: n8n-build-cache:latest)
#   --no-cache      Build without Docker cache
#   --build         Also build n8n using the cache image (offline)
#   --help          Show this help message
# =============================================================================

set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

IMAGE_TAG="n8n-build-cache:latest"
NO_CACHE=""
DO_BUILD=false

# Parse arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --build)
            DO_BUILD=true
            shift
            ;;
        --help)
            head -16 "$0" | tail -12
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "============================================"
echo "  n8n Build Cache Image Builder"
echo "============================================"
echo ""
echo "Project root: $PROJECT_ROOT"
echo "Image tag:    $IMAGE_TAG"
echo ""

# -----------------------------------------------------------------------------
# Handle .dockerignore
# The root .dockerignore uses a whitelist (starts with *) that excludes files
# needed by the build-cache Dockerfile. We temporarily replace it.
# -----------------------------------------------------------------------------
DOCKERIGNORE="$PROJECT_ROOT/.dockerignore"
DOCKERIGNORE_BAK="$PROJECT_ROOT/.dockerignore.original.bak"
NEEDS_RESTORE=false

if [ -f "$DOCKERIGNORE" ]; then
    echo ">>> Backing up .dockerignore..."
    cp "$DOCKERIGNORE" "$DOCKERIGNORE_BAK"
    NEEDS_RESTORE=true
fi

# Create a permissive .dockerignore for the build-cache context
cat > "$DOCKERIGNORE" << 'IGNORE'
# Temporary .dockerignore for build-cache image
# Only exclude files that are never needed
.git
node_modules
dist
compiled
coverage
*.log
.env*
.vscode
.devcontainer
.github
.agent
.claude
IGNORE

# Ensure we restore .dockerignore on exit (even on error)
cleanup() {
    if [ "$NEEDS_RESTORE" = true ] && [ -f "$DOCKERIGNORE_BAK" ]; then
        mv "$DOCKERIGNORE_BAK" "$DOCKERIGNORE"
        echo ">>> Restored original .dockerignore"
    fi
}
trap cleanup EXIT

# Step 1: Build the cache image
echo ">>> Step 1: Building dependency cache image..."
docker build \
    -f "$SCRIPT_DIR/Dockerfile" \
    $NO_CACHE \
    -t "$IMAGE_TAG" \
    "$PROJECT_ROOT"

echo ""
echo "✅ Cache image built successfully: $IMAGE_TAG"
echo ""

# Step 2 (optional): Build n8n using the cache image
if [ "$DO_BUILD" = true ]; then
    BUILD_TAG="n8n-built:latest"
    echo ">>> Step 2: Building n8n using cache image (offline)..."
    docker build \
        -f "$SCRIPT_DIR/Dockerfile.build" \
        --network=none \
        --build-arg "CACHE_IMAGE=$IMAGE_TAG" \
        -t "$BUILD_TAG" \
        "$PROJECT_ROOT"

    echo ""
    echo "✅ n8n built successfully: $BUILD_TAG"
    echo "   Compiled output is at /app/compiled/ inside the image."
fi

echo ""
echo "============================================"
echo "  Next Steps"
echo "============================================"
echo ""
echo "1. To build n8n offline using this cache:"
echo "   docker build -f docker/images/n8n-build-cache/Dockerfile.build \\"
echo "     --network=none \\"
echo "     --build-arg CACHE_IMAGE=$IMAGE_TAG \\"
echo "     -t n8n-built:latest ."
echo ""
echo "2. To interactively build with mounted source:"
echo "   docker run --rm -it --network=none \\"
echo "     -v \$(pwd):/app \\"
echo "     $IMAGE_TAG sh -c 'pnpm build'"
echo ""
echo "3. To inspect installed packages:"
echo "   docker run --rm $IMAGE_TAG ls node_modules/ | head -30"
echo ""

