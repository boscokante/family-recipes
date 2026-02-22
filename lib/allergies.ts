/**
 * Allergy substitution system for the Conte family
 * Manages family member allergies and automatic recipe adaptations
 */

export interface FamilyMember {
  id: number
  name: string
  allergies: string[]
  allergyDetails: {
    [key: string]: {
      severity: 'strict' | 'avoid' | 'intolerance'
      notes?: string
    }
  }
  substitutions: {
    [key: string]: string
  }
  isActive: boolean
}

export interface IngredientSubstitution {
  original: string
  substitute: string
  reason: string
  category: 'dairy' | 'gluten' | 'shellfish' | 'citrus' | 'other'
}

// Default family member profiles
export const DEFAULT_FAMILY_MEMBERS: Omit<FamilyMember, 'id'>[] = [
  {
    name: 'Bosko',
    allergies: ['dairy', 'gluten', 'cashew'],
    allergyDetails: {
      dairy: { severity: 'strict', notes: 'Can have goat butter and goat cheese, but milk/cream use oat milk' },
      gluten: { severity: 'strict' },
      cashew: { severity: 'avoid', notes: 'Slight intolerance, avoid when possible' }
    },
    substitutions: {
      'butter': 'goat butter',
      'cheese': 'goat cheese',
      'milk': 'oat milk (almond milk as second choice)',
      'whole milk': 'oat milk',
      'buttermilk': 'goat yogurt thinned with oat milk',
      'sour cream': 'goat yogurt',
      'heavy cream': 'oat cream or coconut cream',
      'whipping cream': 'oat cream or coconut cream',
      'all-purpose flour': "Bob's Red Mill gluten-free 1-to-1 flour",
      'bread flour': "Bob's Red Mill gluten-free flour",
      'wheat flour': "Bob's Red Mill gluten-free flour",
      'regular flour': "Bob's Red Mill gluten-free flour",
      'cashews': 'sunflower seeds or omit'
    },
    isActive: true
  },
  {
    name: 'Maya',
    allergies: ['citrus', 'shellfish'],
    allergyDetails: {
      citrus: { severity: 'strict', notes: 'No lemon, lime, orange. Lemongrass is NOT citrus - it is safe!' },
      shellfish: { severity: 'strict', notes: 'Crab, lobster, shrimp - but octopus, squid, clams are OK' }
    },
    substitutions: {
      'lemon juice': 'citric acid powder mixed with water (NOT lemon extract - still contains lemon)',
      'lemon': 'lemongrass (safe - not related to lemon/citrus family)',
      'lime juice': 'citric acid solution',
      'lime': 'lemongrass (safe - not related to lime/citrus family)',
      'orange': 'persimmon or mango',
      'lemon zest': 'omit or use dried lemongrass',
      'shrimp': 'octopus or squid',
      'crab': 'imitation crab (surimi) or omit',
      'lobster': 'omit or use fish',
      'prawns': 'octopus or squid'
    },
    isActive: true
  },
  {
    name: 'Che',
    allergies: ['dairy', 'gluten', 'fish', 'citrus'],
    allergyDetails: {
      dairy: { severity: 'strict', notes: 'Can have goat butter and goat cheese, but milk/cream use oat milk' },
      gluten: { severity: 'strict' },
      fish: { severity: 'strict' },
      citrus: { severity: 'strict', notes: 'No lemon, lime, orange. Lemongrass is NOT citrus - it is safe!' }
    },
    substitutions: {
      'butter': 'goat butter',
      'cheese': 'goat cheese',
      'milk': 'oat milk (almond milk as second choice)',
      'whole milk': 'oat milk',
      'buttermilk': 'oat milk + 1 tsp vinegar per cup',
      'heavy cream': 'oat cream or coconut cream',
      'whipping cream': 'oat cream or coconut cream',
      'all-purpose flour': "Bob's Red Mill gluten-free 1-to-1 flour",
      'bread flour': "Bob's Red Mill gluten-free flour",
      'wheat flour': "Bob's Red Mill gluten-free flour",
      'regular flour': "Bob's Red Mill gluten-free flour",
      'lemon juice': 'citric acid powder mixed with water (NOT lemon extract - still contains lemon)',
      'lemon': 'lemongrass (safe - not related to lemon/citrus family)',
      'lime juice': 'citric acid solution',
      'lime': 'lemongrass (safe - not related to lime/citrus family)',
      'fish sauce': 'coconut aminos',
      'shrimp': 'omit',
      'crab': 'omit',
      'salmon': 'omit',
      'tuna': 'omit'
    },
    isActive: true
  }
]

// Kante family combined profile (default - all members active)
export const KANTE_FAMILY_ALLERGENS = {
  strict: ['dairy', 'gluten', 'citrus', 'shellfish'],
  avoid: ['cashew', 'cow-milk', 'wheat']
}

// Preferred brands and products
export const PREFERRED_PRODUCTS = {
  'cornmeal': "Bob's Red Mill gluten-free cornmeal",
  'flour': "Bob's Red Mill gluten-free 1-to-1 baking flour",
  'baking flour': "Bob's Red Mill gluten-free 1-to-1 baking flour",
  'butter': 'goat butter (preferably Meyenberg or local farm)',
  'cheese': 'goat cheese (preferably fresh chèvre or aged)',
  'milk': 'goat milk',
  'cream': 'goat cream or coconut cream',
  'yogurt': 'goat yogurt',
}

/**
 * Get the default "Kante Family" combined substitution profile
 * This merges all active family members' allergies
 */
export function getKanteFamilySubstitutions(): Record<string, string> {
  const combined: Record<string, string> = {}

  // Start with Bosko's base substitutions
  Object.assign(combined, DEFAULT_FAMILY_MEMBERS[0].substitutions)

  // Merge Maya's citrus/shellfish substitutions
  Object.assign(combined, DEFAULT_FAMILY_MEMBERS[1].substitutions)

  // Add preferred product substitutions
  Object.assign(combined, PREFERRED_PRODUCTS)

  return combined
}

/**
 * Get substitutions for specific family members
 */
export function getSubstitutionsForMembers(memberIds: number[]): Record<string, string> {
  const combined: Record<string, string> = { ...PREFERRED_PRODUCTS }

  // Get all unique allergens from selected members
  const selectedMembers = DEFAULT_FAMILY_MEMBERS.filter((_, idx) => memberIds.includes(idx + 1))

  for (const member of selectedMembers) {
    for (const [ingredient, substitute] of Object.entries(member.substitutions)) {
      // If there's a conflict, prefer the stricter substitution
      if (!combined[ingredient] || shouldPreferSubstitution(member.substitutions, combined, ingredient)) {
        combined[ingredient] = substitute
      }
    }
  }

  return combined
}

function shouldPreferSubstitution(
  newSubs: Record<string, string>,
  existingSubs: Record<string, string>,
  ingredient: string
): boolean {
  // Prefer substitutions that remove allergens over those that substitute with other potential allergens
  const newSub = newSubs[ingredient].toLowerCase()
  const existingSub = existingSubs[ingredient].toLowerCase()

  // If one says "omit" prefer that for strict allergies
  if (newSub.includes('omit') && !existingSub.includes('omit')) return true
  if (existingSub.includes('omit') && !newSub.includes('omit')) return false

  return false // Keep existing by default
}

/**
 * Get all unique allergens for selected family members
 */
export function getAllergensForMembers(memberIds: number[]): string[] {
  const allergens = new Set<string>()

  const selectedMembers = DEFAULT_FAMILY_MEMBERS.filter((_, idx) => memberIds.includes(idx + 1))

  for (const member of selectedMembers) {
    for (const allergy of member.allergies) {
      allergens.add(allergy)
    }
  }

  return Array.from(allergens)
}

/**
 * Get a human-readable description of the family profile
 */
export function getFamilyProfileDescription(memberIds?: number[]): string {
  if (!memberIds || memberIds.length === 0) {
    return 'Kante Family (No allergies selected)'
  }

  if (memberIds.length === DEFAULT_FAMILY_MEMBERS.length) {
    return 'Full Kante Family - No dairy, no gluten, no citrus, no shellfish. Oat milk preferred, goat butter/cheese OK.'
  }

  const selectedMembers = DEFAULT_FAMILY_MEMBERS.filter((_, idx) => memberIds.includes(idx + 1))
  const names = selectedMembers.map(m => m.name).join(', ')
  const allergens = getAllergensForMembers(memberIds)

  return `${names} - No ${allergens.join(', ')}`
}

/**
 * Detect if an ingredient contains an allergen
 */
export function detectAllergen(ingredient: string): string | null {
  const lowerIngredient = ingredient.toLowerCase()

  const allergenPatterns: Record<string, string[]> = {
    dairy: ['butter', 'milk', 'cream', 'cheese', 'yogurt', 'whey', 'casein', 'lactose', 'ghee', 'buttermilk'],
    gluten: ['flour', 'wheat', 'barley', 'rye', 'spelt', 'semolina', 'farro', 'couscous', 'bulgur', 'seitan', 'matzo'],
    shellfish: ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'langoustine'],
    citrus: ['lemon', 'lime', 'orange', 'grapefruit', 'clementine', 'tangerine', 'citron'],
    cashew: ['cashew', 'cashews'],
    fish: ['salmon', 'tuna', 'cod', 'halibut', 'sardine', 'anchovy', 'mackerel', 'trout', 'fish sauce']
  }

  for (const [allergen, patterns] of Object.entries(allergenPatterns)) {
    for (const pattern of patterns) {
      if (lowerIngredient.includes(pattern)) {
        return allergen
      }
    }
  }

  return null
}

/**
 * Get substitution suggestion for an ingredient
 */
export function getSubstitution(ingredient: string, memberIds?: number[]): string | null {
  const subs = memberIds && memberIds.length > 0
    ? getSubstitutionsForMembers(memberIds)
    : getConteFamilySubstitutions()

  const lowerIngredient = ingredient.toLowerCase()

  // Check for exact match first
  if (subs[lowerIngredient]) {
    return subs[lowerIngredient]
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(subs)) {
    if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
      return value
    }
  }

  // Smart fallback substitutions based on ingredient type
  if (lowerIngredient.includes('butter') && !lowerIngredient.includes('goat')) {
    return 'goat butter'
  }
  if (lowerIngredient.includes('cheese') && !lowerIngredient.includes('goat')) {
    return 'goat cheese'
  }
  if (lowerIngredient.includes('milk') && !lowerIngredient.includes('goat')) {
    return 'goat milk'
  }
  if (lowerIngredient.includes('flour') && !lowerIngredient.includes('gluten-free')) {
    return "Bob's Red Mill gluten-free 1-to-1 flour"
  }
  if (lowerIngredient.includes('cornmeal') && !lowerIngredient.includes('gluten-free')) {
    return "Bob's Red Mill gluten-free cornmeal"
  }

  return null
}

/**
 * Adapt an ingredient list for family allergies
 */
export function adaptIngredients(
  ingredients: Array<{ amount: string; name: string; notes?: string }>,
  memberIds?: number[]
): Array<{ amount: string; name: string; originalName?: string; notes?: string; isSubstitution?: boolean }> {
  return ingredients.map(ing => {
    const substitution = getSubstitution(ing.name, memberIds)
    if (substitution && substitution.toLowerCase() !== ing.name.toLowerCase()) {
      return {
        ...ing,
        name: substitution,
        originalName: ing.name,
        isSubstitution: true
      }
    }
    return { ...ing, isSubstitution: false }
  })
}

/**
 * Generate adaptation notes explaining what was changed
 */
export function generateAdaptationNotes(
  originalIngredients: Array<{ name: string }>,
  adaptedIngredients: Array<{ name: string; originalName?: string; isSubstitution?: boolean }>
): string {
  const changes: string[] = []

  for (let i = 0; i < originalIngredients.length; i++) {
    const adapted = adaptedIngredients[i]
    if (adapted.isSubstitution && adapted.originalName) {
      changes.push(`${adapted.originalName} → ${adapted.name}`)
    }
  }

  if (changes.length === 0) {
    return 'No substitutions needed for selected family members.'
  }

  return `Adapted for Kante family allergies:\n${changes.map(c => `• ${c}`).join('\n')}`
}
