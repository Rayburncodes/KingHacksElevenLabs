# How to Run KINGHACKS

## Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```
This installs all required packages (only needed once).

### Step 2: Set Up Database

**If PostgreSQL is installed:**
```bash
# Create the database
createdb kinghacks

# Set up the schema
npm run db:push
```

**Update `.env` file:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/kinghacks
ELEVEN_LABS_API_KEY=sk_b79a1711d559ea6ad5c92fdc181585f34ce17325b38d3cbe
PORT=5000
```

### Step 3: Run the Application
```bash
npm run dev
```

The app will start on `http://localhost:5000` (or the port specified in `.env`)

## Troubleshooting

**If PostgreSQL is not running:**
- macOS: Check System Preferences → PostgreSQL
- Or run: `pg_ctl -D /usr/local/var/postgres start`

**If port 5000 is in use:**
- Change `PORT=3000` in `.env` file

**If database connection fails:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env` matches your PostgreSQL setup
