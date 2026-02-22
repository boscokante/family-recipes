import Foundation

enum MobileAPIError: LocalizedError {
    case invalidURL
    case serverError(String)
    case invalidResponse

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid API URL."
        case .serverError(let message):
            return message
        case .invalidResponse:
            return "Invalid server response."
        }
    }
}

private struct APIIngredient: Codable {
    let amount: String
    let name: String
    let weightValue: Double?
    let weightUnit: String?
    let notes: String?
    let isOriginal: Bool?
    let originalName: String?
}

private struct APIRecipe: Codable {
    let id: Int
    let slug: String
    let title: String
    let description: String?
    let story: String?
    let servings: Int?
    let prepTime: Int?
    let cookTime: Int?
    let ingredients: [APIIngredient]?
    let instructions: [String]?
    let tips: String?
    let coverImage: String?
    let category: String?
    let cuisine: String?
    let tags: [String]?
    let contributedBy: String?
    let familyPhoto: String?
    let sourceUrl: String?
}

private struct APIImportRequest: Codable {
    let url: String
    let familyMemberIds: [Int]
    let autoPublish: Bool
}

private struct APIImportResponse: Codable {
    struct PayloadRecipe: Codable {
        let id: Int
        let title: String
        let slug: String
    }

    let success: Bool
    let recipe: PayloadRecipe?
    let error: String?
}

final class MobileAPI {
    static let shared = MobileAPI()
    private init() {}

    private var baseURL: String {
        (Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String)?
            .trimmingCharacters(in: .whitespacesAndNewlines) ?? "http://localhost:3000"
    }

    private var importKey: String? {
        (Bundle.main.object(forInfoDictionaryKey: "FAMILY_IMPORT_KEY") as? String)?
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    func fetchPublishedRecipes() async throws -> [Recipe] {
        guard let url = URL(string: "\(baseURL)/api/recipes") else {
            throw MobileAPIError.invalidURL
        }

        var request = URLRequest(url: url)
        if let importKey, !importKey.isEmpty {
            request.setValue(importKey, forHTTPHeaderField: "x-family-import-key")
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw MobileAPIError.invalidResponse
        }
        guard (200...299).contains(httpResponse.statusCode) else {
            throw MobileAPIError.serverError("Failed to fetch recipes: \(httpResponse.statusCode)")
        }

        let decoder = JSONDecoder()
        let apiRecipes = try decoder.decode([APIRecipe].self, from: data)
        return apiRecipes.map { item in
            Recipe(
                id: item.id,
                slug: item.slug,
                title: item.title,
                description: item.description,
                story: item.story,
                servings: item.servings,
                prepTime: item.prepTime,
                cookTime: item.cookTime,
                ingredients: (item.ingredients ?? []).map {
                    Ingredient(
                        amount: $0.amount,
                        name: $0.name,
                        weightValue: $0.weightValue,
                        weightUnit: $0.weightUnit,
                        notes: $0.notes,
                        isOriginal: $0.isOriginal,
                        originalName: $0.originalName
                    )
                },
                instructions: item.instructions ?? [],
                tips: item.tips,
                coverImage: item.coverImage,
                category: item.category,
                cuisine: item.cuisine,
                tags: item.tags,
                contributedBy: item.contributedBy,
                familyPhoto: item.familyPhoto,
                youtubeUrl: item.sourceUrl
            )
        }
    }

    func importFromYouTube(url youtubeURL: String, familyMemberIds: [Int] = [1, 2, 3]) async throws {
        guard let url = URL(string: "\(baseURL)/api/youtube/import") else {
            throw MobileAPIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let importKey, !importKey.isEmpty {
            request.setValue(importKey, forHTTPHeaderField: "x-family-import-key")
        }

        let payload = APIImportRequest(
            url: youtubeURL,
            familyMemberIds: familyMemberIds,
            autoPublish: true
        )
        request.httpBody = try JSONEncoder().encode(payload)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw MobileAPIError.invalidResponse
        }

        let decoded = try? JSONDecoder().decode(APIImportResponse.self, from: data)
        guard (200...299).contains(httpResponse.statusCode), decoded?.success == true else {
            throw MobileAPIError.serverError(decoded?.error ?? "YouTube import failed.")
        }
    }
}
