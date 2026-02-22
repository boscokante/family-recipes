import { NextResponse } from 'next/server'
import { db } from '@/db'
import { recipes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

// GET /api/recipes - Get all published recipes
export async function GET() {
  try {
    const allRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.published, true))
      .orderBy(recipes.createdAt)

    return NextResponse.json(allRecipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create a new recipe (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { slug, title, description, story, servings, prepTime, cookTime, ingredients, instructions, tips, coverImage, category, cuisine, tags, contributedBy, familyPhoto } = body

    const [newRecipe] = await db
      .insert(recipes)
      .values({
        slug,
        title,
        description,
        story,
        servings,
        prepTime,
        cookTime,
        ingredients: ingredients || [],
        instructions: instructions || [],
        tips,
        coverImage,
        category,
        cuisine,
        tags: tags || [],
        contributedBy,
        familyPhoto,
        published: false, // Default to unpublished
      })
      .returning()

    return NextResponse.json(newRecipe, { status: 201 })
  } catch (error: any) {
    console.error('Error creating recipe:', error)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Recipe with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}


