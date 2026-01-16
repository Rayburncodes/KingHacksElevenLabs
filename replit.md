# ClauseAI

## Overview

ClauseAI is a contract consequence simulator that helps users understand the real-world implications of breaking a contract. Users paste or upload contract text, select one of three predefined scenarios (quitting early, missing a payment, or being terminated), and the app finds the relevant clause, rewrites it in plain English, and speaks the explanation aloud using text-to-speech.

This is **not a chatbot** - it's a focused tool that analyzes contracts for specific breach scenarios and delivers clear, professional explanations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom professional legal-themed color palette (navy, slate, parchment white)
- **Typography**: Merriweather (serif) for headings, Inter (sans-serif) for body text
- **Text-to-Speech**: Browser's native Web Speech API (SpeechSynthesis) for audio playback

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **AI Integration**: OpenAI API (via Replit AI Integrations) for contract analysis using GPT models
- **Build Process**: esbuild for server bundling, Vite for client bundling

### Data Flow
1. User pastes contract text and selects a scenario
2. Frontend validates input using shared Zod schemas
3. Request sent to `/api/analyze` endpoint
4. Server sends contract + scenario to OpenAI with a specialized legal analysis prompt
5. OpenAI returns structured JSON with original clause, plain English explanation, and highlight snippets
6. Response stored in database and returned to client
7. Frontend displays results and auto-plays text-to-speech

### Project Structure
- `client/` - React frontend application
- `server/` - Express backend with routes and database access
- `shared/` - Shared types, schemas, and API route definitions
- `server/replit_integrations/` - Pre-built integrations for batch processing, chat, and image generation

## External Dependencies

### Database
- **PostgreSQL** via `pg` driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema Location**: `shared/schema.ts`
- **Session Storage**: `connect-pg-simple` for Express sessions

### AI Services
- **OpenAI API** accessed through Replit AI Integrations
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Primary model: GPT for contract clause extraction and plain English rewriting

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema-to-validation
- `zod` - Runtime type validation for API requests/responses
- `openai` - OpenAI SDK for AI completions
- Radix UI primitives - Accessible UI components
- `wouter` - Client-side routing