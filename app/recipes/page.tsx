import Link from 'next/link'
import { db } from '@/db'
import { recipes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'

export default async function RecipesPage() {
  const allRecipes = await db
    .select()
    .from(recipes)
    .where(eq(recipes.published, true))
    .orderBy(recipes.createdAt)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-600 mb-4 font-serif">
            All Recipes
          </h1>
          <p className="text-xl text-gray-700">
            Browse our collection of family favorites
          </p>
        </div>

        {allRecipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No recipes published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-all hover:shadow-xl"
              >
                {recipe.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.coverImage}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {recipe.title}
                  </h2>
                  {recipe.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {recipe.servings && (
                      <span>🍽️ {recipe.servings} servings</span>
                    )}
                    {recipe.prepTime && (
                      <span>⏱️ {recipe.prepTime} min prep</span>
                    )}
                  </div>
                  {recipe.contributedBy && (
                    <p className="text-sm text-orange-600 mt-2">
                      From {recipe.contributedBy}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


