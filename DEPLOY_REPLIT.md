# Deploying ClauseCast to Replit

## Quick Setup Guide

### 1. Import from GitHub
1. Go to [Replit](https://replit.com/)
2. Click **"Create Repl"**
3. Select **"Import from GitHub"**
4. Enter repository: `https://github.com/Andrew126111/KingHacks-ElevenLabs`
5. Click **"Import"**

### 2. Environment Variables (Secrets)
In Replit, go to **Secrets** tab (lock icon) and add:

- **ELEVEN_LABS_API_KEY**: `sk_b79a1711d559ea6ad5c92fdc181585f34ce17325b38d3cbe`
- **DATABASE_URL**: Automatically provided by Replit PostgreSQL module (don't set manually)
- **AI_INTEGRATIONS_OPENAI_API_KEY**: (Optional - for OpenAI features)
- **AI_INTEGRATIONS_OPENAI_BASE_URL**: (Optional - auto-set by Replit AI Integrations)

### 3. Database Setup
1. Replit should automatically provide PostgreSQL (configured in `.replit`)
2. In the Replit shell, run:
   ```bash
   npm run db:push
   ```
   This creates the database schema.

### 4. Run the Project
- Simply click the **"Run"** button
- Replit will automatically run `npm run dev`
- Your app will be available at your Replit URL

## Notes
- The `.replit` file is already configured for Replit deployment
- Port 5000 is automatically configured (no need to change)
- PostgreSQL module is included in the configuration
- The server binds to `0.0.0.0` which is required for Replit hosting

## Troubleshooting
- If database errors occur, verify PostgreSQL module is enabled in Replit
- Check Secrets tab to ensure all API keys are set correctly
- Make sure to run `npm run db:push` before first run
