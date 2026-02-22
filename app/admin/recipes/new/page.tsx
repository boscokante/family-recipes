'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/utils'

export default function NewRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    story: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    category: '',
    cuisine: '',
    contributedBy: '',
    tips: '',
    published: false,
  })
  const [ingredients, setIngredients] = useState<Array<{ amount: string; name: string; notes?: string }>>([])
  const [instructions, setInstructions] = useState<string[]>([''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.slug || slugify(formData.title)
      
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          servings: formData.servings ? parseInt(formData.servings) : null,
          prepTime: formData.prepTime ? parseInt(formData.prepTime) : null,
          cookTime: formData.cookTime ? parseInt(formData.cookTime) : null,
          ingredients: ingredients.filter(ing => ing.amount && ing.name),
          instructions: instructions.filter(inst => inst.trim()),
          tags: [],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create recipe')
      }

      const recipe = await response.json()
      router.push(`/admin/recipes/${recipe.id}`)
    } catch (error: any) {
      alert(error.message || 'Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', name: '' }])
  }

  const updateIngredient = (index: number, field: 'amount' | 'name' | 'notes', value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    setInstructions([...instructions, ''])
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions]
    updated[index] = value
    setInstructions(updated)
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">New Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (!formData.slug) {
                  setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })
                }
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="story">Family Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              rows={5}
              placeholder="Share the story behind this recipe..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="prepTime">Prep Time (min)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cookTime">Cook Time (min)</Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="appetizer, main, dessert, side, drink"
              />
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                placeholder="italian, mexican, southern, etc."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contributedBy">Contributed By</Label>
            <Input
              id="contributedBy"
              value={formData.contributedBy}
              onChange={(e) => setFormData({ ...formData, contributedBy: e.target.value })}
              placeholder="Family member name"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ingredients</h2>
            <Button type="button" onClick={addIngredient} variant="outline" size="sm">
              Add Ingredient
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                />
                <Input
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Notes (optional)"
                  value={ing.notes || ''}
                  onChange={(e) => updateIngredient(i, 'notes', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
            {ingredients.length === 0 && (
              <p className="text-gray-500 text-sm">No ingredients added yet. Click "Add Ingredient" to start.</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Instructions</h2>
            <Button type="button" onClick={addInstruction} variant="outline" size="sm">
              Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {instructions.map((inst, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mt-1">
                  {i + 1}
                </span>
                <Textarea
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  className="flex-1"
                  rows={2}
                  placeholder={`Step ${i + 1}...`}
                />
                <Button
                  type="button"
                  onClick={() => removeInstruction(i)}
                  variant="destructive"
                  size="sm"
                  className="self-start"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
          <Label htmlFor="tips">Tips & Notes</Label>
          <Textarea
            id="tips"
            value={formData.tips}
            onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
            rows={4}
            placeholder="Share any helpful tips or notes..."
          />
        </div>

        {/* Publish */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}


