/**
 * AI Recipe Extraction Service
 * Extracts recipes from YouTube video content and adapts them for family allergies
 */

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import {
  getKanteFamilySubstitutions,
  getSubstitutionsForMembers,
  getAllergensForMembers,
  adaptIngredients,
  generateAdaptationNotes,
  DEFAULT_FAMILY_MEMBERS
} from './allergies'

// Schema for extracted recipe
const recipeSchema = z.object({
  title: z.string().describe('The recipe title'),
  description: z.string().optional().describe('Brief description of the dish'),
  cuisine: z.string().optional().describe('Cuisine type (e.g., southern, italian, mexican)'),
  category: z.enum(['appetizer', 'main', 'dessert', 'side', 'drink', 'breakfast', 'bread']).optional(),
  servings: z.number().optional().describe('Number of servings'),
  prepTime: z.number().optional().describe('Prep time in minutes'),
  cookTime: z.number().optional().describe('Cook time in minutes'),
  ingredients: z.array(z.object({
    amount: z.string().describe('Quantity (e.g., "2 cups", "500g")'),
    name: z.string().describe('Ingredient name'),
    notes: z.string().optional().describe('Additional notes about the ingredient')
  })).describe('List of ingredients needed'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions. Must be an array of plain strings, NOT objects.'),
  tips: z.string().optional().describe('Cooking tips and notes'),
  story: z.string().optional().describe('Background/story about the recipe if available'),
  tags: z.array(z.string()).optional().describe('Tags for the recipe')
})

export type ExtractedRecipe = z.infer<typeof recipeSchema>

export interface AdaptedRecipe extends ExtractedRecipe {
  adaptedIngredients: Array<{
    amount: string
    name: string
    originalName?: string
    notes?: string
    isSubstitution?: boolean
  }>
  adaptationNotes: string
  excludedAllergens: string[]
  substitutionsMade: Array<{
    original: string
    substitute: string
    reason: string
  }>
}

/**
 * Extract recipe from video title and description
 * Uses AI to parse structured recipe data
 */
export async function extractRecipeFromVideo(
  videoTitle: string,
  videoDescription: string,
  channelName?: string,
  transcript?: string,
  linkedRecipeText?: string
): Promise<ExtractedRecipe> {
  const systemPrompt = `You are a recipe extraction assistant. Your task is to parse recipe information from YouTube video metadata (title, description, transcript) and optional linked recipe text.

Instructions:
1. Extract the recipe title, ingredients, and instructions from the provided content. Focus strongly on the description and any linked recipe text, as these are the most reliable. If those are missing or sparse, use the transcript.
2. If the content doesn't contain a clear recipe, try to infer from the available context.
3. Standardize ingredient amounts and names.
4. Create clear, numbered cooking instructions.
5. Identify cuisine type and category when possible.
6. If information is missing, make reasonable estimates or leave optional fields empty.

For ingredients:
- Use standard measurements (cups, tablespoons, teaspoons, grams, ounces)
- Be specific about ingredient names (e.g., "all-purpose flour" not just "flour")
- Include preparation notes in the notes field (e.g., "chopped", "melted")

For instructions:
- Write clear, actionable steps
- Include temperature and timing information
- Break complex steps into simpler ones if needed

Be thorough and accurate - this is for a family recipe collection!`

  const userPrompt = `Extract the recipe from this YouTube video context:

Title: ${videoTitle}
${channelName ? `Channel: ${channelName}\n` : ''}

Description:
${videoDescription || "No description available"}

${transcript ? `\nTranscript snippet:\n${transcript.substring(0, 10000)}` : ''}

${linkedRecipeText ? `\nLinked Recipe Text:\n${linkedRecipeText.substring(0, 10000)}` : ''}

Please extract all recipe information including ingredients with amounts and step-by-step instructions.`

  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: recipeSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2
    })

    return result.object
  } catch (error) {
    console.error('Error extracting recipe:', error)
    throw new Error('Failed to extract recipe from video content')
  }
}

/**
 * Adapt a recipe for family allergies
 */
export function adaptRecipeForFamily(
  recipe: ExtractedRecipe,
  memberIds?: number[]
): AdaptedRecipe {
  // Get substitutions for selected family members (or default to full Kante family)
  const substitutions = memberIds && memberIds.length > 0
    ? getSubstitutionsForMembers(memberIds)
    : getKanteFamilySubstitutions()

  const excludedAllergens = memberIds && memberIds.length > 0
    ? getAllergensForMembers(memberIds)
    : ['dairy', 'gluten', 'citrus', 'shellfish', 'cashew']

  // Adapt ingredients
  const adaptedIngredients = recipe.ingredients.map(ing => {
    const lowerName = ing.name.toLowerCase()

    // ===== SPECIAL HANDLING FIRST (order matters!) =====

    // Check buttermilk BEFORE butter to avoid false match
    if (lowerName.includes('buttermilk')) {
      return {
        amount: ing.amount,
        name: 'goat yogurt thinned with oat milk',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    // Sour cream → goat yogurt
    if (lowerName.includes('sour cream')) {
      return {
        amount: ing.amount,
        name: 'goat yogurt',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    // Regular butter (not buttermilk)
    if (lowerName.includes('butter') && !lowerName.includes('goat')) {
      return {
        amount: ing.amount,
        name: 'goat butter',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    // Milk (but not buttermilk which is handled above)
    if (lowerName.includes('milk') && !lowerName.includes('goat') && !lowerName.includes('coconut') && !lowerName.includes('almond') && !lowerName.includes('oat')) {
      return {
        amount: ing.amount,
        name: 'oat milk (almond milk as second choice)',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    if (lowerName.includes('cheese') && !lowerName.includes('goat')) {
      return {
        amount: ing.amount,
        name: 'goat cheese',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    if ((lowerName.includes('flour') || lowerName.includes('cornmeal')) && !lowerName.includes('gluten-free')) {
      const isCornmeal = lowerName.includes('cornmeal')
      return {
        amount: ing.amount,
        name: isCornmeal ? "Bob's Red Mill gluten-free cornmeal" : "Bob's Red Mill gluten-free 1-to-1 flour",
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    if (lowerName.includes('lemon') || lowerName.includes('lime')) {
      return {
        amount: ing.amount,
        name: 'lemongrass (safe - NOT related to citrus family)',
        originalName: ing.name,
        notes: ing.notes,
        isSubstitution: true
      }
    }

    // ===== FALLBACK: Check substitutions object =====
    // Sort keys by length (longest first) to avoid partial matches
    const sortedSubstitutions = Object.entries(substitutions).sort((a, b) => b[0].length - a[0].length)

    for (const [original, substitute] of sortedSubstitutions) {
      const lowerOriginal = original.toLowerCase()
      // Exact match or contains
      if (lowerName === lowerOriginal || lowerName.includes(lowerOriginal)) {
        return {
          amount: ing.amount,
          name: substitute,
          originalName: ing.name,
          notes: ing.notes,
          isSubstitution: true
        }
      }
    }

    // No substitution needed
    return {
      amount: ing.amount,
      name: ing.name,
      notes: ing.notes,
      isSubstitution: false
    }
  })

  // Track all substitutions made
  const substitutionsMade = adaptedIngredients
    .filter(ing => ing.isSubstitution && ing.originalName)
    .map(ing => ({
      original: ing.originalName!,
      substitute: ing.name,
      reason: getSubstitutionReason(ing.originalName!, excludedAllergens)
    }))

  // Generate adaptation notes
  const adaptationNotes = generateAdaptationNotesForRecipe(
    recipe.ingredients,
    adaptedIngredients,
    excludedAllergens,
    memberIds
  )

  // Adapt instructions to mention substitutions
  const adaptedInstructions = recipe.instructions.map(instruction => {
    let adapted = instruction

    // Replace mentions of substituted ingredients in instructions
    for (const ing of adaptedIngredients) {
      if (ing.isSubstitution && ing.originalName) {
        // Simple word replacement (case insensitive)
        const regex = new RegExp(`\\b${escapeRegExp(ing.originalName)}\\b`, 'gi')
        adapted = adapted.replace(regex, ing.name)

        // Also try singular/plural variations
        const singular = ing.originalName.replace(/s$/, '')
        const plural = ing.originalName + 's'
        adapted = adapted.replace(new RegExp(`\\b${escapeRegExp(singular)}\\b`, 'gi'), ing.name)
        adapted = adapted.replace(new RegExp(`\\b${escapeRegExp(plural)}\\b`, 'gi'), ing.name)
      }
    }

    return adapted
  })

  return {
    ...recipe,
    ingredients: adaptedIngredients.map(ing => ({
      amount: ing.amount,
      name: ing.name,
      notes: ing.notes
    })),
    adaptedIngredients,
    instructions: adaptedInstructions,
    adaptationNotes,
    excludedAllergens,
    substitutionsMade
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getSubstitutionReason(originalName: string, excludedAllergens: string[]): string {
  const lower = originalName.toLowerCase()
  const reasons: string[] = []

  if (lower.includes('butter')) {
    if (excludedAllergens.includes('dairy')) {
      reasons.push('dairy-free (goat butter)')
    }
  }

  if (lower.includes('buttermilk')) {
    if (excludedAllergens.includes('dairy')) {
      reasons.push('dairy-free (oat milk + vinegar)')
    }
  }

  if (lower.includes('milk') && !lower.includes('buttermilk')) {
    if (excludedAllergens.includes('dairy')) {
      reasons.push('dairy-free (oat milk)')
    }
  }

  if (lower.includes('cheese')) {
    if (excludedAllergens.includes('dairy')) {
      reasons.push('dairy-free (goat cheese)')
    }
  }

  if (lower.includes('cream') && !lower.includes('coconut') && !lower.includes('oat')) {
    if (excludedAllergens.includes('dairy')) {
      reasons.push('dairy-free (oat cream)')
    }
  }

  if (lower.includes('flour') || lower.includes('wheat') || lower.includes('gluten') || lower.includes('bread')) {
    if (excludedAllergens.includes('gluten')) {
      reasons.push('gluten-free')
    }
  }

  if (lower.includes('cornmeal') && !lower.includes('gluten-free')) {
    reasons.push('gluten-free cornmeal')
  }

  if (lower.includes('lemon') || lower.includes('lime') || lower.includes('citrus') || lower.includes('orange')) {
    if (excludedAllergens.includes('citrus')) {
      reasons.push('citrus-free (citric acid, NO lemon extract)')
    }
  }

  if (lower.includes('shrimp') || lower.includes('crab') || lower.includes('lobster') || lower.includes('prawn')) {
    if (excludedAllergens.includes('shellfish')) {
      reasons.push('shellfish-free')
    }
  }

  if (lower.includes('cashew')) {
    if (excludedAllergens.includes('cashew')) {
      reasons.push('cashew-free')
    }
  }

  return reasons.length > 0 ? reasons.join(', ') : 'family preference'
}

function generateAdaptationNotesForRecipe(
  originalIngredients: Array<{ name: string }>,
  adaptedIngredients: Array<{ name: string; originalName?: string; isSubstitution?: boolean }>,
  excludedAllergens: string[],
  memberIds?: number[]
): string {
  const changes: string[] = []

  for (let i = 0; i < originalIngredients.length; i++) {
    const adapted = adaptedIngredients[i]
    if (adapted.isSubstitution && adapted.originalName) {
      const reason = getSubstitutionReason(adapted.originalName, excludedAllergens)
      changes.push(`${adapted.originalName} → ${adapted.name} (${reason})`)
    }
  }

  // Get family member names
  let familyDesc = 'Kante Family'
  if (memberIds && memberIds.length > 0 && memberIds.length < DEFAULT_FAMILY_MEMBERS.length) {
    const names = memberIds
      .map(id => DEFAULT_FAMILY_MEMBERS[id - 1]?.name)
      .filter(Boolean)
      .join(', ')
    familyDesc = names
  }

  const allergenList = excludedAllergens.map(a => {
    if (a === 'dairy') return 'dairy (oat milk preferred, goat butter/cheese OK)'
    return a
  }).join(', ')

  if (changes.length === 0) {
    return `Recipe adapted for ${familyDesc}. No ingredient substitutions needed - recipe is already safe for: ${allergenList}.`
  }

  return `Recipe adapted for ${familyDesc}\nSafe for: ${allergenList}\n\nSubstitutions made:\n${changes.map(c => `• ${c}`).join('\n')}\n\nPreferred brands:\n• Bob's Red Mill for gluten-free cornmeal and flour\n• Oat milk for liquid dairy (Oatly, Planet Oat, or Califia)\n• Goat butter and goat cheese for solid dairy`
}

/**
 * Generate a slug from the recipe title
 */
export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
    
  // Append a short random string to guarantee uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  return `${baseSlug}-${randomSuffix}`
}

/**
 * Create the full recipe object ready for database insertion
 */
export function createRecipeFromExtraction(
  extracted: AdaptedRecipe,
  sourceUrl: string,
  videoThumbnail?: string,
  contributedBy: string = 'YouTube Import'
): {
  title: string
  slug: string
  description?: string
  story?: string
  servings?: number
  prepTime?: number
  cookTime?: number
  ingredients: Array<{
    amount: string
    name: string
    weightValue?: number
    weightUnit?: string
    notes?: string
    isOriginal?: boolean
    originalName?: string
  }>
  instructions: string[]
  tips?: string
  coverImage?: string
  category?: string
  cuisine?: string
  tags: string[]
  contributedBy: string
  sourceUrl: string
  originalRecipe: string
  published: boolean
} {
  return {
    title: extracted.title,
    slug: generateSlug(extracted.title),
    description: extracted.description,
    story: extracted.story || `Recipe adapted from YouTube video.\n\n${extracted.adaptationNotes}`,
    servings: extracted.servings,
    prepTime: extracted.prepTime,
    cookTime: extracted.cookTime,
    ingredients: extracted.adaptedIngredients.map(ing => ({
      amount: ing.amount,
      name: ing.name,
      notes: ing.notes,
      isOriginal: !ing.isSubstitution,
      originalName: ing.originalName
    })),
    instructions: extracted.instructions,
    tips: extracted.tips,
    coverImage: videoThumbnail,
    category: extracted.category,
    cuisine: extracted.cuisine,
    tags: [...(extracted.tags || []), 'youtube-import', 'kante-family', 'allergy-friendly'],
    contributedBy,
    sourceUrl,
    originalRecipe: JSON.stringify({
      title: extracted.title,
      ingredients: extracted.ingredients,
      instructions: extracted.instructions
    }),
    published: false // Start as draft, admin can publish
  }
}
