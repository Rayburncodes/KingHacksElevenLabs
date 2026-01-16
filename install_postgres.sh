#!/bin/bash

# Script to install PostgreSQL on macOS

echo "=== Installing PostgreSQL on macOS ==="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew (required for PostgreSQL)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

echo ""
echo "✅ Homebrew installed/ready"
echo ""
echo "📦 Installing PostgreSQL 15..."
brew install postgresql@15

echo ""
echo "📦 Starting PostgreSQL service..."
brew services start postgresql@15

echo ""
echo "✅ PostgreSQL installed!"
echo ""
echo "To create the database:"
echo "  createdb kinghacks"
echo ""
echo "Or if you get a password prompt:"
echo "  createuser postgres"
echo "  createdb kinghacks"
