#!/bin/bash

# Script to push all code to Rayburncodes/KingHacksElevenLabs

echo "=== Pushing all code to Rayburncodes/KingHacksElevenLabs ==="
echo ""

REPO_URL="https://github.com/Rayburncodes/KingHacksElevenLabs.git"

echo "Pushing main branch..."
git push $REPO_URL main 2>&1

echo ""
echo "Pushing all branches..."
git push $REPO_URL --all 2>&1

echo ""
echo "✅ Done!"
echo ""
echo "Repository: https://github.com/Rayburncodes/KingHacksElevenLabs"
