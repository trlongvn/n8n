# GitHub Repository Creation - Troubleshooting Guide

## Common Issues and Solutions

This guide addresses common problems you might encounter when creating a GitHub repository and publishing your n8n plugin.

---

## Issue 1: "Authentication Failed" When Pushing to GitHub

### Symptoms
```
remote: Support for password authentication was removed
fatal: Authentication failed
```

### Solutions

#### Solution A: Use Personal Access Token (Recommended)

1. **Generate Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`
   - Copy the token (you won't see it again!)

2. **Use Token Instead of Password**
   ```bash
   # When git asks for password, paste your token
   Username: trlongvn
   Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Cache Credentials**
   ```bash
   # Cache for 1 hour
   git config --global credential.helper 'cache --timeout=3600'
   
   # Or store permanently (less secure)
   git config --global credential.helper store
   ```

#### Solution B: Use SSH Keys

1. **Generate SSH Key**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept defaults
   ```

2. **Add to GitHub**
   ```bash
   # Copy public key
   cat ~/.ssh/id_ed25519.pub
   
   # Go to: https://github.com/settings/keys
   # Click "New SSH key"
   # Paste the key
   ```

3. **Use SSH URL**
   ```bash
   git remote set-url origin git@github.com:trlongvn/n8n-nodes-multiple-upload-request.git
   ```

---

## Issue 2: "Repository Already Exists"

### Symptoms
```
error: remote repository already exists
```

### Solutions

#### If You Own the Repository
```bash
# Option 1: Delete and recreate
# Go to: https://github.com/trlongvn/n8n-nodes-multiple-upload-request/settings
# Scroll down → "Delete this repository"

# Option 2: Use existing repository
git remote set-url origin https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git
git push -u origin main
```

#### If Repository Name is Taken
```bash
# Choose different name
# Update package.json "name" field
# Create repository with new name
```

---

## Issue 3: "npm Publish Failed - Package Name Taken"

### Symptoms
```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/n8n-nodes-multiple-upload-request
npm ERR! You do not have permission to publish "n8n-nodes-multiple-upload-request"
```

### Solutions

#### Solution A: Use Scoped Package
```bash
# Update package.json
{
  "name": "@yourusername/n8n-nodes-multiple-upload-request",
  ...
}

# Publish with scope
npm publish --access public
```

#### Solution B: Choose Different Name
```bash
# Update package.json
{
  "name": "n8n-nodes-multi-file-upload",
  ...
}

# Verify availability
npm search n8n-nodes-multi-file-upload
```

---

## Issue 4: "Build Failed" - TypeScript Errors

### Symptoms
```
error TS2307: Cannot find module 'n8n-workflow'
error TS2304: Cannot find name 'INodeType'
```

### Solutions

#### Solution 1: Install Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Solution 2: Check TypeScript Configuration
```bash
# Verify tsconfig.json exists
cat tsconfig.json

# Should have these settings:
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2019",
    "outDir": "./dist",
    ...
  }
}
```

#### Solution 3: Check Peer Dependencies
```bash
# package.json should have:
{
  "peerDependencies": {
    "n8n-workflow": "*"
  }
}
```

---

## Issue 5: "Cannot Find Module" When Installing

### Symptoms
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/n8n-nodes-multiple-upload-request
```

### Solutions

#### If Just Published
```bash
# Wait 1-2 minutes for npm to propagate
# Then try again:
npm install n8n-nodes-multiple-upload-request
```

#### If Package Not Published
```bash
# Check if you're logged in
npm whoami

# Publish the package
npm publish --access public
```

#### Verify Publication
```bash
# Check on npm website
# https://www.npmjs.com/package/n8n-nodes-multiple-upload-request
```

---

## Issue 6: "Permission Denied" on npm Publish

### Symptoms
```
npm ERR! code E403
npm ERR! 403 403 Forbidden
```

### Solutions

#### Solution 1: Login to npm
```bash
npm logout
npm login
# Enter credentials
npm whoami  # Verify
```

#### Solution 2: Check Package Name
```bash
# Name might be taken or you don't have permission
# Try scoped package:
npm init --scope=@yourusername
```

#### Solution 3: Enable 2FA (If Required)
```bash
# Some packages require 2FA
# Enable at: https://www.npmjs.com/settings/yourusername/tfa
```

---

## Issue 7: "Git Push Rejected - Non-Fast-Forward"

### Symptoms
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
```

### Solutions

#### If Remote Has Commits You Don't Have
```bash
# Pull and rebase
git pull origin main --rebase
git push origin main
```

#### If Starting Fresh
```bash
# Force push (CAREFUL - overwrites remote)
git push -f origin main
```

---

## Issue 8: "Module Not Found in n8n"

### Symptoms
```
Node type "multipleUploadRequest" not found
```

### Solutions

#### Solution 1: Restart n8n
```bash
# Stop n8n
# Wait for it to fully stop
# Start n8n again
n8n start
```

#### Solution 2: Clear n8n Cache
```bash
rm -rf ~/.n8n/cache
n8n start
```

#### Solution 3: Reinstall Package
```bash
cd ~/.n8n/
npm uninstall n8n-nodes-multiple-upload-request
npm install n8n-nodes-multiple-upload-request
```

#### Solution 4: Check Installation Location
```bash
# Global installation
npm install -g n8n-nodes-multiple-upload-request

# Or in n8n directory
cd ~/.n8n/custom
npm install n8n-nodes-multiple-upload-request
```

---

## Issue 9: ".gitignore Not Working"

### Symptoms
```
node_modules/ still being tracked
dist/ files showing in git status
```

### Solutions

#### Solution 1: Remove from Git Cache
```bash
git rm -r --cached node_modules/
git rm -r --cached dist/
git add .gitignore
git commit -m "fix: update gitignore"
```

#### Solution 2: Create Proper .gitignore
```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
*.tsbuildinfo
.DS_Store
.env
npm-debug.log*
EOF
```

---

## Issue 10: "Release Already Exists"

### Symptoms
```
tag v0.1.0 already exists
```

### Solutions

#### Solution 1: Use Different Version
```bash
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin v0.1.1
```

#### Solution 2: Delete and Recreate
```bash
# Delete local tag
git tag -d v0.1.0

# Delete remote tag
git push origin --delete v0.1.0

# Create new tag
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

---

## Issue 11: "npm Version Mismatch"

### Symptoms
```
npm ERR! Required: {"node":">=14","npm":">=6"}
npm ERR! Actual:   {"node":"v12.x","npm":"5.x"}
```

### Solutions

#### Update Node.js
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from: https://nodejs.org/
```

#### Update npm
```bash
npm install -g npm@latest
```

---

## Issue 12: "GitHub CLI Not Found"

### Symptoms
```
gh: command not found
```

### Solutions

#### Install GitHub CLI

**macOS:**
```bash
brew install gh
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**Windows:**
```bash
# Using Chocolatey
choco install gh

# Or using Scoop
scoop install gh
```

#### Login
```bash
gh auth login
# Follow prompts
```

---

## Issue 13: "Build Works but Package Fails"

### Symptoms
```
npm run build  # Works ✅
npm publish    # Fails ❌
```

### Solutions

#### Check package.json "files"
```json
{
  "files": [
    "dist"  // Make sure this includes built files
  ]
}
```

#### Check .npmignore
```bash
# .npmignore should NOT exclude dist/
# Or remove .npmignore entirely
```

#### Verify Build Output
```bash
ls -la dist/
# Should contain .js and .json files
```

---

## Issue 14: "Cannot Read Property of Undefined"

### Symptoms
```
TypeError: Cannot read property 'binary' of undefined
```

### Solutions

This is a runtime error. Check:

1. **Input Data Format**
   ```typescript
   // Make sure input has binary data
   if (!items[itemIndex].binary) {
     throw new NodeOperationError(
       this.getNode(),
       'No binary data found',
       { itemIndex }
     );
   }
   ```

2. **Test with Actual Data**
   - Create workflow with file upload
   - Connect to your node
   - Test with real binary data

---

## Getting Help

### Before Asking for Help

1. **Check these files first:**
   - npm debug log: `npm-debug.log`
   - n8n logs: `~/.n8n/logs/`
   - Build output: `npm run build`

2. **Gather information:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: `uname -a` or `ver`
   - Error message: Full error text

### Where to Ask

1. **GitHub Issues**
   - n8n repository: https://github.com/n8n-io/n8n/issues
   - Your repository: Create issue template

2. **n8n Community**
   - Forum: https://community.n8n.io/
   - Discord: https://discord.gg/n8n

3. **Stack Overflow**
   - Tag: `n8n`, `npm`, `github`
   - Include error details

---

## Prevention Tips

### Before Publishing

- [ ] Test build locally: `npm run build`
- [ ] Test package locally: `npm pack`
- [ ] Test in n8n: Install .tgz file
- [ ] Check all files: `git status`
- [ ] Verify .gitignore: `git check-ignore -v node_modules/`
- [ ] Review package.json: Name, version, files
- [ ] Test authentication: `npm whoami`

### Before Pushing

- [ ] Commit all changes: `git status`
- [ ] Check remote: `git remote -v`
- [ ] Pull latest: `git pull origin main`
- [ ] Review changes: `git diff`

---

## Quick Diagnostic Commands

```bash
# Check git status
git status
git remote -v
git log --oneline -5

# Check npm status
npm whoami
npm config list
npm view n8n-nodes-multiple-upload-request

# Check build status
npm run lint
npm run build
ls -la dist/

# Check n8n status
n8n --version
ls -la ~/.n8n/
```

---

## Emergency Reset

If everything is broken and you want to start over:

```bash
# Backup your code first!
cp -r n8n-nodes-multiple-upload-request n8n-nodes-multiple-upload-request.backup

# Clean git
rm -rf .git
git init

# Clean npm
rm -rf node_modules package-lock.json
npm install

# Start fresh
# Follow setup guide from beginning
```

---

**Keep this guide handy when setting up your repository!**
