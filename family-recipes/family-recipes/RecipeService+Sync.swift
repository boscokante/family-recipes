import Foundation

extension RecipeService {
    private var cacheFilename: String { "cached_recipes.json" }

    func bootstrapRemoteSync() async {
        loadCachedRecipes()
        await refreshFromServer()
    }

    func refreshFromServer() async {
        do {
            let remote = try await MobileAPI.shared.fetchPublishedRecipes()
            guard !remote.isEmpty else { return }
            recipes = remote
            filterRecipes()
            saveCachedRecipes()
        } catch {
            // Keep offline data if network is unavailable.
            print("Recipe refresh skipped: \(error.localizedDescription)")
        }
    }

    func importYouTubeRecipe(_ youtubeURL: String, familyMemberIds: [Int]) async throws {
        try await MobileAPI.shared.importFromYouTube(url: youtubeURL, familyMemberIds: familyMemberIds)
        await refreshFromServer()
    }

    private func loadCachedRecipes() {
        guard let data = try? Data(contentsOf: cacheURL()),
              let cached = try? JSONDecoder().decode([Recipe].self, from: data),
              !cached.isEmpty else { return }
        recipes = cached
        filterRecipes()
    }

    private func saveCachedRecipes() {
        guard let data = try? JSONEncoder().encode(recipes) else { return }
        try? data.write(to: cacheURL(), options: .atomic)
    }

    private func cacheURL() -> URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        if !FileManager.default.fileExists(atPath: dir.path) {
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        }
        return dir.appendingPathComponent(cacheFilename)
    }
}
