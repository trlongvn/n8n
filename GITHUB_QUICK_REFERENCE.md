# GitHub Repository Quick Reference Card

## 🚀 Quick Start Commands

### Create Repository on GitHub
```bash
# Visit: https://github.com/new
# Name: n8n-nodes-multiple-upload-request
# Public, no README/license/gitignore
```

### Connect and Push
```bash
cd ~/n8n-nodes-multiple-upload-request
git init
git branch -M main
git add .
git commit -m "feat: Initial release"
git remote add origin https://github.com/trlongvn/n8n-nodes-multiple-upload-request.git
git push -u origin main
```

### Publish to npm
```bash
npm install
npm run build
npm login
npm publish --access public
```

### Create Release
```bash
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

---

## 📋 Pre-Publish Checklist

- [ ] All code committed to git
- [ ] README.md is complete
- [ ] package.json has correct name and version
- [ ] .gitignore excludes node_modules and dist
- [ ] License file exists (MIT)
- [ ] Code builds successfully (`npm run build`)
- [ ] GitHub repository created
- [ ] Remote origin configured
- [ ] Code pushed to GitHub
- [ ] npm account created
- [ ] Logged into npm (`npm whoami`)

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Create GitHub Repo | https://github.com/new |
| Your Repository | https://github.com/trlongvn/n8n-nodes-multiple-upload-request |
| npm Registry | https://www.npmjs.com/package/n8n-nodes-multiple-upload-request |
| npm Signup | https://www.npmjs.com/signup |
| n8n Community | https://community.n8n.io/ |
| n8n Docs | https://docs.n8n.io/integrations/community-nodes/ |

---

## 🛠️ Common Issues

### Authentication Failed (GitHub)
```bash
# Use Personal Access Token instead of password
# Generate at: https://github.com/settings/tokens
```

### Package Name Already Taken (npm)
```bash
# Change name in package.json
# Or use scoped package: @yourusername/package-name
```

### Build Errors
```bash
# Check TypeScript
npm run lint
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Alternative: Using GitHub CLI

```bash
# Install GitHub CLI
# https://cli.github.com/

# Create and push in one go
gh repo create n8n-nodes-multiple-upload-request \
  --public \
  --source=. \
  --remote=origin \
  --push
```

---

## 🎯 Post-Publication Tasks

1. **Add badges to README**
   ```markdown
   [![npm version](https://badge.fury.io/js/n8n-nodes-multiple-upload-request.svg)](https://www.npmjs.com/package/n8n-nodes-multiple-upload-request)
   ```

2. **Update repository settings**
   - Add topics: `n8n`, `n8n-nodes`, `upload`
   - Enable Issues and Discussions

3. **Announce on n8n Community**
   - https://community.n8n.io/
   - Category: Show and tell

4. **Submit to n8n documentation**
   - Fork: https://github.com/n8n-io/n8n-docs
   - Add to community nodes list

---

## 🔄 Update Workflow

### Making Changes
```bash
# Make your changes
git add .
git commit -m "fix: description of change"
git push
```

### Publishing Update
```bash
# Update version in package.json
npm version patch  # or minor, or major
npm run build
npm publish
git push --tags
```

### Creating New Release
```bash
git tag -a v0.1.1 -m "Bug fixes"
git push origin v0.1.1

# With GitHub CLI
gh release create v0.1.1 --generate-notes
```

---

## 💡 Pro Tips

1. **Use Semantic Versioning**
   - MAJOR.MINOR.PATCH (e.g., 1.2.3)
   - Breaking changes = MAJOR
   - New features = MINOR
   - Bug fixes = PATCH

2. **Write Good Commit Messages**
   ```
   feat: add new feature
   fix: fix bug
   docs: update documentation
   chore: update dependencies
   ```

3. **Keep CHANGELOG Updated**
   - Document all changes
   - Make it easy for users to see what's new

4. **Test Before Publishing**
   ```bash
   npm pack
   # Install the .tgz file in a test project
   npm install ./n8n-nodes-multiple-upload-request-0.1.0.tgz
   ```

---

## 📞 Need Help?

- **Git Issues**: https://git-scm.com/doc
- **GitHub Issues**: https://docs.github.com/
- **npm Issues**: https://docs.npmjs.com/
- **n8n Support**: https://community.n8n.io/

---

**Save this file for future reference!**
