//
//  Recipe.swift
//  family-recipes
//
//  Created by Bosco "Bosko" Kante on 1/26/26.
//

import Foundation

struct Ingredient: Codable {
    let amount: String
    let name: String
    let weightValue: Double?
    let weightUnit: String?
    let notes: String?
    let isOriginal: Bool?
    let originalName: String?
}

struct Recipe: Identifiable, Codable {
    let id: Int
    let slug: String
    let title: String
    let description: String?
    let story: String?
    let servings: Int?
    let prepTime: Int?
    let cookTime: Int?
    let ingredients: [Ingredient]
    let instructions: [String]
    let tips: String?
    let coverImage: String?
    let category: String?
    let cuisine: String?
    let tags: [String]?
    let contributedBy: String?
    let familyPhoto: String?
    let youtubeUrl: String?

    init(
        id: Int,
        slug: String,
        title: String,
        description: String?,
        story: String?,
        servings: Int?,
        prepTime: Int?,
        cookTime: Int?,
        ingredients: [Ingredient],
        instructions: [String],
        tips: String?,
        coverImage: String?,
        category: String?,
        cuisine: String?,
        tags: [String]?,
        contributedBy: String?,
        familyPhoto: String?,
        youtubeUrl: String? = nil
    ) {
        self.id = id
        self.slug = slug
        self.title = title
        self.description = description
        self.story = story
        self.servings = servings
        self.prepTime = prepTime
        self.cookTime = cookTime
        self.ingredients = ingredients
        self.instructions = instructions
        self.tips = tips
        self.coverImage = coverImage
        self.category = category
        self.cuisine = cuisine
        self.tags = tags
        self.contributedBy = contributedBy
        self.familyPhoto = familyPhoto
        self.youtubeUrl = youtubeUrl
    }
}
