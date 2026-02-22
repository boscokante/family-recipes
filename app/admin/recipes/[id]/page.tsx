'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recipe, setRecipe] = useState<any>(null)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetchRecipe(p.id)
    })
  }, [params])

  const fetchRecipe = async (recipeId: string) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`)
      if (!res.ok) throw new Error('Failed to fetch recipe')
      const data = await res.json()
      setRecipe(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching recipe:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update recipe')
      }

      router.push('/admin/recipes')
    } catch (error: any) {
      alert(error.message || 'Failed to update recipe')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!recipe) {
    return <div className="p-8">Recipe not found</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Recipe</h1>
      <p className="text-gray-600 mb-8">Recipe editing form coming soon...</p>
      <Button onClick={() => router.back()} variant="outline">
        ← Back
      </Button>
    </div>
  )
}


