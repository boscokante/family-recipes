/**
 * YouTube Recipe Import API
 * Extracts recipes from YouTube videos and adapts them for family allergies
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { recipes, videos } from '@/db/schema'
import {
  getYouTubeInfo,
  isValidYouTubeUrl
} from '@/lib/youtube'
import {
  extractRecipeFromVideo,
  adaptRecipeForFamily,
  createRecipeFromExtraction
} from '@/lib/recipe-extractor'
import { DEFAULT_FAMILY_MEMBERS } from '@/lib/allergies'

export interface YouTubeImportRequest {
  url: string
  familyMemberIds?: number[] // Which family members to adapt for (default: all)
  autoPublish?: boolean
}

export interface YouTubeImportResponse {
  success: boolean
  recipe?: {
    id: number
    title: string
    slug: string
    ingredients: Array<{
      amount: string
      name: string
      originalName?: string
      isSubstitution?: boolean
    }>
    instructions: string[]
    adaptations: {
      excludedAllergens: string[]
      substitutionsMade: Array<{
        original: string
        substitute: string
        reason: string
      }>
      notes: string
    }
  }
  video?: {
    videoId: string
    thumbnail: string
    embedUrl: string
  }
  error?: string
}

/**
 * POST /api/youtube/import
 * Import a recipe from a YouTube video URL
 */
export async function POST(request: Request): Promise<NextResponse<YouTubeImportResponse>> {
  try {
    // Allow either signed-in web admin session OR mobile import key.
    const session = await auth()
    const mobileImportKey = request.headers.get('x-family-import-key')
    const expectedImportKey = process.env.FAMILY_IMPORT_KEY
    const hasValidMobileKey = Boolean(
      expectedImportKey &&
      mobileImportKey &&
      mobileImportKey === expectedImportKey
    )
    if (!session?.user && !hasValidMobileKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: YouTubeImportRequest = await request.json()
    const { url, familyMemberIds, autoPublish = false } = body

    // Validate YouTube URL
    if (!url || !isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Get YouTube video info
    const videoInfo = getYouTubeInfo(url)
    if (!videoInfo) {
      return NextResponse.json(
        { success: false, error: 'Could not extract video information' },
        { status: 400 }
      )
    }

    // For this implementation, we'll fetch video metadata via oEmbed or a similar approach
    // In production, you'd use the YouTube Data API with an API key
    // For now, we'll extract what we can from the URL and use AI to generate the recipe
    // based on common patterns in the video title

    // Fetch video metadata using oEmbed
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    let videoTitle = 'Unknown Recipe'
    let channelName = ''
    let videoDescription = ''

    try {
      const oEmbedRes = await fetch(oEmbedUrl)
      if (oEmbedRes.ok) {
        const oEmbedData = await oEmbedRes.json()
        videoTitle = oEmbedData.title || videoTitle
        channelName = oEmbedData.author_name || ''

        // Extract a description from the title for the AI to work with
        videoDescription = oEmbedData.title || ''
      }
    } catch (e) {
      console.warn('Could not fetch oEmbed data:', e)
    }

    // If we can't get real description, we'll work with the title
    // The AI will try to infer from common recipe video patterns
    if (!videoDescription) {
      videoDescription = videoTitle
    }

    // Extract recipe from video content using AI
    const extractedRecipe = await extractRecipeFromVideo(
      videoTitle,
      videoDescription,
      channelName
    )

    // Adapt recipe for family allergies
    const adaptedRecipe = adaptRecipeForFamily(extractedRecipe, familyMemberIds)

    // Create recipe data for database
    const recipeData = createRecipeFromExtraction(
      adaptedRecipe,
      url,
      videoInfo.thumbnail,
      channelName || 'YouTube Import'
    )

    // Set publish status
    recipeData.published = autoPublish

    // Insert recipe into database
    const [insertedRecipe] = await db
      .insert(recipes)
      .values(recipeData)
      .returning()

    if (!insertedRecipe) {
      throw new Error('Failed to insert recipe')
    }

    // Insert video reference
    await db.insert(videos).values({
      recipeId: insertedRecipe.id,
      url: videoInfo.url,
      type: 'youtube',
      thumbnail: videoInfo.thumbnail,
      title: videoTitle,
      order: 0
    })

    // Return the imported recipe with adaptations
    return NextResponse.json({
      success: true,
      recipe: {
        id: insertedRecipe.id,
        title: insertedRecipe.title,
        slug: insertedRecipe.slug,
        ingredients: adaptedRecipe.adaptedIngredients.map(ing => ({
          amount: ing.amount,
          name: ing.name,
          originalName: ing.originalName,
          isSubstitution: ing.isSubstitution
        })),
        instructions: adaptedRecipe.instructions,
        adaptations: {
          excludedAllergens: adaptedRecipe.excludedAllergens,
          substitutionsMade: adaptedRecipe.substitutionsMade,
          notes: adaptedRecipe.adaptationNotes
        }
      },
      video: {
        videoId: videoInfo.videoId,
        thumbnail: videoInfo.thumbnail,
        embedUrl: videoInfo.embedUrl
      }
    })

  } catch (error) {
    console.error('YouTube import error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/youtube/import?familyMembers=1,2,3
 * Get default family members configuration
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    const mobileImportKey = request.headers.get('x-family-import-key')
    const expectedImportKey = process.env.FAMILY_IMPORT_KEY
    const hasValidMobileKey = Boolean(
      expectedImportKey &&
      mobileImportKey &&
      mobileImportKey === expectedImportKey
    )
    if (!session?.user && !hasValidMobileKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return default family member configurations
    return NextResponse.json({
      familyMembers: DEFAULT_FAMILY_MEMBERS.map((member, idx) => ({
        id: idx + 1,
        name: member.name,
        allergies: member.allergies,
        allergyDetails: member.allergyDetails,
        isActive: member.isActive
      })),
      defaultSelection: [1, 2, 3] // Default to all family members
    })

  } catch (error) {
    console.error('Error fetching family members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch family members' },
      { status: 500 }
    )
  }
}
