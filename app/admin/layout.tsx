import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-orange-600 mb-6 font-serif">
            Tré Kante Admin
          </h2>
          <nav className="space-y-2">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/recipes">
              <Button variant="ghost" className="w-full justify-start">
                Recipes
              </Button>
            </Link>
            <Link href="/admin/recipes/new">
              <Button variant="ghost" className="w-full justify-start">
                New Recipe
              </Button>
            </Link>
            <div className="my-4 border-t" />
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                ← Back to Site
              </Button>
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}


