#!/bin/bash

# ContextStack - Push to GitHub Script

echo "🚀 Preparing to push ContextStack to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "⚠️  Warning: .gitignore not found!"
else
    echo "✅ .gitignore found"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Show status
echo ""
echo "📊 Git status:"
git status --short

# Commit
echo ""
read -p "Enter commit message (default: 'Initial commit: ContextStack application'): " commit_msg
commit_msg=${commit_msg:-"Initial commit: ContextStack application"}

git commit -m "$commit_msg"
echo "✅ Files committed"

# Set main branch
echo ""
echo "🌿 Setting main branch..."
git branch -M main

# Add remote
echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/contextstack.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ Error: Repository URL is required"
    exit 1
fi

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "📍 Remote 'origin' already exists, updating..."
    git remote set-url origin "$repo_url"
else
    echo "📍 Adding remote 'origin'..."
    git remote add origin "$repo_url"
fi

echo "✅ Remote added: $repo_url"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your GitHub repository: $repo_url"
    echo "2. Follow DEPLOYMENT.md for deployment instructions"
    echo "3. Deploy to Render, Railway, or Vercel"
    echo ""
    echo "🎉 Your code is now on GitHub!"
else
    echo ""
    echo "❌ Error pushing to GitHub"
    echo "Please check your repository URL and try again"
    exit 1
fi
