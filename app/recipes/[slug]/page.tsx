import { notFound } from 'next/navigation'
import { db } from '@/db'
import { recipes, videos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import { ChatWidget } from '@/components/ai/chat-widget'

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const recipe = await db
    .select()
    .from(recipes)
    .where(eq(recipes.slug, slug))
    .limit(1)
    .then(rows => rows[0])

  if (!recipe || !recipe.published) {
    notFound()
  }

  // Fetch associated videos
  const recipeVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.recipeId, recipe.id))
    .orderBy(videos.order)

  const hasYouTubeVideo = recipeVideos.length > 0
  const youtubeVideo = recipeVideos.find(v => v.type === 'youtube')

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-orange-600 mb-4 font-serif">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-xl text-gray-700 mb-6">
                {recipe.description}
              </p>
            )}
            {recipe.story && (
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-100 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  The Story
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {recipe.story}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-gray-600">
              {recipe.servings && (
                <span>🍽️ Serves {recipe.servings}</span>
              )}
              {recipe.prepTime && (
                <span>⏱️ Prep: {recipe.prepTime} min</span>
              )}
              {recipe.cookTime && (
                <span>🔥 Cook: {recipe.cookTime} min</span>
              )}
              {recipe.contributedBy && (
                <span>👤 From {recipe.contributedBy}</span>
              )}
            </div>
          </div>

          {/* YouTube Video Embed */}
          {youtubeVideo && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📺 Watch the Recipe Video
              </h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeVideo.url)}`}
                  title={youtubeVideo.title || recipe.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {recipe.sourceUrl && (
                <p className="mt-2 text-sm text-gray-500">
                  Original video:{' '}
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Cover Image (only show if no YouTube video, or show below it) */}
          {recipe.coverImage && (
            <div className={`relative w-full mb-12 rounded-lg overflow-hidden shadow-lg ${hasYouTubeVideo ? 'h-64' : 'h-96'}`}>
              <Image
                src={recipe.coverImage}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12">
            {/* Ingredients */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-100">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-orange-600 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>{ingredient.amount}</strong> {ingredient.name}
                      {ingredient.notes && (
                        <span className="text-gray-500 italic">
                          {' '}({ingredient.notes})
                        </span>
                      )}
                      {ingredient.originalName && ingredient.name !== ingredient.originalName && (
                        <span className="text-orange-600 text-sm ml-2">
                          (sub for: {ingredient.originalName})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-100">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions?.map((instruction, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="mt-12 bg-amber-50 p-6 rounded-lg border-2 border-amber-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                💡 Tips
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {recipe.tips}
              </p>
            </div>
          )}

          {/* Family Photo */}
          {recipe.familyPhoto && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Family Memory
              </h2>
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={recipe.familyPhoto}
                  alt="Family photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-12">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatWidget />
    </>
  )
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return match?.[1] || ''
}
