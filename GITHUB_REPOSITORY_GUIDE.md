# Creating GitHub Repository for n8n-nodes-multiple-upload-request

## Complete Step-by-Step Guide

This guide will walk you through creating a GitHub repository for your n8n custom node plugin and pushing it to GitHub.

---

## Prerequisites

- GitHub account
- Git installed locally
- Plugin code ready (from `/home/runner/work/n8n/n8n-nodes-multiple-upload-request/`)

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended for beginners)

1. **Go to GitHub**
   - Visit https://github.com/new
   - Or: Click your profile picture → Your repositories → New

2. **Repository Settings**
   ```
   Repository name: n8n-nodes-multiple-upload-request
   Description: n8n node for uploading multiple binary files dynamically with pattern filtering
   Visibility: ○ Public  (recommended for npm packages)
               ○ Private (if you prefer)
   
   ☐ Add a README file (leave unchecked - we already have one)
   ☐ Add .gitignore (leave unchecked - we already have one)
   ☐ Choose a license (leave unchecked - we already have MIT)
   ```

3. **Click "Create repository"**

### Option B: Via GitHub CLI (For advanced users)

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# Create repository
gh repo create n8n-nodes-multiple-upload-request \
  --public \
  --description "n8n node for uploading multiple binary files dynamically with pattern filtering" \
  --source=. \
  --remote=origin
```

---

## Step 2: Prepare Local Repository

### If Plugin Directory Doesn't Exist Locally

If you need to recreate the plugin structure, here are the essential files:

1. **Create project directory**
   ```bash
   mkdir -p ~/n8n-nodes-multiple-upload-request
   cd ~/n8n-nodes-multiple-upload-request
   ```

2. **Initialize git**
   ```bash
   git init
   git branch -M main  # or master
   ```

3. **Create essential files** (see templates in sections below)

### If Plugin Directory Exists

```bash
cd /path/to/n8n-nodes-multiple-upload-request
git status  # Check current status
```

---

## Step 3: Connect to GitHub

### Get the Remote URL

After creating the repository on GitHub, you'll see a page with these commands:

```bash
# For HTTPS (recommended)
git remote add origin https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git

# For SSH (if you have SSH keys set up)
git remote add origin git@github.com:trlongvn/n8n-nodes-multiple-upload-request.git
```

### Verify Remote

```bash
git remote -v
# Should show:
# origin  https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git (fetch)
# origin  https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git (push)
```

---

## Step 4: Push Code to GitHub

### First Push

```bash
# Make sure all files are committed
git add .
git commit -m "feat: Initial release of n8n-nodes-multiple-upload-request"

# Push to GitHub
git push -u origin main  # or master, depending on your default branch
```

### If You Have Existing Commits

```bash
# Just push
git push -u origin main
```

### Troubleshooting Push Issues

**Error: "failed to push some refs"**
```bash
# Pull first if remote has commits
git pull origin main --rebase
git push -u origin main
```

**Error: "Permission denied"**
```bash
# Make sure you're authenticated
# For HTTPS: Use personal access token
# For SSH: Check SSH keys are set up
```

---

## Step 5: Configure Repository Settings

### On GitHub Website

1. **Go to your repository**
   - https://github.com/trlongvn/n8n-nodes-multiple-upload-request

2. **Settings → General**
   - Features: Enable Issues, Discussions (optional)
   - Enable "Automatically delete head branches" (recommended)

3. **Settings → Topics**
   - Add topics: `n8n`, `n8n-nodes`, `upload`, `multipart`, `binary-files`

4. **Settings → About** (right sidebar on main page)
   - Description: "n8n node for uploading multiple binary files dynamically"
   - Website: (your documentation URL if any)
   - Topics: Add relevant tags

---

## Step 6: Set Up npm Publishing

### Create npm Account

1. Go to https://www.npmjs.com/signup
2. Verify your email
3. Enable 2FA (recommended)

### Login via CLI

```bash
npm login
# Enter your npm credentials
```

### Publish Package

```bash
# Make sure you're in the plugin directory
cd n8n-nodes-multiple-upload-request

# Build the package
npm install
npm run build

# Test the package locally first (optional)
npm pack
# This creates a .tgz file you can test

# Publish to npm
npm publish

# If it's your first public package:
npm publish --access public
```

### Verify Publication

- Visit: https://www.npmjs.com/package/n8n-nodes-multiple-upload-request
- Check package appears correctly

---

## Step 7: Create GitHub Release

### Via GitHub Website

1. **Go to Releases**
   - https://github.com/trlongvn/n8n-nodes-multiple-upload-request/releases/new

2. **Create Tag**
   - Tag version: `v0.1.0`
   - Target: `main` (or your default branch)

3. **Release Details**
   - Release title: `v0.1.0 - Initial Release`
   - Description: Copy from CHANGELOG.md

4. **Click "Publish release"**

### Via CLI

```bash
# Create and push tag
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0

# Create release via GitHub CLI
gh release create v0.1.0 \
  --title "v0.1.0 - Initial Release" \
  --notes "Initial release with multiple binary file upload support"
```

---

## Step 8: Set Up CI/CD (Optional but Recommended)

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Lint
      run: npm run lint
      
    - name: Build
      run: npm run build
```

### Auto-publish Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        registry-url: 'https://registry.npmjs.org'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Publish to npm
      run: npm publish --access public
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Set up NPM_TOKEN secret:**
1. GitHub → Repository → Settings → Secrets and variables → Actions
2. New repository secret → Name: `NPM_TOKEN` → Value: (your npm token)

---

## Step 9: Documentation

### Update README.md

Ensure README includes:
- Installation instructions
- Usage examples
- Configuration guide
- Link to npm package
- Link to GitHub repository

### Add Badges (Optional)

Add to top of README.md:

```markdown
[![npm version](https://badge.fury.io/js/n8n-nodes-multiple-upload-request.svg)](https://www.npmjs.com/package/n8n-nodes-multiple-upload-request)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/trlongvn/n8n-nodes-multiple-upload-request)](https://github.com/trlongvn/n8n-nodes-multiple-upload-request/stargazers)
```

---

## Step 10: Register with n8n

### Submit to n8n Community Nodes

1. **Fork n8n-docs repository**
   - https://github.com/n8n-io/n8n-docs

2. **Add your node**
   - Edit `docs/integrations/community-nodes/nodes.md`
   - Add your package information

3. **Create Pull Request**
   - Follow their contribution guidelines

### Announce in n8n Community

1. **Visit n8n Community Forum**
   - https://community.n8n.io/

2. **Create Post**
   - Category: Show and tell
   - Title: "New Community Node: Multiple Upload Request"
   - Include: Features, installation, usage examples

---

## Complete Command Sequence

Here's the complete sequence if starting fresh:

```bash
# 1. Navigate to plugin directory (or create it)
cd ~/n8n-nodes-multiple-upload-request

# 2. Verify files exist
ls -la

# 3. Initialize git if needed
git init
git branch -M main

# 4. Commit all files
git add .
git commit -m "feat: Initial release of n8n-nodes-multiple-upload-request"

# 5. Add GitHub remote (replace URL with your actual repo URL)
git remote add origin https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git

# 6. Push to GitHub
git push -u origin main

# 7. Build and publish to npm
npm install
npm run build
npm login
npm publish --access public

# 8. Create release
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

---

## Verification Checklist

After completing all steps, verify:

- [ ] GitHub repository exists and is public
- [ ] All code is pushed to GitHub
- [ ] README displays correctly on GitHub
- [ ] Package is published on npm
- [ ] Package can be installed: `npm install n8n-nodes-multiple-upload-request`
- [ ] Release v0.1.0 is created on GitHub
- [ ] Repository has proper description and topics
- [ ] CI/CD workflows are set up (optional)
- [ ] License file is present
- [ ] Community announcement posted (optional)

---

## Troubleshooting

### "Repository already exists"
- Choose different name or delete existing repository

### "Authentication failed"
- HTTPS: Use personal access token instead of password
- SSH: Set up SSH keys properly

### "npm publish failed - package name taken"
- Choose different package name
- Check if you have permissions (for existing packages)

### "Build failed"
- Check TypeScript errors: `npm run build`
- Check dependencies: `npm install`

---

## Quick Reference: Important URLs

- **GitHub Repository**: https://github.com/trlongvn/n8n-nodes-multiple-upload-request
- **npm Package**: https://www.npmjs.com/package/n8n-nodes-multiple-upload-request
- **n8n Documentation**: https://docs.n8n.io/integrations/community-nodes/
- **n8n Community**: https://community.n8n.io/

---

## Next Steps After Repository Creation

1. **Add contributors** (if working in a team)
2. **Set up issue templates**
3. **Create contribution guidelines** (CONTRIBUTING.md)
4. **Add security policy** (SECURITY.md)
5. **Set up project board** (for tracking features/bugs)
6. **Enable GitHub Discussions** (for Q&A)
7. **Create wiki** (for extended documentation)

---

## Support

If you encounter issues:
1. Check GitHub documentation: https://docs.github.com/
2. Check npm documentation: https://docs.npmjs.com/
3. Ask in n8n Community: https://community.n8n.io/

---

**Good luck with your n8n custom node! 🚀**
