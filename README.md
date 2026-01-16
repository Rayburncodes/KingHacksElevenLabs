# ClauseCast

ClauseCast is a contract consequence simulator that helps users understand the real-world implications of legal clauses.

## Features
- **AI Contract Analysis**: Extracts specific clauses and translates them into plain English.
- **Multilingual Support**: Supports English, French, and Spanish.
- **Text-to-Speech**: High-quality audio playback using ElevenLabs.
- **Local File Import**: Parse PDFs and text files for analysis.

## Local Setup

To run ClauseCast locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- [OpenAI API Key](https://platform.openai.com/)
- [ElevenLabs API Key](https://elevenlabs.io/) (Optional, for TTS)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ClauseCast
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clausecast
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
SESSION_SECRET=a_random_secure_string
```

### 4. Database Setup
Push the schema to your local database:
```bash
npx drizzle-kit push:pg
```

### 5. Run the application
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5000`.

## Architecture
- **Frontend**: React, Tailwind CSS, Shadcn/UI, Wouter, TanStack Query.
- **Backend**: Express, Node.js.
- **ORM**: Drizzle ORM.
- **AI**: OpenAI GPT-4o.
