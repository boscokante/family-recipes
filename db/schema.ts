import { pgTable, pgSchema, text, timestamp, boolean, serial, jsonb, integer } from 'drizzle-orm/pg-core'

// Create schema for family_recipes (Dev Studio pattern)
export const familyRecipesSchema = pgSchema('family_recipes')

// Users table for authentication and admin access
export const users = familyRecipesSchema.table('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('user'),
  image: text('image'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Media table for recipe images and family photos
export const media = familyRecipesSchema.table('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  mimeType: text('mime_type'),
  size: integer('size'),
  altText: text('alt_text'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Recipes table - main recipe content (defined before tables that reference it)
export const recipes = familyRecipesSchema.table('recipes', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  story: text('story'), // Family story behind the recipe
  servings: integer('servings'),
  prepTime: integer('prep_time'), // minutes
  cookTime: integer('cook_time'), // minutes
  ingredients: jsonb('ingredients').$type<Array<{
    amount: string
    name: string
    weightValue?: number
    weightUnit?: string // 'g', 'oz', etc.
    notes?: string
    isOriginal?: boolean // false if this is an adapted ingredient
    originalName?: string // store original if substituted
  }>>().default([]),
  instructions: jsonb('instructions').$type<string[]>().default([]),
  tips: text('tips'),
  coverImage: text('cover_image'), // URL to cover image
  category: text('category'), // 'appetizer', 'main', 'dessert', 'side', 'drink'
  cuisine: text('cuisine'), // 'italian', 'mexican', 'southern', etc.
  tags: jsonb('tags').$type<string[]>().default([]),
  contributedBy: text('contributed_by'), // Family member name
  familyPhoto: text('family_photo'), // URL to family photo
  sourceUrl: text('source_url'), // Original YouTube URL or other source
  originalRecipe: text('original_recipe'), // Store original before adaptation
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Videos table for YouTube and other video sources
export const videos = familyRecipesSchema.table('videos', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  type: text('type').default('youtube'), // 'youtube', 'direct', etc.
  thumbnail: text('thumbnail'),
  title: text('title'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Family members table for allergy tracking
export const familyMembers = familyRecipesSchema.table('family_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  allergies: jsonb('allergies').$type<string[]>().default([]), // List of allergens
  allergyDetails: jsonb('allergy_details').$type<{
    [key: string]: {
      severity: 'strict' | 'avoid' | 'intolerance'
      notes?: string
    }
  }>().default({}),
  substitutions: jsonb('substitutions').$type<{
    [key: string]: string // allergen -> preferred substitute
  }>().default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Recipe versions table for tracking allergy adaptations
export const recipeAdaptations = familyRecipesSchema.table('recipe_adaptations', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g., "Conte Family", "Bosko Safe", "Maya Safe"
  forFamilyMembers: jsonb('for_family_members').$type<number[]>().default([]), // family_members.id[]
  excludedAllergens: jsonb('excluded_allergens').$type<string[]>().default([]),
  ingredientSubstitutions: jsonb('ingredient_substitutions').$type<Array<{
    original: string
    substitute: string
    reason: string
  }>>().default([]),
  modifiedIngredients: jsonb('modified_ingredients').$type<Array<{
    amount: string
    name: string
    originalName?: string
    weightValue?: number
    weightUnit?: string
    notes?: string
    isSubstitution?: boolean
  }>>().default([]),
  notes: text('notes'),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type Media = typeof media.$inferSelect
export type Recipe = typeof recipes.$inferSelect
export type NewRecipe = typeof recipes.$inferInsert
export type Video = typeof videos.$inferSelect
export type NewVideo = typeof videos.$inferInsert
export type FamilyMember = typeof familyMembers.$inferSelect
export type NewFamilyMember = typeof familyMembers.$inferInsert
export type RecipeAdaptation = typeof recipeAdaptations.$inferSelect
export type NewRecipeAdaptation = typeof recipeAdaptations.$inferInsert
