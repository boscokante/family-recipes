'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { YouTubeImportResponse, YouTubeImportRequest } from '@/app/api/youtube/import/route'

interface FamilyMember {
  id: number
  name: string
  allergies: string[]
  allergyDetails: Record<string, { severity: string; notes?: string }>
  isActive: boolean
}

export default function YouTubeImportPage() {
  const [url, setUrl] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [selectedMembers, setSelectedMembers] = useState<number[]>([1, 2, 3])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMembers, setIsFetchingMembers] = useState(true)
  const [result, setResult] = useState<YouTubeImportResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch family members on mount
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const res = await fetch('/api/youtube/import')
        if (res.ok) {
          const data = await res.json()
          setFamilyMembers(data.familyMembers || [])
          setSelectedMembers(data.defaultSelection || [1, 2, 3])
        }
      } catch (e) {
        console.error('Error fetching family members:', e)
        // Use defaults if API fails
        setFamilyMembers([
          { id: 1, name: 'Bosko', allergies: ['dairy', 'gluten', 'cashew'], allergyDetails: {}, isActive: true },
          { id: 2, name: 'Maya', allergies: ['citrus', 'shellfish'], allergyDetails: {}, isActive: true },
          { id: 3, name: 'Che', allergies: ['dairy', 'gluten', 'fish', 'citrus'], allergyDetails: {}, isActive: true }
        ])
        setSelectedMembers([1, 2, 3])
      } finally {
        setIsFetchingMembers(false)
      }
    }

    fetchFamilyMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const requestBody: YouTubeImportRequest = {
        url,
        familyMemberIds: selectedMembers,
        autoPublish: false
      }

      const res = await fetch('/api/youtube/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data: YouTubeImportResponse = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to import recipe')
      } else {
        setResult(data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFamilyMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    )
  }

  const getSelectedAllergens = (): string[] => {
    const allergens = new Set<string>()
    selectedMembers.forEach(id => {
      const member = familyMembers.find(m => m.id === id)
      if (member) {
        member.allergies.forEach(a => allergens.add(a))
      }
    })
    return Array.from(allergens)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Import from YouTube</h1>
        <p className="text-gray-600">
          Paste a YouTube recipe video link and we&apos;ll extract the recipe, adapt it for your family&apos;s allergies, and add it to your collection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL Input */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
          <Label htmlFor="youtube-url" className="text-lg font-semibold text-gray-800 mb-2 block">
            YouTube Video URL
          </Label>
          <Input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Example: https://www.youtube.com/watch?v=S6MbbZm06ak
          </p>
        </div>

        {/* Family Member Selection */}
        <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Adapt for Family Members
          </h2>

          {isFetchingMembers ? (
            <p className="text-gray-500">Loading family members...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {familyMembers.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedMembers.includes(member.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleFamilyMember(member.id)}
                      className="mt-1 mr-3 h-4 w-4 text-orange-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        Allergies: {member.allergies.join(', ')}
                      </div>
                      {member.allergyDetails?.dairy?.notes && (
                        <div className="text-xs text-orange-600 mt-1">
                          {member.allergyDetails.dairy.notes}
                        </div>
                      )}
                      {member.allergyDetails?.shellfish?.notes && (
                        <div className="text-xs text-orange-600 mt-1">
                          {member.allergyDetails.shellfish.notes}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Quick Select Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMembers([1, 2, 3])}
                  className={selectedMembers.length === 3 ? 'bg-orange-100' : ''}
                >
                  Kante Family (All)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMembers([1])}
                  className={selectedMembers.length === 1 && selectedMembers[0] === 1 ? 'bg-orange-100' : ''}
                >
                  Bosko Only
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMembers([2])}
                  className={selectedMembers.length === 1 && selectedMembers[0] === 2 ? 'bg-orange-100' : ''}
                >
                  Maya Only
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMembers([3])}
                  className={selectedMembers.length === 1 && selectedMembers[0] === 3 ? 'bg-orange-100' : ''}
                >
                  Che Only
                </Button>
              </div>

              {/* Selected Allergens Summary */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-medium text-orange-800 mb-2">Recipe will be adapted for:</h3>
                <div className="flex flex-wrap gap-2">
                  {getSelectedAllergens().map((allergen) => (
                    <span
                      key={allergen}
                      className="px-2 py-1 bg-orange-200 text-orange-800 text-sm rounded-full"
                    >
                      No {allergen}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-orange-600 mt-2">
                  Oat milk (almond second choice) for liquid dairy. Goat butter and goat cheese OK.
                  Bob&apos;s Red Mill gluten-free products used for flour and cornmeal.
                  Lemongrass is safe - NOT related to lemon/citrus family.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
            disabled={isLoading || !url}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Extracting & Adapting...
              </span>
            ) : (
              'Extract Recipe'
            )}
          </Button>

          <Link href="/admin/recipes">
            <Button type="button" variant="outline" className="px-6">
              Cancel
            </Button>
          </Link>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {/* Success Result */}
      {result?.success && result.recipe && (
        <div className="mt-8 space-y-6">
          {/* Success Header */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Recipe Extracted Successfully!
            </h2>
            <p className="text-green-700">
              <strong>{result.recipe.title}</strong> has been imported and adapted for your family&apos;s allergies.
            </p>
          </div>

          {/* Video Preview */}
          {result.video && (
            <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Original Video</h3>
              <div className="aspect-video max-w-2xl">
                <iframe
                  src={result.video.embedUrl}
                  title="YouTube video player"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Adaptation Summary */}
          <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Allergy Adaptations</h3>

            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <p className="text-orange-800 whitespace-pre-line">{result.recipe.adaptations.notes}</p>
            </div>

            {result.recipe.adaptations.substitutionsMade.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Substitutions Made:</h4>
                <ul className="space-y-2">
                  {result.recipe.adaptations.substitutionsMade.map((sub, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="text-red-500 line-through">{sub.original}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 font-medium">{sub.substitute}</span>
                      <span className="text-sm text-gray-500">({sub.reason})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adapted Ingredients</h3>
            <ul className="space-y-2">
              {result.recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-800">
                    <span className="font-medium">{ing.amount}</span> {ing.name}
                  </span>
                  {ing.isSubstitution && ing.originalName && (
                    <span className="text-sm text-orange-600">
                      (was: {ing.originalName})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white border-2 border-orange-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {result.recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pb-8">
            <Link href={`/admin/recipes/${result.recipe.id}`}>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Edit Recipe
              </Button>
            </Link>
            <Link href={`/recipes/${result.recipe.slug}`} target="_blank">
              <Button variant="outline">
                View Recipe
              </Button>
            </Link>
            <Link href="/admin/recipes">
              <Button variant="outline">
                Back to All Recipes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
