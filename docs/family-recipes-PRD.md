# Product Requirements Document: Tré Kante Family Recipes

**Version:** 1.3  
**Date:** January 26, 2026  
**Status:** Draft  
**Last Updated:** Added Weight/Scaling (Epic 10), Camera/Video Capture (Epic 11)  
**Author:** Bosco Kante

---

## Table of Contents
1. [Background / Problem Statement](#1-background--problem-statement)
2. [Goals & Non-Goals](#2-goals--non-goals)
3. [Target Users / Personas](#3-target-users--personas)
4. [Platform Architecture: Web vs iOS](#4-platform-architecture-web-vs-ios)
5. [User Journeys / Key Flows](#5-user-journeys--key-flows)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Data Model](#8-data-model)
9. [Integrations / External Dependencies](#9-integrations--external-dependencies)
10. [Permissions / Roles / Auth](#10-permissions--roles--auth)
11. [UX Notes](#11-ux-notes)
12. [Analytics / Success Metrics](#12-analytics--success-metrics)
13. [Edge Cases & Failure Modes](#13-edge-cases--failure-modes)
14. [Risks, Open Questions, Out-of-Scope](#14-risks-open-questions-out-of-scope)
15. [Release Plan](#15-release-plan)
16. [Epics & User Stories](#16-epics--user-stories)
17. [Verification Checklist](#17-verification-checklist)

---

## 1. Background / Problem Statement

Family recipes are the edible autobiography of a family's history. Currently, the Kante family's recipes exist scattered across:
- Handwritten cards in kitchen drawers
- Text messages and screenshots
- Mental notes passed down verbally
- Random photos of dishes without instructions

**The Problem:** These recipes are at risk of being lost, are difficult to share with extended family, and are impossible to search or scale when cooking.

**The Solution:** Tré Kante—a unified digital platform (web + iOS) that preserves family recipes alongside their stories, making them accessible, searchable, and interactive via an AI sous-chef.

---

## 2. Goals & Non-Goals

### Business Goals
- **Preserve:** Digitize and safeguard family culinary heritage for future generations.
- **Share:** Make recipes accessible to all family members, anywhere.
- **Delight:** Provide a premium, "restaurant-menu" quality experience that honors the recipes.

### User Goals
- **Discover:** Easily find recipes by category, cuisine, or contributor.
- **Cook:** Follow recipes with clear instructions and helpful AI assistance.
- **Contribute:** (Admins) Add new recipes with images and family stories.

### Non-Goals (Out of Scope for V1)
- Public social features (comments, likes, shares to non-family).
- Meal planning, grocery lists, or delivery integrations.
- Multi-family/tenant support (this is for the Kante family only).
- User-generated content from non-admin users.
- Monetization or advertising.

---

## 3. Target Users / Personas

### Persona 1: The Contributor (Admin)
- **Who:** Mom, Dad—the recipe owners.
- **Goal:** Upload, organize, and preserve family recipes with stories.
- **Context:** Uses Cursor (AI coding assistant) to edit recipes directly in code/files.
- **Pain Points:** Recipes are scattered; no good way to share.
- **Note:** Primary workflow is direct file editing via Cursor, not a web CMS.

### Persona 2: The Cook (Family Member)
- **Who:** Son, relatives, future generations.
- **Goal:** Find and follow a recipe while cooking.
- **Context:** Uses iPhone in the kitchen with messy hands.
- **Pain Points:** Needs hands-free or easy-tap navigation; scaling recipes is tedious.

---

## 4. Platform Architecture: Web vs iOS

### Overview

The Tré Kante platform consists of two clients consuming a shared backend:

```
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE (Dev Studio - Shared Project)            │
│  ┌─────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │ PostgreSQL  │    │ Supabase Storage│    │ Auth (NextAuth)│  │
│  │  (Drizzle)  │    │ (recipe-images) │    │                │  │
│  │             │    │                 │    │                │  │
│  │ Schemas:    │    │                 │    │                │  │
│  │ • public    │    │                 │    │                │  │
│  │ • family_   │    │                 │    │                │  │
│  │   recipes   │    │                 │    │                │  │
│  └──────┬──────┘    └────────┬────────┘    └───────┬────────┘  │
└─────────┼────────────────────┼─────────────────────┼────────────┘
          │                    │                     │
          ▼                    ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                           │
│  /api/recipes       /api/media        /api/auth/[...nextauth]   │
│  /api/recipes/[id]  /api/ai/chat                                │
└─────────────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│      WEB APP         │      │      iOS APP         │
│   (Next.js SSR/CSR)  │      │  (SwiftUI Native)    │
│                      │      │                      │
│ • Public recipe view │      │ • Recipe viewer      │
│ • Admin CMS          │      │ • Hardcoded recipes  │
│ • AI Chat widget     │      │   (MVP - no API)     │
│ • Full CRUD          │      │ • Kitchen mode       │
│ • Direct DB access   │      │ • Fully offline      │
└──────────────────────┘      └──────────────────────┘
```

### Web Application (Next.js)
- **Role:** Primary platform for both public viewing and admin management.
- **Tech:** Next.js 16 (App Router), React 19, Tailwind CSS 4.
- **Capabilities:**
  - Full recipe CRUD (Create, Read, Update, Delete)
  - Admin authentication and dashboard
  - AI chatbot integration
  - Image uploads to Supabase Storage
  - Server-side rendering for SEO

### iOS Application (SwiftUI)
- **Role:** Native mobile companion optimized for kitchen use.
- **Tech:** SwiftUI, hardcoded recipe data (MVP), no networking required.
- **Capabilities (MVP):**
  - **View recipes** from hardcoded data (no API calls, no database)
  - Display recipe details: title, story, ingredients, instructions, images
  - Basic search/filter by category
  - Fully offline - no network dependency
- **Capabilities (Future V1):**
  - Connect to Next.js API for live recipe updates
  - Offline caching via SwiftData
  - "Kitchen Mode" with large text, screen-always-on
  - AI chatbot integration

### Key Difference: Web vs iOS

| Aspect | Web | iOS (MVP) |
|--------|-----|-----------|
| **Primary Use** | Admin CMS + Public browsing | Kitchen-side recipe viewing |
| **Auth** | NextAuth (admin login) | None (read-only public) |
| **Data Source** | Direct DB via Drizzle ORM | Hardcoded recipes (no API) |
| **Offline** | No | Yes (fully offline, no network) |
| **CRUD** | Full | Read-only (static data) |
| **AI Chat** | Yes | Future |
| **Network** | Required | Not required (MVP) |

### iOS Technical Implementation (MVP)

```swift
// Recipe model
struct Recipe: Identifiable {
    let id: Int
    let slug: String
    let title: String
    let description: String?
    let story: String?
    let servings: Int?
    let prepTime: Int?
    let cookTime: Int?
    let ingredients: [Ingredient]
    let instructions: [String]
    let tips: String?
    let coverImage: String?
    let category: String?
    let cuisine: String?
    let contributedBy: String?
}

// Hardcoded Recipe Data (MVP)
class RecipeService {
    static let shared = RecipeService()
    
    // All recipes hardcoded - no API calls needed
    let recipes: [Recipe] = [
        Recipe(id: 1, slug: "lucias-pizza-dough", title: "Lucia's Pizza Dough", ...),
        Recipe(id: 2, slug: "golden-milk", title: "Golden Milk", ...),
        // ... all 24 recipes hardcoded
    ]
    
    func getAllRecipes() -> [Recipe] {
        return recipes
    }
}
```

**Note:** For MVP, recipes are hardcoded directly in the iOS app. This eliminates:
- Network dependency
- API setup requirements
- Database connection needs
- Error handling for network failures

Future V1 will add API integration for live recipe updates.

---

## 5. User Journeys / Key Flows

### Flow 1: Admin Adds a New Recipe (Cursor Workflow)
1. Admin uses Cursor to edit recipe files directly (e.g., `scripts/seed-all-recipes.ts` or database).
2. Admin adds recipe data: title, description, story, ingredients, instructions, media URLs.
3. Admin runs seed script or updates database via Cursor.
4. Recipe appears on the public site immediately.
5. **Alternative (Optional):** Admin uses web dashboard at `/admin/recipes/new` if preferred.

**Note:** Primary workflow is direct file editing via Cursor. Web CMS is optional convenience feature.

### Flow 2: Family Member Views a Recipe (Web)
1. User visits the homepage (`/`).
2. User browses the categorized recipe grid.
3. User clicks on "Lucia's Pizza Dough."
4. User views the full recipe page with story, ingredients, and steps.
5. User optionally opens the AI chat to ask "How do I scale this for 12 people?"

### Flow 3: Cook Uses the iOS App in the Kitchen (iOS MVP)
1. Cook opens the Tré Kante app on their iPhone.
2. App displays hardcoded recipe list (no network needed).
3. Cook taps "Lucia's Pizza Dough."
4. Recipe detail screen shows ingredients and step-by-step instructions.
5. Cook follows along, scrolling with one hand.
6. App works completely offline - no internet required.

### Flow 4: Order Ingredients via Instacart (Web + iOS)
1. User views a recipe detail page.
2. User clicks "Order Ingredients" button.
3. System parses recipe ingredients and matches them to Instacart products.
4. User confirms Instacart account connection (one-time OAuth).
5. System creates Instacart cart with all ingredients.
6. User is redirected to Instacart to review cart and checkout.
7. Ingredients are delivered to the family's address.

### Flow 5: Legacy Recipe Import (Future)
1. Admin uploads a photo of a handwritten recipe card.
2. System uses OCR/AI to extract text.
3. Admin reviews and corrects the parsed content.
4. Admin publishes the recipe.

---

## 6. Functional Requirements

### P0 — MVP (Must Have)

| ID | Requirement | Platform | Notes |
|----|-------------|----------|-------|
| F-001 | Create/Edit/Delete recipes via Admin UI | Web | CRUD operations (optional - Cursor is primary CMS) |
| F-002 | Display recipe list with category filters | Web | Homepage grid |
| F-003 | Display full recipe detail page | Web | `/recipes/[slug]` |
| F-004 | Upload and display recipe images | Web | Supabase Storage |
| F-005 | Admin authentication (login/logout) | Web | NextAuth credentials |
| F-006 | **View recipe list** | iOS | Hardcoded recipes (no API) |
| F-007 | **View recipe detail** | iOS | Title, ingredients, instructions |
| F-008 | Responsive design for mobile web | Web | Touch-friendly |

### P1 — V1 (Should Have)

| ID | Requirement | Platform | Notes |
|----|-------------|----------|-------|
| F-101 | AI chatbot for recipe Q&A | Web | Scaling, substitutions |
| F-102 | Search recipes by keyword | Web + iOS | Title, ingredients |
| F-103 | Filter by cuisine type | Web + iOS | Italian, Mexican, etc. |
| F-104 | "Family Stories" page | Web | `/family` route |
| F-105 | Connect iOS app to API for live updates | iOS | Replace hardcoded with API calls |
| F-106 | "Kitchen Mode" (large text, screen-on) | iOS | Accessibility |
| F-107 | **Order ingredients via Instacart** | Web + iOS | One-click grocery ordering |
| F-108 | **Weight-based measurements** | Web + iOS | Optional weight (g/oz) for ingredients |
| F-109 | **Dynamic recipe scaling** | Web + iOS | 0.5x, 1.5x, 2x, 3x scaling |

### P2 — V2 (Nice to Have)

| ID | Requirement | Platform | Notes |
|----|-------------|----------|-------|
| F-201 | OCR import from recipe card photos | Web | Vision API |
| F-202 | Print-friendly recipe view | Web | CSS print styles |
| F-203 | Recipe version history | Web | Track edits |
| F-204 | AI chatbot in iOS | iOS | Native integration |
| F-205 | Instacart product matching refinement | Web + iOS | AI-powered ingredient matching |
| F-206 | Multiple grocery service support | Web + iOS | Add Amazon Fresh, Whole Foods, etc. |
| F-207 | **Photo galleries** for recipes | Web + iOS | Multiple images per recipe |
| F-208 | **Video support** (embedded videos) | Web + iOS | Support video instructions |
| F-209 | **YouTube integration** | Web + iOS | Embed YouTube videos (e.g., Mochi Donuts recipe video) |
| F-210 | **Media carousel** on recipe pages | Web + iOS | Swipeable image/video gallery |
| F-211 | **In-app camera/video capture** | iOS | Snap photos/videos while cooking |
| F-212 | **Media sharing** | Web + iOS | Share captured photos/videos with all users |

---

## 7. Non-Functional Requirements

### Performance
- Web: LCP < 2.5s, FID < 100ms (Core Web Vitals).
- iOS: App launch to content < 2s on iPhone 12+.
- API: Recipe list endpoint < 500ms p95.

### Reliability
- 99.5% uptime for web (Vercel SLA).
- iOS app gracefully handles network failures with cached content (V1).

### Accessibility
- Web: WCAG 2.1 AA compliance.
- iOS: VoiceOver support, Dynamic Type support.
- Both: High contrast mode for kitchen glare.

### Privacy & Security
- Admin credentials hashed with bcrypt.
- API routes protected by NextAuth middleware.
- No PII stored beyond admin email/name.
- Supabase RLS policies for storage.

### Observability
- Vercel Analytics for web traffic.
- Error tracking via Vercel (built-in).
- iOS: Xcode Instruments for performance profiling.

---

## 8. Data Model

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   media     │       │   recipes   │       │ instacart_ │
│             │       │             │       │             │       │   accounts │
├─────────────┤       ├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │◄──────│ uploaded_by │       │ slug        │       │ user_id (FK)│
│ name        │       │ filename    │       │ title       │       │ access_token│
│ role        │       │ url         │       │ description │       │ refresh_    │
│ password_   │       │ mime_type   │       │ story       │       │   token     │
│   hash      │       │ size        │       │ servings    │       │ expires_at  │
│ created_at  │       │ alt_text    │       │ prep_time   │       │ created_at  │
└─────────────┘       │ created_at  │       │ cook_time   │       │ updated_at  │
                      └─────────────┘       │ ingredients │       └─────────────┘
                                            │ instructions│
                                            │ tips        │
                                            │ cover_image │
                                            │ category    │
                                            │ cuisine     │
                                            │ tags        │
                                            │ contributed_│
                                            │   by        │
                                            │ family_photo│
                                            │ images (V2) │
                                            │ videos (V2) │
                                            │ published   │
                                            │ created_at  │
                                            │ updated_at  │
                                            └─────────────┘
```

### Key Fields

**recipes.ingredients** (JSONB):
```json
[
  { 
    "amount": "500g", 
    "name": "bread flour", 
    "weightValue": 500, 
    "weightUnit": "g", 
    "notes": "00 flour preferred" 
  },
  { 
    "amount": "7g", 
    "name": "instant yeast",
    "weightValue": 7,
    "weightUnit": "g"
  },
  { 
    "amount": "10g", 
    "name": "salt",
    "weightValue": 10,
    "weightUnit": "g"
  }
]
```

**recipes.instructions** (JSONB):
```json
[
  "Combine flour, yeast, and salt in a large bowl.",
  "Add warm water and mix until a shaggy dough forms.",
  "Knead for 10 minutes until smooth and elastic."
]
```

**recipes.images** (JSONB - V2):
```json
[
  { "url": "https://...", "alt": "Dough mixing step", "order": 1 },
  { "url": "https://...", "alt": "Finished pizza", "order": 2 }
]
```

**recipes.videos** (JSONB - V2):
```json
[
  { "url": "https://youtube.com/watch?v=...", "type": "youtube", "thumbnail": "https://...", "order": 1 },
  { "url": "https://...", "type": "direct", "order": 2 }
]
```

### Data Retention
- Recipes: Retained indefinitely (family heirloom).
- Media: Retained indefinitely; orphaned media cleaned quarterly.
- Users: Retained while active; soft-delete for deactivation.
- Instacart OAuth tokens: Retained until user disconnects account; encrypted in database.

---

## 9. Integrations / External Dependencies

| Service | Purpose | Required | Notes |
|---------|---------|----------|-------|
| **Supabase** | PostgreSQL database + Storage | Yes | Shared project (Dev Studio), `family_recipes` schema |
| **Vercel** | Web hosting + serverless functions | Yes | Shared account (Dev Studio) |
| **NextAuth.js** | Authentication | Yes | Web only |
| **OpenAI API** | AI chatbot (GPT-4o-mini) | Yes (P1) | Web only |
| **Instacart API** | Grocery delivery integration | Yes (P1) | OAuth + Cart API |
| **Apple App Store** | iOS distribution | Yes (for iOS) | MVP: No network dependencies |

---

## 10. Permissions / Roles / Auth

### Roles

| Role | Web Permissions | iOS Permissions |
|------|-----------------|-----------------|
| **Public** | View published recipes | View all recipes |
| **Admin** | Full CRUD, publish/unpublish | N/A (no login) |

### Auth Flow (Web)
1. User navigates to `/login`.
2. Enters email + password.
3. NextAuth validates against `users` table (bcrypt).
4. Session cookie set; middleware protects `/admin/*` routes.

### Auth Flow (iOS MVP)
- **No authentication required.** iOS app is read-only and fetches only published recipes from the public API.

---

## 11. UX Notes

### Web Design
- **Aesthetic:** Warm, inviting, "restaurant menu" feel.
- **Typography:** Serif for headings (Playfair Display), sans-serif for body (Inter).
- **Color Palette:** Warm neutrals, terracotta accents.
- **Layout:** Card-based grid for recipe discovery.

### iOS Design
- **Aesthetic:** Clean, functional, kitchen-safe.
- **Typography:** SF Pro with Dynamic Type support.
- **Navigation:** Tab bar with "Recipes" and "Search."
- **Recipe Detail:** Sticky ingredient list, checkable steps (future), "Order Ingredients" button.

### Wireframe: Recipe Detail with Order Button (Web)

```
┌─────────────────────────────────┐
│  [Cover Image]                  │
├─────────────────────────────────┤
│ Lucia's Pizza Dough             │
│ Prep: 20 min  Cook: 15 min      │
│                                 │
│ [Order Ingredients] ← New button │
│                                 │
│ THE STORY                       │
│ This recipe has been in our...  │
│                                 │
│ INGREDIENTS                     │
│ • 500g bread flour              │
│ • 7g instant yeast              │
│                                 │
│ INSTRUCTIONS                    │
│ 1. Combine flour, yeast...      │
└─────────────────────────────────┘
```

### Wireframe: iOS Recipe Detail (ASCII)

```
┌─────────────────────────────────┐
│  ◀ Back       Lucia's Pizza     │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │      [Cover Image]          │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Prep: 20 min  Cook: 15 min      │
│ Servings: 4   Cuisine: Italian  │
│                                 │
│ ─────────────────────────────── │
│ THE STORY                       │
│ This recipe has been in our     │
│ family since Nonna Lucia...     │
│                                 │
│ ─────────────────────────────── │
│ INGREDIENTS                     │
│ • 500g bread flour              │
│ • 7g instant yeast              │
│ • 10g salt                      │
│ • 325ml warm water              │
│                                 │
│ ─────────────────────────────── │
│ INSTRUCTIONS                    │
│ 1. Combine flour, yeast, salt   │
│ 2. Add warm water and mix       │
│ 3. Knead for 10 minutes         │
│                                 │
└─────────────────────────────────┘
```

---

## 12. Analytics / Success Metrics

### KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Recipes digitized | 50+ by V1 | DB count |
| Weekly active users (web) | 10+ family members | Vercel Analytics |
| iOS app downloads | All family members | App Store Connect |
| AI chat sessions | 5+/week | API logs |

### Event Tracking (Web)

| Event | Trigger |
|-------|---------|
| `recipe_viewed` | Recipe detail page load |
| `recipe_created` | Admin saves new recipe |
| `chat_message_sent` | User sends AI chat message |
| `search_performed` | User searches recipes |
| `instacart_order_initiated` | User clicks "Order Ingredients" |
| `instacart_cart_created` | Cart successfully created in Instacart |
| `instacart_oauth_connected` | User successfully connects Instacart account |

---

## 13. Edge Cases & Failure Modes

| Scenario | Handling |
|----------|----------|
| **Network failure (iOS)** | Show cached recipes (V1); show error state (MVP) |
| **Image upload fails** | Retry with exponential backoff; show error toast |
| **AI chat timeout** | Return graceful error: "I'm having trouble thinking right now." |
| **Empty recipe list** | Show friendly empty state: "No recipes yet. Time to add some!" |
| **Invalid slug** | 404 page with link back to recipe list |
| **Large image upload** | Client-side compression before upload (P1) |
| **Instacart product not found** | Show warning, allow manual addition or skip ingredient |
| **Instacart OAuth failure** | Show error, allow retry, fallback to manual cart link |
| **Ingredient parsing fails** | Use ingredient name as-is, let user edit in Instacart |

---

## 14. Risks, Open Questions, Out-of-Scope

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Recipe data loss | Low | High | Regular Supabase backups |
| iOS App Store rejection | Medium | Medium | Follow HIG guidelines |
| OpenAI API cost overrun | Low | Low | Rate limiting + caching |
| Instacart Partner Program approval | Medium | High | Apply early; fallback to manual cart link with pre-filled items if not approved |
| Ingredient matching accuracy | Medium | Medium | Use AI for smart matching; allow user to review/edit before ordering |

### Open Questions
1. Should the iOS app ever support recipe creation? (Current answer: No, web-only for MVP/V1)
2. Do we need multi-language support? (Current answer: English only)
3. Should we support video instructions? (Current answer: Out of scope)
4. Does Instacart have a public API for cart creation? (Current answer: Need to research Instacart Partner API)
5. Should we support multiple Instacart accounts or one shared family account? (Current answer: One shared account for simplicity)

### Out-of-Scope
- Recipe sharing to social media.
- Nutritional information calculation.
- Shopping list generation (replaced by Instacart integration).
- Voice assistant integration (Siri, Alexa).
- Multiple Instacart accounts (family uses one shared account).
- Complex web CMS (Cursor is the primary CMS via direct file editing).

---

## 15. Release Plan

### MVP (Phase 1)
**Goal:** Functional recipe website + basic iOS viewer.

**Web Deliverables:**
- [x] Database schema (`db/schema.ts`)
- [ ] Admin recipe CRUD UI
- [ ] Public recipe grid homepage
- [ ] Recipe detail pages
- [ ] Image upload to Supabase

**iOS Deliverables:**
- [ ] Recipe list view (fetch from API)
- [ ] Recipe detail view
- [ ] Basic navigation (list → detail)

### V1 (Phase 2)
**Goal:** Polished experience with AI and offline support.

**Web Deliverables:**
- [ ] AI chatbot integration
- [ ] Search and filter
- [ ] Family stories page

**iOS Deliverables:**
- [ ] Offline caching (SwiftData)
- [ ] Kitchen Mode
- [ ] Search functionality
- [ ] Instacart ordering integration

### V2 (Phase 3)
**Goal:** Advanced features and media support.

- [ ] OCR recipe import
- [ ] Print-friendly views
- [ ] Recipe versioning
- [ ] Instacart integration (if not in V1)
- [ ] Photo galleries (multiple images per recipe)
- [ ] Video support (embedded videos in instructions)
- [ ] YouTube integration (embed YouTube videos, e.g., Mochi Donuts recipe video)
- [ ] Media carousel on recipe detail pages

---

## 16. Epics & User Stories

### Epic 1: Recipe Data Foundation
**Goal:** Establish the database and API layer for recipe storage using Dev Studio pattern.

**In Scope:** Database schema (in `family_recipes` schema), API routes, data validation.  
**Out of Scope:** Frontend UI.  
**Dependencies:** Supabase project setup (shared Dev Studio project), schema creation.  
**Key Files:** `db/schema.ts` (uses `family_recipes` schema), `app/api/recipes/route.ts`, `app/api/recipes/[id]/route.ts`, `scripts/create-schema.ts`  
**Definition of Done:** All CRUD operations work via API; schema matches PRD; tables exist in `family_recipes` schema (not `public`).  
**Note:** For Instacart integration (Epic 8), will need to add `instacart_accounts` table to store OAuth tokens.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 1.1 | As an API consumer, I want to `GET /api/recipes` to retrieve all published recipes, so that clients can display the recipe list. | P0 | S | BE |
| 1.2 | As an API consumer, I want to `GET /api/recipes/[id]` to retrieve a single recipe, so that clients can display recipe details. | P0 | S | BE |
| 1.3 | As an Admin, I want to `POST /api/recipes` to create a new recipe, so that I can add family recipes. | P0 | M | BE |
| 1.4 | As an Admin, I want to `PATCH /api/recipes/[id]` to update a recipe, so that I can correct mistakes. | P0 | M | BE |
| 1.5 | As an Admin, I want to `DELETE /api/recipes/[id]` to remove a recipe, so that I can clean up the database. | P1 | S | BE |

**Acceptance Criteria (1.1):**
- Given the API is running
- When I call `GET /api/recipes`
- Then I receive a JSON array of recipes with `id`, `slug`, `title`, `coverImage`, `category`
- And only `published: true` recipes are returned

---

### Epic 2: Admin Dashboard (Optional - Cursor is Primary CMS)
**Goal:** Optional web-based CMS for recipe management. **Note:** Primary workflow is direct file editing via Cursor.

**In Scope:** Recipe list view (read-only), optional create/edit forms, image upload.  
**Out of Scope:** Bulk operations, analytics dashboard.  
**Dependencies:** Epic 1 (API).  
**Key Files:** `app/admin/recipes/page.tsx`, `app/admin/recipes/new/page.tsx` (optional), `app/admin/recipes/[id]/page.tsx` (optional)  
**Definition of Done:** Admin can optionally use web UI to manage recipes, but Cursor/direct file editing remains the primary workflow.

**Workflow Philosophy:**
- **Primary:** Edit recipes directly in code (e.g., `scripts/seed-all-recipes.ts`) via Cursor
- **Secondary:** Optional web UI for quick edits or non-technical family members
- **Rationale:** Cursor provides AI-assisted editing, version control via git, and direct database access

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 2.1 | As an Admin, I want to see a list of all recipes (draft + published), so that I can view what's in the database. | P1 | S | FE |
| 2.2 | As an Admin, I want an optional form to create a new recipe, so that non-technical family members can add recipes. | P2 | L | Full-stack |
| 2.3 | As an Admin, I want to upload images via web UI, so that I can add photos without using Cursor. | P2 | M | Full-stack |
| 2.4 | As an Admin, I want to edit recipes via web UI, so that I can make quick fixes. | P2 | M | FE |
| 2.5 | As an Admin, I want to toggle a recipe's "published" status, so that I can control what's public. | P1 | S | FE |
| 2.6 | As an Admin, I want to delete a recipe with confirmation, so that I don't accidentally lose data. | P2 | S | FE |

**Acceptance Criteria (2.2):**
- Given I am logged in as Admin
- When I navigate to `/admin/recipes/new`
- Then I see a form with: title, slug (auto-generated), description, story, servings, prep_time, cook_time, ingredients (dynamic list), instructions (dynamic list), category (dropdown), cuisine, tags, contributed_by
- And when I submit, the recipe is saved to the database
- And I am redirected to the recipe list with a success message

---

### Epic 3: Public Recipe Experience (Web)
**Goal:** A beautiful, browsable recipe website.

**In Scope:** Homepage grid, recipe detail page, category filtering.  
**Out of Scope:** User accounts, commenting.  
**Dependencies:** Epic 1 (API), Epic 2 (content exists).  
**Key Files:** `app/page.tsx`, `app/recipes/page.tsx`, `app/recipes/[slug]/page.tsx`  
**Definition of Done:** Visitors can browse and view recipes with a polished UI.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 3.1 | As a Visitor, I want to see a grid of recipes on the homepage, so that I can discover what's available. | P0 | M | FE |
| 3.2 | As a Visitor, I want to filter recipes by category (appetizer, main, dessert, etc.), so that I can find what I need. | P0 | S | FE |
| 3.3 | As a Visitor, I want to view a recipe's full details on its own page, so that I can cook it. | P0 | M | FE |
| 3.4 | As a Visitor, I want to see the "story" behind a recipe, so that I connect with the family history. | P1 | S | FE |
| 3.5 | As a Visitor, I want the site to be mobile-responsive, so that I can use it on my phone. | P0 | M | FE |

**Acceptance Criteria (3.3):**
- Given I am on the recipes page
- When I click on a recipe card
- Then I am navigated to `/recipes/[slug]`
- And I see: title, cover image, story, prep/cook time, servings, ingredients list, numbered instructions, tips, contributed by

---

### Epic 4: iOS Recipe Viewer (MVP)
**Goal:** A native iOS app that displays hardcoded recipes (no API, fully offline).

**In Scope:** Recipe list, recipe detail, basic navigation, hardcoded recipe data.  
**Out of Scope:** Authentication, API integration, offline caching (not needed - already offline), AI chat.  
**Dependencies:** None (recipes are hardcoded).  
**Key Files:** `family-recipes/family-recipes/Recipe.swift`, `RecipeListView.swift`, `RecipeDetailView.swift`, `RecipeService.swift` (with hardcoded data).  
**Definition of Done:** User can launch app, see recipe list from hardcoded data, tap to view details. App works completely offline.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 4.1 | As a Cook, I want the app to display a list of all recipes, so that I can see what's available. | P0 | M | iOS |
| 4.2 | As a Cook, I want to tap a recipe to see its full details, so that I can follow it while cooking. | P0 | L | iOS |
| 4.3 | As a Cook, I want to see the cover image for each recipe, so that I can visually identify dishes. | P0 | S | iOS |
| 4.4 | As a Cook, I want the app to work without internet, so that I can use it in the kitchen. | P0 | S | iOS |
| 4.5 | As a Cook, I want to search/filter recipes by category, so that I can find what I need quickly. | P0 | M | iOS |

**Acceptance Criteria (4.1):**
- Given I launch the iOS app
- When the app loads
- Then I see a list of all 24 recipes immediately (no loading, no network)
- And each recipe shows: title, category, cover image (if available)
- And the app works completely offline

**Acceptance Criteria (4.2):**
- Given I am viewing the recipe list
- When I tap on "Lucia's Pizza Dough"
- Then I see a detail screen with:
  - Cover image (if available)
  - Title
  - Prep time, cook time, servings
  - Story section
  - Ingredients list with amounts
  - Numbered instructions
  - "Contributed by" attribution
- And I can scroll to see all content
- And I can tap "Back" to return to the list
- And all data comes from hardcoded recipes (no API calls)

---

### Epic 5: Authentication & Security
**Goal:** Protect admin functionality with secure authentication.

**In Scope:** Login page, session management, route protection.  
**Out of Scope:** OAuth providers, password reset.  
**Dependencies:** None.  
**Key Files:** `lib/auth.ts`, `app/login/page.tsx`, `middleware.ts`  
**Definition of Done:** Only authenticated admins can access `/admin/*` routes.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 5.1 | As an Admin, I want to log in with email and password, so that I can access the dashboard. | P0 | M | Full-stack |
| 5.2 | As an Admin, I want to be redirected to login if I access `/admin` without a session, so that the dashboard is protected. | P0 | S | BE |
| 5.3 | As an Admin, I want to log out, so that my session is ended. | P0 | S | FE |

**Acceptance Criteria (5.1):**
- Given I am on `/login`
- When I enter valid admin credentials
- Then I am redirected to `/admin/dashboard`
- And my session cookie is set
- Given I enter invalid credentials
- Then I see an error message "Invalid email or password"

---

### Epic 6: Media Management
**Goal:** Handle image uploads and storage.

**In Scope:** Upload to Supabase, URL generation, display.  
**Out of Scope:** Image editing, video support.  
**Dependencies:** Supabase Storage bucket configured.  
**Key Files:** `app/api/media/route.ts`, Supabase Storage policies.  
**Definition of Done:** Admins can upload images that are stored and served via CDN.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 6.1 | As an Admin, I want to upload an image file, so that I can add visuals to recipes. | P0 | M | Full-stack |
| 6.2 | As a Visitor, I want recipe images to load quickly, so that the site feels fast. | P0 | S | Infra |
| 6.3 | As an Admin, I want to see a preview of uploaded images before saving, so that I confirm the right file. | P1 | S | FE |

**Acceptance Criteria (6.1):**
- Given I am on the recipe create/edit form
- When I select an image file (jpg, png, webp) under 5MB
- Then the image is uploaded to Supabase Storage
- And the URL is saved to `cover_image` field
- And I see the image preview in the form

---

### Epic 7: AI Recipe Assistant (P1)
**Goal:** Provide an AI chatbot for recipe-related questions.

**In Scope:** Scaling, substitutions, technique explanations.  
**Out of Scope:** General conversation, recipe generation from scratch.  
**Dependencies:** OpenAI API key.  
**Key Files:** `app/api/ai/chat/route.ts`, `components/ai/chat-widget.tsx`, `lib/recipe-knowledge.ts`  
**Definition of Done:** Users can ask the chatbot cooking questions and get helpful responses.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 7.1 | As a Cook, I want to ask "How do I scale this for 8 people?", so that I can adjust quantities. | P1 | L | Full-stack |
| 7.2 | As a Cook, I want to ask "What can I substitute for eggs?", so that I can adapt recipes. | P1 | M | BE |
| 7.3 | As a Cook, I want a floating chat button on recipe pages, so that I can easily access help. | P1 | S | FE |

**Acceptance Criteria (7.1):**
- Given I am viewing a recipe with 4 servings
- When I open the chat and ask "Scale this for 8 people"
- Then the AI responds with adjusted ingredient quantities
- And the response is formatted clearly with the new amounts

---

### Epic 8: Instacart Grocery Ordering
**Goal:** Enable one-click ingredient ordering via Instacart integration.

**In Scope:** Instacart OAuth, ingredient parsing, product matching, cart creation, redirect to Instacart checkout.  
**Out of Scope:** Multiple grocery services, cart editing in-app, order tracking.  
**Dependencies:** Instacart API access, OAuth setup.  
**Key Files:** `app/api/instacart/route.ts`, `app/api/instacart/cart/route.ts`, `lib/instacart.ts`, `components/order-button.tsx`  
**Definition of Done:** User can click "Order Ingredients" on a recipe page, connect Instacart account, and be redirected to Instacart with a pre-filled cart.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 8.1 | As a Cook, I want to click "Order Ingredients" on a recipe page, so that I can quickly get all ingredients delivered. | P1 | L | Full-stack |
| 8.2 | As a Cook, I want to connect my Instacart account once, so that I don't have to authenticate every time. | P1 | M | Full-stack |
| 8.3 | As a Cook, I want the system to match recipe ingredients to Instacart products, so that the cart is accurate. | P1 | L | BE |
| 8.4 | As a Cook, I want to see a preview of items before ordering, so that I can verify the cart. | P1 | M | FE |
| 8.5 | As a Cook, I want to be redirected to Instacart to complete checkout, so that I can use my saved payment and address. | P1 | S | FE |
| 8.6 | As a Cook, I want the system to handle ingredient parsing (e.g., "2 cups flour" → "2x All-Purpose Flour"), so that quantities are correct. | P1 | M | BE |
| 8.7 | As a Cook, I want to order ingredients from the iOS app, so that I can order while viewing recipes on my phone. | P1 | M | iOS |

**Acceptance Criteria (8.1):**
- Given I am viewing a recipe detail page
- When I click "Order Ingredients" button
- Then the system parses all ingredients from the recipe
- And matches them to Instacart products
- And creates a cart in Instacart
- And redirects me to Instacart checkout page
- And all ingredients are in the cart with correct quantities

**Acceptance Criteria (8.3):**
- Given a recipe ingredient "2 cups all-purpose flour"
- When the system processes it
- Then it searches Instacart for "all-purpose flour"
- And selects the best match (brand preference if available)
- And adds quantity "2" with unit conversion if needed
- And handles edge cases (e.g., "to taste" = skip, "optional" = skip)

**Technical Notes:**
- **Instacart Connect API** - Instacart has a Partner Program with OAuth 2.0 authentication
- Requires onboarding to Instacart Partner Program to get client ID/secret
- OAuth tokens valid for 24 hours; implement token refresh logic
- Use Instacart's Cart API endpoints to add items programmatically
- Store Instacart OAuth tokens securely (encrypted in `instacart_accounts` table)
- Product matching: Use Instacart Search API + fuzzy matching algorithm
- Handle unit conversions (cups → oz, grams → oz, etc.) via conversion library
- Fallback: If product not found, add as "custom item" with ingredient name or skip
- Webhooks: Configure Instacart webhooks for order status updates (optional)
- **API Docs:** https://docs.instacart.com/connect/ (requires Partner Program access)

---

## 17. Verification Checklist

### PRD → Epic Mapping

| PRD Requirement | Epic | Stories |
|-----------------|------|---------|
| F-001: Recipe CRUD | Epic 1, 2 | 1.1-1.5, 2.1-2.6 (Epic 2 optional - Cursor is primary) |
| F-207: Photo galleries | Epic 9 | 9.1, 9.4 |
| F-208: Video support | Epic 9 | 9.2 |
| F-209: YouTube integration | Epic 9 | 9.3, 9.5 |
| F-108: Weight measurements | Epic 10 | 10.1, 10.2 |
| F-109: Recipe scaling | Epic 10 | 10.3, 10.4 |
| F-211: Camera capture | Epic 11 | 11.1, 11.2 |
| F-212: Media sharing | Epic 11 | 11.3 |
| F-002: Recipe list with filters | Epic 3 | 3.1, 3.2 |
| F-003: Recipe detail page | Epic 3 | 3.3, 3.4 |
| F-004: Image upload | Epic 6 | 6.1-6.3 |
| F-005: Admin auth | Epic 5 | 5.1-5.3 |
| F-006: iOS recipe list | Epic 4 | 4.1, 4.3, 4.5 |
| F-007: iOS recipe detail | Epic 4 | 4.2 |
| F-008: iOS offline capability | Epic 4 | 4.4 (built-in with hardcoded data) |
| F-101: AI chatbot | Epic 7 | 7.1-7.3 |
| F-107: Instacart ordering | Epic 8 | 8.1-8.7 |

### Gaps / Further Discovery Needed

| Area | Gap | Action |
|------|-----|--------|
| **Recipe Import** | No Epic for OCR/import workflow | Create Epic 9 when prioritizing V2 |
| **iOS API Integration** | MVP uses hardcoded data, API integration not in scope | Add to Epic 4 for V1 |
| **Search** | Full-text search implementation details TBD | Spike: Evaluate Supabase full-text vs. Algolia |
| **Print View** | Not covered in current Epics | Add to Epic 3 for V2 |
| **Dev Studio Schema** | Ensure all DB operations use `family_recipes` schema | Verify in Epic 1 |
| **Instacart API** | Instacart Connect API exists; need Partner Program onboarding | Spike: Apply for Instacart Partner Program, review API docs |
| **Ingredient Parsing** | Complex parsing needed for "2 cups flour" → Instacart product | Consider using AI or parsing library |
| **Admin CMS** | Cursor is primary CMS; web dashboard is optional | Deprioritize Epic 2; focus on API + direct editing |

---

### Epic 9: Media Support (Photos, Videos, YouTube) - V2
**Goal:** Add rich media support to recipes including photo galleries, embedded videos, and YouTube integration.

**In Scope:** Multiple images per recipe, video embeds, YouTube video support, media carousel UI.  
**Out of Scope:** Video upload/editing, video hosting (use YouTube/external URLs).  
**Dependencies:** Database schema update, Supabase Storage for images.  
**Key Files:** `db/schema.ts` (add `images`, `videos` fields), `app/recipes/[slug]/page.tsx` (media carousel), `components/recipe-media.tsx`  
**Definition of Done:** Recipes can display multiple photos, embedded videos, and YouTube videos (e.g., Mochi Donuts recipe video).

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 9.1 | As a Cook, I want to see multiple photos of a recipe, so that I can see different steps or angles. | P2 | M | Full-stack |
| 9.2 | As a Cook, I want to watch embedded videos in recipe instructions, so that I can see techniques demonstrated. | P2 | M | Full-stack |
| 9.3 | As a Cook, I want to watch YouTube videos linked to recipes (e.g., Mochi Donuts), so that I can follow along with video tutorials. | P2 | S | FE |
| 9.4 | As a Cook, I want a swipeable media carousel on recipe pages, so that I can browse photos and videos easily. | P2 | M | FE |
| 9.5 | As an Admin, I want to add YouTube video URLs to recipes via Cursor, so that I can link to recipe videos. | P2 | S | Docs/Data |

**Acceptance Criteria (9.3):**
- Given I am viewing the Mochi Donuts recipe
- When the recipe has a YouTube video URL
- Then I see an embedded YouTube player on the recipe page
- And I can play the video without leaving the page
- And the video is responsive and works on mobile

**Technical Notes:**
- Add `images` JSONB field to recipes schema: `Array<{url: string, alt: string, order: number}>`
- Add `videos` JSONB field: `Array<{url: string, type: 'youtube' | 'direct', thumbnail?: string, order: number}>`
- Use YouTube embed API: `https://www.youtube.com/embed/{videoId}`
- Extract video ID from YouTube URLs (handle various formats)
- Use React/Next.js Image component for optimized photo loading
- Implement swipeable carousel using Swiper.js or native iOS UIPageViewController

---

### Epic 10: Kitchen Utilities (Weight & Scaling)
**Goal:** Enhance the cooking experience with precise measurements and easy recipe adjustments.

**In Scope:** Weight fields for ingredients, scaling logic (multiplication/division), UI for toggling weight view, UI for selecting scale factor.  
**Out of Scope:** Automatic unit conversion (e.g., cups to grams) without pre-defined weight data.  
**Dependencies:** Database schema update (added `weightValue`, `weightUnit`).  
**Key Files:** `db/schema.ts`, `app/recipes/[slug]/page.tsx`, `RecipeDetailView.swift`  
**Definition of Done:** Users can toggle between volume/amount and weight for ingredients (where available) and scale the entire recipe by common factors (0.5x, 1.5x, 2x, 3x).

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 10.1 | As a Cook, I want to see ingredient weights (g/oz), so that I can use a kitchen scale for precision. | P1 | S | Full-stack |
| 10.2 | As a Cook, I want to toggle between "Standard" and "Weight" views, so that I can choose my preferred measuring method. | P1 | S | FE |
| 10.3 | As a Cook, I want to scale a recipe (e.g., 2x, 0.5x), so that I can adjust for the number of people I'm feeding. | P1 | M | Full-stack |
| 10.4 | As a Cook, I want the ingredient amounts to update instantly when I change the scale, so that I don't have to do mental math. | P1 | S | FE |

---

### Epic 11: In-App Media Capture (Camera/Video)
**Goal:** Allow users to document their cooking process and share it with the family.

**In Scope:** iOS camera integration, photo capture, short video capture, upload to Supabase Storage, association with specific recipes.  
**Out of Scope:** Video editing, live streaming.  
**Dependencies:** Epic 6 (Media Management), Epic 9 (Media Support).  
**Key Files:** `RecipeDetailView.swift`, `CameraService.swift` (new), `app/api/media/route.ts`  
**Definition of Done:** Users can snap a photo or record a short video directly from a recipe page in the iOS app, and it is saved and shared with other family members.

#### Stories

| ID | Story | Priority | Size | Type |
|----|-------|----------|------|------|
| 11.1 | As a Cook, I want to snap a photo of my dish while in a recipe, so that I can document my progress. | P2 | M | iOS |
| 11.2 | As a Cook, I want to record a short video of a technique, so that I can show others how I did it. | P2 | L | iOS |
| 11.3 | As a Cook, I want my captured media to be shared with all family members, so that we can see each other's creations. | P2 | M | Full-stack |
| 11.4 | As an Admin, I want to moderate captured media, so that the gallery stays clean and relevant. | P2 | S | Web |

---

## Appendix A: Existing Repository Structure

```
family-recipes/
├── app/
│   ├── admin/           # Admin dashboard routes
│   ├── api/             # API routes (recipes, media, auth, ai)
│   ├── login/           # Login page
│   ├── recipes/         # Public recipe pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── ai/              # Chat widget
│   └── ui/              # Button, Input, etc.
├── db/
│   ├── index.ts         # Drizzle connection
│   └── schema.ts        # Database schema
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── recipe-knowledge.ts  # AI system prompt
│   └── utils.ts         # Utilities
├── family-recipes/      # iOS Xcode project
│   └── family-recipes/
│       ├── ContentView.swift
│       └── Item.swift   # Boilerplate (to be replaced)
├── recipes/             # Sample recipe JSON + images
└── recipes-to-import/   # Legacy content to digitize
```

---

## Appendix B: API Contracts

### GET /api/recipes

**Response:**
```json
[
  {
    "id": 1,
    "slug": "lucias-pizza-dough",
    "title": "Lucia's Pizza Dough",
    "description": "The family's legendary pizza dough recipe",
    "coverImage": "https://xxx.supabase.co/storage/v1/object/public/recipe-images/pizza.jpg",
    "category": "main",
    "cuisine": "italian",
    "contributedBy": "Nonna Lucia"
  }
]
```

### GET /api/recipes/[id]

**Response:**
```json
{
  "id": 1,
  "slug": "lucias-pizza-dough",
  "title": "Lucia's Pizza Dough",
  "description": "The family's legendary pizza dough recipe",
  "story": "This recipe has been passed down through three generations...",
  "servings": 4,
  "prepTime": 20,
  "cookTime": 15,
  "ingredients": [
    { "amount": "500g", "name": "bread flour", "notes": "00 flour preferred" },
    { "amount": "7g", "name": "instant yeast" }
  ],
  "instructions": [
    "Combine flour, yeast, and salt in a large bowl.",
    "Add warm water and mix until a shaggy dough forms."
  ],
  "tips": "Let the dough rest overnight in the fridge for best flavor.",
  "coverImage": "https://xxx.supabase.co/storage/v1/object/public/recipe-images/pizza.jpg",
  "category": "main",
  "cuisine": "italian",
  "tags": ["pizza", "bread", "italian"],
  "contributedBy": "Nonna Lucia",
  "familyPhoto": null,
  "published": true,
  "createdAt": "2026-01-26T12:00:00Z",
  "updatedAt": "2026-01-26T12:00:00Z"
}
```

---

*End of Document*
