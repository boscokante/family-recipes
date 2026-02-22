import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { recipes } from '@/db/schema'

export default async function RecipesAdminPage() {
  const allRecipes = await db.select().from(recipes).orderBy(recipes.createdAt)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Recipes</h1>
        <div className="flex gap-3">
          <Link href="/admin/youtube-import">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              Import from YouTube
            </Button>
          </Link>
          <Link href="/admin/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              New Recipe
            </Button>
          </Link>
        </div>
      </div>

      {allRecipes.length === 0 ? (
        <div className="bg-white border-2 border-orange-100 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No recipes yet.</p>
          <Link href="/admin/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Create Your First Recipe
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border-2 border-orange-100 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allRecipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{recipe.title}</div>
                    {recipe.slug && (
                      <div className="text-sm text-gray-500">/{recipe.slug}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {recipe.published ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipe.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link href={`/admin/recipes/${recipe.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


