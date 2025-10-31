# 🚀 Setup Guide for GitHub Repository

## Step 1: Create the Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `advanced-markdown`
3. Description: "A powerful markdown parser with Math (KaTeX), Chemistry (mhchem), and Code Highlighting"
4. Make it **Public**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Initialize Git and Push

Open terminal in the `advanced-markdown` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial release of advanced-markdown v1.0.0"

# Add remote
git remote add origin https://github.com/themrsami/advanced-markdown.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set Up npm Publishing

### Create npm Access Token

1. Go to https://www.npmjs.com/settings/themrsami/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" (for CI/CD) or "Publish" (manual only)
4. Copy the token (starts with `npm_...`)

### Add Token to GitHub Secrets

1. Go to https://github.com/themrsami/advanced-markdown/settings/secrets/actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your npm token
5. Click "Add secret"

## Step 4: Publish to npm

### Option A: Manual Publish

```bash
# Login to npm (one time)
npm login

# Build and publish
npm run build
npm publish
```

### Option B: Automatic via GitHub Release

1. Go to https://github.com/themrsami/advanced-markdown/releases/new
2. Tag version: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Click "Publish release"
6. GitHub Actions will automatically publish to npm!

## Step 5: Configure Repository Settings

### About Section
1. Go to repository homepage
2. Click ⚙️ (settings icon) next to "About"
3. Website: `https://www.markdowntopdf.tech`
4. Topics: `markdown`, `parser`, `katex`, `math`, `chemistry`, `mhchem`, `syntax-highlighting`
5. Check "Include in the home page" for Releases and Packages

### GitHub Pages (Optional)
Can host documentation later if needed.

## Step 6: Verify Everything Works

After publishing:

```bash
# In a new directory, test installation
mkdir test-install
cd test-install
npm init -y
npm install advanced-markdown

# Create test.js
node -e "const {parse} = require('advanced-markdown'); console.log(parse('# Test $x^2$'));"
```

## Step 7: Update markdowntopdf.tech Website

In your main website, add:

```tsx
<div className="banner">
  Powered by <a href="https://github.com/themrsami/advanced-markdown">advanced-markdown</a>
  - Now available on <a href="https://www.npmjs.com/package/advanced-markdown">npm</a>!
</div>
```

## 📋 Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] npm token added to GitHub Secrets
- [ ] Package published to npm
- [ ] Installation tested
- [ ] Repository settings configured
- [ ] Website updated with package link

## 🎉 You're Done!

Your package is now:
- ✅ Published on npm: https://www.npmjs.com/package/advanced-markdown
- ✅ Hosted on GitHub: https://github.com/themrsami/advanced-markdown
- ✅ Auto-publishing on releases
- ✅ Ready for contributions

Share it with the world! 🌍
