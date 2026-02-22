//
//  RecipeListView.swift
//  family-recipes
//
//  Created by Bosco "Bosko" Kante on 1/26/26.
//

import SwiftUI

struct RecipeListView: View {
    @StateObject private var recipeService = RecipeService.shared
    @State private var showImportSheet = false
    @State private var showSettingsSheet = false
    @State private var importURL = ""
    @State private var importError: String?
    @State private var isImporting = false
    @State private var hasBootstrapped = false
    @State private var selectedFamilyMemberIds: Set<Int> = [1, 2, 3]
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField("Search recipes...", text: $recipeService.searchText)
                        .textFieldStyle(.plain)
                        .autocorrectionDisabled()
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding(.horizontal)
                .padding(.top, 8)
                
                // Recipe List
                if recipeService.filteredRecipes.isEmpty {
                    VStack(spacing: 16) {
                        Image(systemName: "magnifyingglass")
                            .font(.largeTitle)
                            .foregroundColor(.secondary)
                        Text("No recipes found")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        Text("Try a different search term")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(recipeService.filteredRecipes) { recipe in
                        NavigationLink(destination: RecipeDetailView(recipe: recipe)) {
                            RecipeRowView(recipe: recipe)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("\(AppSettings.shared.displayFamilyName) Recipes")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        Task { await recipeService.refreshFromServer() }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack {
                        Button {
                            showSettingsSheet = true
                        } label: {
                            Image(systemName: "gear")
                        }
                        Button {
                            importError = nil
                            showImportSheet = true
                        } label: {
                            Label("Import", systemImage: "plus.rectangle.on.rectangle")
                        }
                    }
                }
            }
            .sheet(isPresented: $showImportSheet) {
                NavigationView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Paste a YouTube recipe link. The backend will extract + adapt it, then it appears in your library and is cached offline.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        TextField("https://www.youtube.com/watch?v=...", text: $importURL)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                            .textFieldStyle(.roundedBorder)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Adapt for \(AppSettings.shared.displayFamilyName)")
                                .font(.caption)
                                .foregroundColor(.secondary)

                            Toggle("Bosko (dairy, gluten, cashew)", isOn: bindingForMember(1))
                            Toggle("Maya (citrus, shellfish)", isOn: bindingForMember(2))
                            Toggle("Che (dairy, gluten, fish, citrus)", isOn: bindingForMember(3))

                            HStack {
                                Button("All Family Members") {
                                    selectedFamilyMemberIds = [1, 2, 3]
                                }
                                .font(.caption)
                                .buttonStyle(.bordered)

                                Button("Clear") {
                                    selectedFamilyMemberIds = []
                                }
                                .font(.caption)
                                .buttonStyle(.bordered)
                            }
                        }

                        if let importError, !importError.isEmpty {
                            Text(importError)
                                .font(.caption)
                                .foregroundColor(.red)
                        }

                        Button {
                            Task {
                                await runImport()
                            }
                        } label: {
                            HStack {
                                if isImporting {
                                    ProgressView()
                                }
                                Text(isImporting ? "Importing..." : "Import Recipe")
                            }
                            .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(
                            importURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ||
                            isImporting ||
                            selectedFamilyMemberIds.isEmpty
                        )

                        Spacer()
                    }
                    .padding()
                    .navigationTitle("YouTube Import")
                    .toolbar {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button("Cancel") {
                                showImportSheet = false
                            }
                        }
                    }
                }
            }
            .sheet(isPresented: $showSettingsSheet) {
                SettingsView()
            }
            .task {
                guard !hasBootstrapped else { return }
                hasBootstrapped = true
                await recipeService.bootstrapRemoteSync()
            }
        }
    }

    private func runImport() async {
        isImporting = true
        defer { isImporting = false }

        do {
            try await recipeService.importYouTubeRecipe(
                importURL.trimmingCharacters(in: .whitespacesAndNewlines),
                familyMemberIds: selectedFamilyMemberIds.sorted()
            )
            importURL = ""
            showImportSheet = false
        } catch {
            importError = error.localizedDescription
        }
    }

    private func bindingForMember(_ memberId: Int) -> Binding<Bool> {
        Binding(
            get: { selectedFamilyMemberIds.contains(memberId) },
            set: { isSelected in
                if isSelected {
                    selectedFamilyMemberIds.insert(memberId)
                } else {
                    selectedFamilyMemberIds.remove(memberId)
                }
            }
        )
    }
}

struct RecipeRowView: View {
    let recipe: Recipe
    
    var body: some View {
        HStack(spacing: 12) {
            if let coverImage = recipe.coverImage, let url = URL(string: coverImage) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Color.gray.opacity(0.2))
                }
                .frame(width: 60, height: 60)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            } else {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray.opacity(0.2))
                    .frame(width: 60, height: 60)
                    .overlay(
                        Image(systemName: "photo")
                            .foregroundColor(.gray)
                    )
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(recipe.title)
                    .font(.headline)
                    .lineLimit(2)
                
                if let category = recipe.category {
                    Text(category.capitalized)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                if let contributedBy = recipe.contributedBy, !contributedBy.isEmpty {
                    Text("By \(contributedBy)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    RecipeListView()
}
