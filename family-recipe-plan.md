# Tré Kante Family Recipe Website - Complete Setup Plan

## Overview

This document provides a complete plan for building the Tré Kante family recipe website. The project uses the **Dev Studio pattern** from `directorforgood.org` - sharing the same Supabase project but using a separate schema (`family_recipes`) to keep data isolated while consolidating infrastructure and billing.

**Project Name:** Tré Kante (play on "three Kantes" - Mom, Dad, Son)

**Repository:** https://github.com/boscokante/family-recipes

**Approach:** Copy the `directorforgood.org` folder into the `family-recipes` repo so the new Cursor instance can reference it and extract needed files.

---

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase PostgreSQL (shared project, `family_recipes` schema - Dev Studio pattern)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js with credentials provider
- **AI:** OpenAI GPT-4o-mini for recipe chatbot
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (shared account)
- **Storage:** Supabase Storage for recipe images (shared bucket or separate bucket)

### Project Structure

```
family-recipes/
├── directorforgood/          # Reference folder (copy from directorforgood.org)
├── app/
│   ├── page.tsx            # Homepage - restaurant menu style
│   ├── layout.tsx           # Root layout with Tré Kante branding
│   ├── globals.css          # Fresh design system
│   ├── recipes/
│   │   ├── page.tsx        # All recipes grid
│   │   └── [slug]/
│   │       └── page.tsx     # Individual recipe page
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx     # Recipes by category
│   ├── family/
│   │   └── page.tsx         # Family photos/stories page
│   ├── admin/
│   │   ├── layout.tsx       # Admin layout (protected)
│   │   ├── dashboard/
│   │   │   └── page.tsx     # Admin home
│   │   └── recipes/
│   │       ├── page.tsx     # Recipe list
│   │       ├── new/
│   │       │   └── page.tsx # Create recipe
│   │       └── [id]/
│   │           └── page.tsx # Edit recipe
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts     # NextAuth handlers
│   │   ├── ai/
│   │   │   └── chat/
│   │   │       └── route.ts # Recipe chatbot
│   │   ├── recipes/
│   │   │   ├── route.ts      # GET all, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts  # GET one, PATCH update, DELETE
│   │   └── media/
│   │       └── route.ts      # Image uploads
│   └── login/
│       └── page.tsx          # Login page
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── label.tsx
│   └── ai/
│       └── chat-widget.tsx   # Recipe chatbot widget
├── db/
│   ├── index.ts              # Drizzle connection
│   ├── schema.ts             # Database schema
│   └── migrations/           # Drizzle migrations
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── utils.ts              # Utility functions
│   └── recipe-knowledge.ts   # Chatbot system prompt
├── scripts/
│   ├── create-admin-user.ts  # Create admin user script
│   └── setup-supabase-storage.ts # Setup storage buckets
├── package.json
├── tsconfig.json
├── next.config.ts
├── drizzle.config.ts
├── .env.example
└── SETUP.md                   # This file
```

---

## Database Schema

### Tables

#### `users`
- Authentication and admin access
- Fields: id, email, name, role, password_hash, created_at

#### `media`
- Recipe images and family photos
- Fields: id, filename, url, mime_type, size, alt_text, uploaded_by, created_at

#### `recipes`
- Main recipe content
- Fields:
  - `id` (serial primary key)
  - `slug` (unique, for URLs)
  - `title` (required)
  - `description` (optional)
  - `story` (family story behind recipe)
  - `servings` (integer)
  - `prep_time` (minutes)
  - `cook_time` (minutes)
  - `ingredients` (JSONB array of `{amount, name, notes?}`)
  - `instructions` (JSONB array of strings)
  - `tips` (text)
  - `cover_image` (URL)
  - `category` ('appetizer', 'main', 'dessert', 'side', 'drink')
  - `cuisine` ('italian', 'mexican', 'southern', etc.)
  - `tags` (JSONB array of strings)
  - `contributed_by` (family member name)
  - `family_photo` (URL to family photo)
  - `published` (boolean, default false)
  - `created_at`, `updated_at` (timestamps)

---

## Files to Copy from directorforgood

When you have the `directorforgood` folder in the repo, reference these files:

### Core Infrastructure
- `db/index.ts` - Database connection (copy as-is)
- `lib/auth.ts` - NextAuth setup (copy as-is)
- `lib/utils.ts` - Utility functions (copy as-is)
- `components/ui/*` - All UI components (button, input, textarea, label)
- `scripts/create-admin-user.ts` - Admin user creation script

### Config Files
- `package.json` - Dependencies (remove unused: react-pdf, turndown, uploadthing)
- `tsconfig.json` - TypeScript config (copy as-is)
- `next.config.ts` - Next.js config (copy as-is)
- `drizzle.config.ts` - Drizzle config (copy as-is)
- `eslint.config.mjs` - ESLint config (copy as-is)
- `postcss.config.mjs` - PostCSS config (copy as-is)
- `.gitignore` - Git ignore rules (copy as-is)

### Patterns to Adapt
- `app/login/page.tsx` - Login page (adapt branding)
- `app/admin/layout.tsx` - Admin layout pattern (adapt for recipes)
- `components/ai/chat-widget.tsx` - Chat widget (adapt for recipes)

---

## Supabase Setup (Dev Studio Pattern)

### Step 1: Use Existing Supabase Project

This project uses the **Dev Studio pattern** - sharing the same Supabase project as `directorforgood.org` but with a separate schema for data isolation.

**No new Supabase project needed!** Use the existing project credentials from `.env.local`.

### Step 2: Create Schema

1. Run the schema creation script:
   ```bash
   npm run create-schema
   ```
   This creates the `family_recipes` schema in the shared Supabase project.

### Step 3: Environment Variables

Copy the Supabase credentials from the existing Dev Studio project (already in `.env.local`):
- `DATABASE_URL` - Shared Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Shared Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Shared Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Shared Supabase service role key (keep secret!)

### Step 3: Set Up Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Create bucket named `recipe-images`:
   - **Name:** `recipe-images`
   - **Public bucket:** ✅ Yes (so images can be accessed via URL)
   - **File size limit:** 5MB (or adjust as needed)
   - **Allowed MIME types:** `image/*` (or specific: `image/jpeg,image/png,image/webp`)
4. Click **Create bucket**

### Step 4: Set Up Storage Policies (Optional but Recommended)

1. Go to **Storage** → **Policies** → `recipe-images`
2. Create policy for public read access:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'recipe-images');
   ```
3. Create policy for authenticated uploads (admin only):
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated upload access"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'recipe-images' 
     AND auth.role() = 'authenticated'
   );
   ```

### Step 5: Push Database Schema

1. Ensure `.env.local` has the shared Supabase credentials (copied from directorforgood.org)

2. Create the schema:
   ```bash
   npm run create-schema
   ```

3. Push the schema to create tables in the `family_recipes` schema:
   ```bash
   npm install
   npm run db:push
   ```
   This creates the `users`, `media`, and `recipes` tables in the `family_recipes` schema.

4. Verify in Supabase dashboard:
   - Go to **Table Editor**
   - Select schema: `family_recipes` (dropdown at top)
   - You should see `users`, `media`, `recipes` tables

### Step 6: Create First Admin User

1. Generate a password hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('YourSecurePassword123', 10))"
   ```
   Copy the output (starts with `$2a$10$...`)

2. Run the create-admin script:
   ```bash
   npm run create-admin
   ```
   Or manually insert via SQL Editor in Supabase:
   ```sql
   INSERT INTO users (email, name, role, password_hash, created_at)
   VALUES (
     'your-email@example.com',
     'Admin',
     'admin',
     '$2a$10$YOUR_GENERATED_HASH_HERE',
     NOW()
   );
   ```

---

## Vercel Setup

### Step 1: Create New Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub (`boscokante`)
3. Click **Add New** → **Project**
4. Import your GitHub repository:
   - Select `boscokante/family-recipes`
   - Click **Import**

### Step 2: Configure Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (root of repo)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 3: Add Environment Variables

In Vercel project settings, go to **Environment Variables** and add:

#### Required Variables

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# NextAuth
AUTH_SECRET=generate-with-openssl-rand-base64-32

# OpenAI (for chatbot)
OPENAI_API_KEY=sk-proj-...
```

#### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and add as `AUTH_SECRET` in Vercel.

#### Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in
3. Go to **API Keys**
4. Click **Create new secret key**
5. Copy the key (starts with `sk-proj-...` or `sk-...`)
6. Add to Vercel as `OPENAI_API_KEY`

**Note:** You can reuse the same OpenAI API key from directorforgood if you want.

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://family-recipes-xxxxx.vercel.app`

### Step 5: Custom Domain (Optional)

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `trekante.com` or `family-recipes.com`)
3. Follow DNS setup instructions:
   - Add CNAME record pointing to Vercel
   - Or add A records if using apex domain
4. Vercel will automatically provision SSL certificate

---

## Local Development Setup

### Step 1: Clone and Install

```bash
cd /Users/boskombp16/GitHub/family-recipes
git clone https://github.com/boscokante/family-recipes.git
cd family-recipes
npm install
```

### Step 2: Copy directorforgood Folder

```bash
# From the family-recipes directory
cp -r ../directorforgood.org ./directorforgood
```

This gives you a reference folder to copy files from.

### Step 3: Create .env.local

Create `.env.local` in the project root with all environment variables:

```env
# Database (from Supabase Settings → Database)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase (from Supabase Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# NextAuth (generate with: openssl rand -base64 32)
AUTH_SECRET=your-generated-secret-here

# OpenAI (from platform.openai.com)
OPENAI_API_KEY=sk-proj-...

# Local development
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Push Database Schema

```bash
npm run db:push
```

This creates all tables in your Supabase database.

### Step 5: Create Admin User

```bash
npm run create-admin
```

Or use the script from directorforgood:
```bash
tsx scripts/create-admin-user.ts
```

### Step 6: Start Development Server

```bash
npm run dev
```

Visit:
- **Homepage:** http://localhost:3000
- **Admin:** http://localhost:3000/admin (login required)
- **Login:** http://localhost:3000/login

---

## Key Differences from directorforgood

### What's Different
- **Database Schema:** Separate `family_recipes` schema (same Supabase project, isolated data)
- **Design:** Fresh restaurant-themed design (warm, inviting)
- **Content:** Recipes instead of nonprofit content
- **Chatbot:** Recipe-focused (scaling, substitutions, tips)
- **Tables:** Recipe-specific tables instead of entities/awards/newsletters

### What's the Same (Dev Studio Pattern)
- **Infrastructure:** Shared Supabase project (Dev Studio pattern)
- **Billing:** Consolidated under one Supabase account
- **Architecture:** Next.js App Router, Drizzle ORM, NextAuth
- **Patterns:** Same file structure, component patterns
- **Vercel:** Shared Vercel account for deployments
- **Auth:** Same NextAuth credentials provider

---

## Development Workflow

### Adding a New Recipe

1. Log in at `/login`
2. Go to `/admin/recipes/new`
3. Fill in recipe form:
   - Title, description, story
   - Ingredients (amount, name, notes)
   - Instructions (step by step)
   - Category, cuisine, tags
   - Upload cover image
   - Add family photo
   - Set contributed_by (family member name)
4. Click "Publish" when ready

### Testing Chatbot

1. Visit homepage
2. Click floating chat button (bottom-right)
3. Try questions like:
   - "How do I scale this recipe for 8 people?"
   - "What can I substitute for eggs?"
   - "How do I make this gluten-free?"
   - "What does 'fold in' mean?"

### Database Migrations

When you change the schema:

```bash
# Generate migration
npm run db:generate

# Review generated files in db/migrations/

# Push to database
npm run db:push

# Or run migrations
npm run db:migrate
```

---

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in `.env.local`
- Check Supabase project is active (not paused)
- Ensure password in connection string matches Supabase project password

### Auth Not Working

- Verify `AUTH_SECRET` is set (generate new one if needed)
- Check `NEXTAUTH_URL` matches your deployment URL
- Ensure user exists in database with correct password hash

### Images Not Uploading

- Verify Supabase Storage bucket `recipe-images` exists
- Check storage policies allow uploads
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)

### Chatbot Not Responding

- Check `OPENAI_API_KEY` is set correctly
- Verify API key has credits/quota
- Check browser console for errors

---

## Next Steps After Setup

1. ✅ Supabase project created and connected
2. ✅ Database schema pushed
3. ✅ Admin user created
4. ✅ Vercel project deployed
5. ✅ Environment variables configured
6. ⏭️ Build homepage with recipe grid
7. ⏭️ Create recipe detail pages
8. ⏭️ Build admin CMS for recipe management
9. ⏭️ Add family photos/stories page
10. ⏭️ Test chatbot with real recipes
11. ⏭️ Add custom domain
12. ⏭️ Import existing recipes from JSON/images

---

## Reference: Environment Variables Summary

### Required for Local Development

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AUTH_SECRET=...
OPENAI_API_KEY=...
NEXTAUTH_URL=http://localhost:3000
```

### Required for Vercel Production

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
AUTH_SECRET=...
OPENAI_API_KEY=...
NEXTAUTH_URL=https://your-domain.com
```

**Note:** Vercel automatically sets `NEXTAUTH_URL` based on deployment URL, but you can override it.

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **NextAuth Docs:** https://next-auth.js.org
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** December 13, 2025
