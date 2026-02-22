# Tré Kante Family Recipes

A Next.js website for sharing treasured family recipes from the Kante family.

## Setup

See `family-recipe-plan.md` for complete setup instructions.

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

4. **Create admin user:**
   ```bash
   npm run create-admin
   ```

5. **Set up Supabase storage:**
   ```bash
   npm run setup-storage
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

Visit http://localhost:3000

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components
- `db/` - Database schema and migrations
- `lib/` - Utility functions and configurations
- `scripts/` - Setup and utility scripts

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase PostgreSQL
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js
- **AI:** OpenAI GPT-4o-mini (for recipe chatbot)
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate migration files
- `npm run create-admin` - Create admin user
- `npm run setup-storage` - Set up Supabase storage bucket


