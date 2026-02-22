import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { recipes } from '@/db/schema'

export default async function AdminDashboard() {
  const allRecipes = await db.select().from(recipes)
  const publishedCount = allRecipes.filter(r => r.published).length
  const draftCount = allRecipes.filter(r => !r.published).length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Recipes</h3>
          <p className="text-3xl font-bold text-orange-600">{allRecipes.length}</p>
        </div>
        <div className="bg-white border-2 border-green-100 rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white border-2 border-amber-100 rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-amber-600">{draftCount}</p>
        </div>
      </div>

      <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/admin/recipes/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Create New Recipe
            </Button>
          </Link>
          <div className="pt-2">
            <Link href="/admin/recipes" className="text-orange-600 hover:underline font-medium">
              Manage All Recipes →
            </Link>
          </div>
          <div className="pt-2">
            <Link href="/" className="text-gray-600 hover:underline">
              View Website →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


