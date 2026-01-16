# Installing PostgreSQL on macOS (No Docker)

## Option 1: Using Homebrew (Recommended - Command Line)

### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Note:** You may be prompted for your password. After installation, you might need to add Homebrew to your PATH:
```bash
# For Intel Macs:
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"

# For Apple Silicon Macs:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install PostgreSQL
```bash
brew install postgresql@15
```

### Step 3: Start PostgreSQL Service
```bash
brew services start postgresql@15
```

### Step 4: Create Database (Optional - can use existing)
```bash
createdb kinghacks
```

## Option 2: Using Official Installer (GUI)

1. Go to: https://www.postgresql.org/download/macosx/
2. Download PostgreSQL 15.x installer (choose the .dmg file)
3. Run the installer
4. Follow the installation wizard
5. Set a password for the `postgres` user (remember this!)
6. Complete the installation

After installation, PostgreSQL will start automatically.

## Quick Install Script

I've created `install_postgres.sh` - you can run it:
```bash
./install_postgres.sh
```

This will automatically:
- Install Homebrew (if needed)
- Install PostgreSQL 15
- Start the PostgreSQL service

## After Installation

Update your `.env` file:
```env
# If using default PostgreSQL setup:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/kinghacks

# Or if using your macOS username (no password):
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/kinghacks
```

Then run:
```bash
npm run db:push
```

## Verify Installation

Check if PostgreSQL is running:
```bash
psql --version
pg_isready
```
