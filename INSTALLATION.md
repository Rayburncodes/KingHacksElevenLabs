# Installation Guide for KINGHACKS

## What You Need to Install

### ✅ Already Installed
- ✅ **Node.js** v24.11.1 (required: v18+)
- ✅ **npm** 11.6.2 (comes with Node.js)

### Required Installations

#### 1. **Node.js** (if not installed)
- Download from: https://nodejs.org/
- Version: **v18 or higher** (you have v24.11.1 ✅)
- Includes npm automatically

#### 2. **PostgreSQL Database** (required)

**Option A: Using Docker (Recommended - Easiest)**
```bash
# If you have Docker installed:
docker run -d --name kinghacks-postgres \
  -e POSTGRES_PASSWORD=kinghacks123 \
  -e POSTGRES_DB=kinghacks \
  -p 5432:5432 \
  postgres:15
```

**Option B: Install PostgreSQL Locally**
- **macOS**: `brew install postgresql@15` (if you have Homebrew)
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt-get install postgresql` (Ubuntu/Debian)

#### 3. **Project Dependencies** (npm packages)
```bash
# After cloning the repository:
cd KINGHACKS
npm install
```
This installs all JavaScript/TypeScript packages automatically.

### Optional but Recommended

- **Docker** (for easy PostgreSQL setup)
- **Git** (already installed if you cloned the repo)

## Quick Setup Steps

1. **Install Node.js** (if needed)
   ```bash
   # Check if installed:
   node --version  # Should show v18 or higher
   ```

2. **Set up PostgreSQL** (choose one):
   - **Docker**: Run the docker command above
   - **Local**: Install PostgreSQL and start the service

3. **Install project dependencies**:
   ```bash
   npm install
   ```

4. **Create `.env` file**:
   ```env
   DATABASE_URL=postgresql://postgres:kinghacks123@localhost:5432/kinghacks
   ELEVEN_LABS_API_KEY=sk_b79a1711d559ea6ad5c92fdc181585f34ce17325b38d3cbe
   PORT=5000
   ```

5. **Set up database**:
   ```bash
   npm run db:push
   ```

6. **Run the app**:
   ```bash
   npm run dev
   ```

## Troubleshooting

- **Node.js not found**: Install from https://nodejs.org/
- **Database connection error**: Make sure PostgreSQL is running
- **npm install fails**: Make sure you have internet connection
- **Port 5000 already in use**: Change PORT in `.env` file
