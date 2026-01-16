#!/bin/bash

# Script to push all code to KINGHACKS repository

echo "=== Pushing all code to rayburncodes/KINGHACKS ==="
echo ""

# Repository URL
REPO_URL="https://github.com/rayburncodes/KINGHACKS.git"

echo "Adding your KINGHACKS repository as remote 'kinghacks'..."
git remote add kinghacks $REPO_URL 2>&1 || git remote set-url kinghacks $REPO_URL 2>&1 || echo "Remote might already exist"

echo ""
echo "Fetching all branches..."
git fetch origin

echo ""
echo "Pushing main branch to KINGHACKS..."
git push kinghacks main

echo ""
echo "Pushing all branches to KINGHACKS..."
git push kinghacks --all

echo ""
echo "Pushing all tags (if any)..."
git push kinghacks --tags

echo ""
echo "✅ Done! Your repository now has all the code."
echo ""
echo "Your KINGHACKS repository: https://github.com/rayburncodes/KINGHACKS"
echo ""
echo "To make this your default repository:"
echo "  git remote set-url origin $REPO_URL"
