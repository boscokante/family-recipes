/**
 * Test script showing how the Southern Buttermilk Cornbread recipe
 * from YouTube would be adapted for the Kante family
 *
 * Video: THE BEST SOUTHERN BUTTERMILK CORNBREAD + HONEY BUTTER RECIPE
 * URL: https://www.youtube.com/watch?v=S6MbbZm06ak
 */

import { adaptRecipeForFamily, createRecipeFromExtraction } from '../lib/recipe-extractor'

// Original recipe extracted from YouTube video
const originalCornbreadRecipe = {
  title: "THE BEST SOUTHERN BUTTERMILK CORNBREAD + HONEY BUTTER",
  description: "The best southern buttermilk cornbread recipe, perfect with chili. Made in a cast iron skillet for authentic flavor.",
  cuisine: "southern",
  category: "side" as const,
  servings: 8,
  prepTime: 10,
  cookTime: 20,
  ingredients: [
    { amount: "1.5 cups", name: "yellow cornmeal" },
    { amount: "1 cup", name: "all-purpose flour" },
    { amount: "3.5 tsp", name: "baking powder" },
    { amount: "1 pinch", name: "salt" },
    { amount: "1/4 cup", name: "sugar", notes: "optional - southern cornbread ain't sweet" },
    { amount: "2 large", name: "eggs" },
    { amount: "2/3 cup", name: "whole buttermilk", notes: "with sugar, or 2 cups without sugar" },
    { amount: "2 tbsp", name: "vegetable oil" },
    { amount: "2 tbsp", name: "butter", notes: "real butter, not margarine" },
    { amount: "1 tbsp", name: "Duke's mayonnaise", notes: "secret family ingredient for moisture" }
  ],
  instructions: [
    "Preheat oven to 350°F. Place 2 tbsp butter and 2 tbsp vegetable oil in an 8-inch cast iron skillet. Put in oven to melt for 2-3 minutes.",
    "In a large mixing bowl, whisk together 1.5 cups yellow cornmeal, 1 cup all-purpose flour, 3.5 tsp baking powder, and a pinch of salt.",
    "Add 2/3 cup buttermilk and 2 large eggs. Whisk together until combined.",
    "Add 1 tbsp Duke's mayonnaise (the secret ingredient!) and the melted butter/oil mixture from the skillet. Mix well.",
    "Pour batter into the hot cast iron skillet with remaining oil/butter.",
    "Bake at 350°F for 18-20 minutes until cooked through.",
    "Optional: Slather honey butter on top and broil for 2-3 minutes for golden color."
  ],
  tips: "The mayonnaise is the secret to moist cornbread. Use an 8-inch cast iron skillet for best results. Don't let the cornbread sit too long - cut it while warm.",
  story: "This recipe pairs perfectly with homemade chili. The secret family trick is adding Duke's mayonnaise for extra moisture.",
  tags: ["cornbread", "southern", "cast-iron", "chili-side"]
}

console.log("=".repeat(70))
console.log("SOUTHERN BUTTERMILK CORNBREAD - KANTE FAMILY ADAPTATION")
console.log("=".repeat(70))
console.log()

// Test with all family members (Bosko, Maya, Che)
console.log("FAMILY MEMBERS: Bosko + Maya + Che (Full Kante Family)")
console.log("-".repeat(70))

const adaptedFull = adaptRecipeForFamily(originalCornbreadRecipe, [1, 2, 3])

console.log("\n📝 ORIGINAL INGREDIENTS:")
originalCornbreadRecipe.ingredients.forEach(ing => {
  console.log(`  • ${ing.amount} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`)
})

console.log("\n✅ ADAPTED INGREDIENTS (for Kante family):")
adaptedFull.adaptedIngredients.forEach(ing => {
  if (ing.isSubstitution) {
    console.log(`  • ${ing.amount} ${ing.name} ← was: ${ing.originalName}`)
  } else {
    console.log(`  • ${ing.amount} ${ing.name}`)
  }
})

console.log("\n🔄 SUBSTITUTIONS MADE:")
adaptedFull.substitutionsMade.forEach((sub, i) => {
  console.log(`  ${i + 1}. ${sub.original} → ${sub.substitute}`)
  console.log(`     Reason: ${sub.reason}`)
})

console.log("\n📝 ADAPTATION NOTES:")
console.log(adaptedFull.adaptationNotes)

console.log("\n" + "=".repeat(70))
console.log("TEST: Bosko Only (Dairy + Gluten + Cashew)")
console.log("=".repeat(70))

const adaptedBosko = adaptRecipeForFamily(originalCornbreadRecipe, [1])

console.log("\n✅ ADAPTED FOR BOSKO ONLY:")
adaptedBosko.adaptedIngredients.forEach(ing => {
  if (ing.isSubstitution) {
    console.log(`  • ${ing.amount} ${ing.name} ← was: ${ing.originalName}`)
  } else {
    console.log(`  • ${ing.amount} ${ing.name}`)
  }
})

console.log("\n" + "=".repeat(70))
console.log("TEST: Maya Only (Citrus + Shellfish)")
console.log("=".repeat(70))

const adaptedMaya = adaptRecipeForFamily(originalCornbreadRecipe, [2])

console.log("\n✅ ADAPTED FOR MAYA ONLY:")
console.log("(Note: This cornbread has no citrus or shellfish, so no substitutions needed)")
adaptedMaya.adaptedIngredients.forEach(ing => {
  if (ing.isSubstitution) {
    console.log(`  • ${ing.amount} ${ing.name} ← was: ${ing.originalName}`)
  } else {
    console.log(`  • ${ing.amount} ${ing.name}`)
  }
})

console.log("\n" + "=".repeat(70))
console.log()
console.log("KEY INSIGHTS FOR THIS CORNBREAD RECIPE:")
console.log()
console.log("1. FLOUR: 1 cup all-purpose flour → Bob's Red Mill gluten-free 1-to-1 flour")
console.log("   (Cornmeal is naturally gluten-free, but flour needs substitution)")
console.log()
console.log("2. BUTTERMILK: Whole buttermilk → Goat yogurt thinned with oat milk")
console.log("   (Goat yogurt has the same tang/acidity as buttermilk, perfect sub!)")
console.log()
console.log("3. BUTTER: Real butter → Goat butter")
console.log("   (Bosko and Che can have goat butter, but not cow butter)")
console.log()
console.log("4. MAYONNAISE: Duke's mayo → Need dairy-free mayo or make with oat milk")
console.log("   (Most mayo contains egg but is dairy-free - check ingredients)")
console.log()
console.log("5. NO CITRUS ISSUES: This recipe has no lemon/lime/orange")
console.log("   (Maya is safe! No substitutions needed for her allergies)")
console.log()
console.log("=".repeat(70))
