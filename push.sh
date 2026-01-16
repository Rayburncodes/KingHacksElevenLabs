#!/bin/bash

# Push script for add-contributor-section branch

echo "=== Pushing to GitHub ==="
echo ""
echo "Branch: add-contributor-section"
echo ""

# Check if branch exists
if ! git show-ref --verify --quiet refs/heads/add-contributor-section; then
    echo "Error: Branch add-contributor-section not found"
    exit 1
fi

# Show what will be pushed
echo "Commits to push:"
git log origin/main..add-contributor-section --oneline
echo ""

# Attempt push
echo "Pushing to GitHub..."
git push origin add-contributor-section

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push successful!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/Andrew126111/KingHacks-ElevenLabs"
    echo "2. Click 'Compare & pull request'"
    echo "3. Create and submit the PR"
else
    echo ""
    echo "❌ Push failed. You may need to authenticate:"
    echo ""
    echo "Option 1: Create a Personal Access Token"
    echo "  - Go to: https://github.com/settings/tokens"
    echo "  - Generate new token (classic) with 'repo' scope"
    echo "  - Run: git push origin add-contributor-section"
    echo "  - When prompted, use your token as the password"
    echo ""
    echo "Option 2: Fork the repository"
    echo "  - Go to: https://github.com/Andrew126111/KingHacks-ElevenLabs"
    echo "  - Click 'Fork'"
    echo "  - Then run: git remote add fork https://github.com/YOUR_USERNAME/KingHacks-ElevenLabs"
    echo "  - Then run: git push fork add-contributor-section"
fi
