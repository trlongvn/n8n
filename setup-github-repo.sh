#!/bin/bash

# GitHub Repository Setup Script for n8n-nodes-multiple-upload-request
# This script helps automate the GitHub repository creation process

set -e  # Exit on error

echo "================================================"
echo "GitHub Repository Setup for n8n Custom Node"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="n8n-nodes-multiple-upload-request"
GITHUB_USER="trlongvn"
PLUGIN_DIR="$HOME/$REPO_NAME"

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

echo -e "${YELLOW}Step 2: GitHub repository setup${NC}"
echo "You have two options:"
echo "  1) Create repository manually on GitHub (recommended)"
echo "  2) Use GitHub CLI (gh)"
echo ""
read -p "Do you want to use GitHub CLI? (y/n): " use_gh_cli

if [ "$use_gh_cli" = "y" ] || [ "$use_gh_cli" = "Y" ]; then
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
        echo "Install from: https://cli.github.com/"
        exit 1
    fi
    
    echo "Creating repository with GitHub CLI..."
    cd "$PLUGIN_DIR"
    gh repo create "$REPO_NAME" \
        --public \
        --description "n8n node for uploading multiple binary files dynamically with pattern filtering" \
        --source=. \
        --remote=origin
    
    echo -e "${GREEN}✓ Repository created with GitHub CLI${NC}"
else
    echo ""
    echo "Please create the repository manually:"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: n8n node for uploading multiple binary files dynamically"
    echo "4. Set to Public"
    echo "5. Do NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    read -p "Press Enter when repository is created..."
    
    # Get the repository URL
    read -p "Enter repository URL (https or ssh): " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo -e "${RED}Error: Repository URL is required${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}Step 3: Setting up local repository${NC}"

# Check if directory exists
if [ ! -d "$PLUGIN_DIR" ]; then
    echo -e "${RED}Error: Plugin directory not found at $PLUGIN_DIR${NC}"
    echo "Please ensure the plugin code exists in this directory"
    exit 1
fi

cd "$PLUGIN_DIR"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Add remote if not using gh cli
if [ "$use_gh_cli" != "y" ] && [ "$use_gh_cli" != "Y" ]; then
    # Check if remote exists
    if git remote | grep -q "origin"; then
        echo "Remote 'origin' already exists, updating..."
        git remote set-url origin "$REPO_URL"
    else
        echo "Adding remote 'origin'..."
        git remote add origin "$REPO_URL"
    fi
fi

echo -e "${GREEN}✓ Local repository configured${NC}"
echo ""

echo -e "${YELLOW}Step 4: Committing files${NC}"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "Adding files..."
    git add .
    
    echo "Committing changes..."
    git commit -m "feat: Initial release of n8n-nodes-multiple-upload-request

- Multiple binary file upload support
- Pattern-based filtering with wildcards
- Authentication support (Bearer, Header)
- Form fields and query parameters
- POST, PUT, PATCH methods"
    
    echo -e "${GREEN}✓ Files committed${NC}"
else
    echo "No changes to commit"
fi

echo ""
echo -e "${YELLOW}Step 5: Pushing to GitHub${NC}"

read -p "Ready to push to GitHub? (y/n): " push_confirm

if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
    echo "Pushing to GitHub..."
    git push -u origin main
    echo -e "${GREEN}✓ Code pushed to GitHub${NC}"
else
    echo "Skipping push. You can push manually later with:"
    echo "  git push -u origin main"
fi

echo ""
echo -e "${YELLOW}Step 6: npm Publishing (Optional)${NC}"

read -p "Do you want to publish to npm now? (y/n): " publish_npm

if [ "$publish_npm" = "y" ] || [ "$publish_npm" = "Y" ]; then
    echo "Installing dependencies..."
    npm install
    
    echo "Building package..."
    npm run build
    
    echo "Checking npm login status..."
    if ! npm whoami &> /dev/null; then
        echo "Please login to npm:"
        npm login
    fi
    
    echo "Publishing to npm..."
    npm publish --access public
    
    echo -e "${GREEN}✓ Package published to npm${NC}"
else
    echo "Skipping npm publish. You can publish later with:"
    echo "  npm install"
    echo "  npm run build"
    echo "  npm login"
    echo "  npm publish --access public"
fi

echo ""
echo -e "${YELLOW}Step 7: Creating GitHub Release (Optional)${NC}"

read -p "Do you want to create a GitHub release? (y/n): " create_release

if [ "$create_release" = "y" ] || [ "$create_release" = "Y" ]; then
    VERSION="v0.1.0"
    
    echo "Creating git tag..."
    git tag -a "$VERSION" -m "Initial release"
    git push origin "$VERSION"
    
    if command -v gh &> /dev/null; then
        echo "Creating GitHub release..."
        gh release create "$VERSION" \
            --title "$VERSION - Initial Release" \
            --notes "Initial release with multiple binary file upload support

Features:
- Upload multiple binary files dynamically
- Pattern-based filtering (wildcards * and ?)
- Authentication support (Bearer, Custom Header)
- Additional form fields and query parameters
- POST, PUT, PATCH methods
- Error handling and validation"
        
        echo -e "${GREEN}✓ GitHub release created${NC}"
    else
        echo "GitHub CLI not available. Create release manually at:"
        echo "  https://github.com/$GITHUB_USER/$REPO_NAME/releases/new"
    fi
else
    echo "Skipping release creation. You can create it later on GitHub"
fi

echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Visit your repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "2. Add topics and description in repository settings"
echo "3. Enable Issues and Discussions if desired"
echo "4. Share your node with the n8n community!"
echo ""
echo "Package URL (once published): https://www.npmjs.com/package/$REPO_NAME"
echo ""
echo "Thank you for contributing to the n8n ecosystem! 🚀"
