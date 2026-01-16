#!/bin/bash

# Script to push all code to rayburncodes repository

echo "=== Pushing all code to rayburncodes/KingHacks-ElevenLabs ==="
echo ""

# Check if repository exists
REPO_URL="https://github.com/rayburncodes/KingHacks-ElevenLabs.git"

echo "Adding your repository as remote 'rayburn'..."
git remote add rayburn $REPO_URL 2>&1 || git remote set-url rayburn $REPO_URL 2>&1 || echo "Remote might already exist"

echo ""
echo "Fetching all branches..."
git fetch origin

echo ""
echo "Pushing main branch..."
git push rayburn main

echo ""
echo "Pushing all branches..."
git push rayburn --all

echo ""
echo "Pushing all tags (if any)..."
git push rayburn --tags

echo ""
echo "✅ Done! Your repository now has all the code."
echo ""
echo "To make your repository the default remote:"
echo "  git remote set-url origin $REPO_URL"
echo ""
echo "Your repository: https://github.com/rayburncodes/KingHacks-ElevenLabs"
