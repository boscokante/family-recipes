/**
 * Add the Southern Buttermilk Cornbread recipe to the database
 * Adapted for Kante family allergies
 *
 * Video: THE BEST SOUTHERN BUTTERMILK CORNBREAD + HONEY BUTTER RECIPE
 * URL: https://www.youtube.com/watch?v=S6MbbZm06ak
 * Channel: ThatGirlCanCook!
 */

import { db } from '../db'
import { recipes, videos } from '../db/schema'

async function addCornbreadRecipe() {
  console.log('Adding Southern Buttermilk Cornbread recipe...\n')

  // Check if recipe already exists
  const existing = await db
    .select()
    .from(recipes)
    .where(eq(recipes.slug, 'southern-buttermilk-cornbread'))

  if (existing.length > 0) {
    console.log('Recipe already exists! Skipping...')
    return
  }

  // Recipe adapted for Kante family (all members)
  const recipeData = {
    slug: 'southern-buttermilk-cornbread',
    title: "Southern Buttermilk Cornbread with Honey Butter",
    description: "The best southern buttermilk cornbread recipe adapted for the Kante family. Made with gluten-free cornmeal and goat yogurt for that perfect tang. Perfect with chili!",
    story: `This recipe was adapted from ThatGirlCanCook!'s viral YouTube video "THE BEST SOUTHERN BUTTERMILK CORNBREAD + HONEY BUTTER RECIPE."

The original recipe has been modified for the Kante family allergies:
• Gluten-free flour and cornmeal (Bob's Red Mill)
• Goat yogurt instead of buttermilk (same tang, dairy-free for the family)
• Goat butter instead of regular butter

The secret ingredient is still there - Duke's mayonnaise (which is naturally dairy-free) keeps this cornbread incredibly moist!

Original video: https://www.youtube.com/watch?v=S6MbbZm06ak`,
    cuisine: "southern",
    category: "side" as const,
    servings: 8,
    prepTime: 10,
    cookTime: 20,
    ingredients: [
      { amount: "1.5 cups", name: "Bob's Red Mill gluten-free cornmeal", originalName: "yellow cornmeal", isOriginal: false },
      { amount: "1 cup", name: "Bob's Red Mill gluten-free 1-to-1 flour", originalName: "all-purpose flour", isOriginal: false },
      { amount: "3.5 tsp", name: "baking powder" },
      { amount: "1 pinch", name: "salt" },
      { amount: "1/4 cup", name: "sugar", notes: "optional - southern cornbread ain't sweet" },
      { amount: "2 large", name: "eggs" },
      { amount: "2/3 cup", name: "goat yogurt thinned with oat milk", originalName: "whole buttermilk", isOriginal: false, notes: "use 2 cups if omitting sugar" },
      { amount: "2 tbsp", name: "vegetable oil" },
      { amount: "2 tbsp", name: "goat butter", originalName: "butter", isOriginal: false, notes: "for melting in skillet" },
      { amount: "1 tbsp", name: "Duke's mayonnaise", notes: "secret ingredient for moisture (naturally dairy-free!)" }
    ],
    instructions: [
      "Preheat oven to 350°F. Place 2 tbsp goat butter and 2 tbsp vegetable oil in an 8-inch cast iron skillet. Put in oven to melt for 2-3 minutes.",
      "In a large mixing bowl, whisk together 1.5 cups gluten-free cornmeal, 1 cup gluten-free flour, 3.5 tsp baking powder, and a pinch of salt.",
      "Add 2/3 cup goat yogurt thinned with oat milk and 2 large eggs. Whisk together until combined.",
      "Add 1 tbsp Duke's mayonnaise (the secret ingredient for moisture!) and the melted goat butter/oil mixture from the skillet. Mix well.",
      "Pour batter into the hot cast iron skillet with remaining oil/butter.",
      "Bake at 350°F for 18-20 minutes until cooked through and golden brown.",
      "Optional: For extra color, brush with honey butter and broil for 2-3 minutes (watch carefully!)."
    ],
    tips: "The mayonnaise is the secret to moist cornbread - don't skip it! Use an 8-inch cast iron skillet for the best crispy edges. The goat yogurt provides the same tang as buttermilk.",
    coverImage: "https://img.youtube.com/vi/S6MbbZm06ak/maxresdefault.jpg",
    contributedBy: "ThatGirlCanCook! (adapted for Kante Family)",
    sourceUrl: "https://www.youtube.com/watch?v=S6MbbZm06ak",
    tags: ["cornbread", "southern", "cast-iron", "chili-side", "gluten-free", "kante-family", "youtube-import"],
    published: true
  }

  // Insert recipe
  const [insertedRecipe] = await db.insert(recipes).values(recipeData).returning()

  console.log(`✓ Added recipe: ${insertedRecipe.title} (ID: ${insertedRecipe.id})`)

  // Insert video reference
  await db.insert(videos).values({
    recipeId: insertedRecipe.id,
    url: "https://www.youtube.com/watch?v=S6MbbZm06ak",
    type: "youtube",
    thumbnail: "https://img.youtube.com/vi/S6MbbZm06ak/maxresdefault.jpg",
    title: "THE BEST SOUTHERN BUTTERMILK CORNBREAD + HONEY BUTTER RECIPE",
    order: 0
  })

  console.log('✓ Added YouTube video reference')

  console.log('\n' + '='.repeat(60))
  console.log('RECIPE ADDED SUCCESSFULLY!')
  console.log('='.repeat(60))
  console.log(`\nView recipe at: /recipes/${recipeData.slug}`)
  console.log(`Admin edit: /admin/recipes/${insertedRecipe.id}`)
}

// Import eq for the check
import { eq } from 'drizzle-orm'

addCornbreadRecipe()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error adding recipe:', error)
    process.exit(1)
  })
