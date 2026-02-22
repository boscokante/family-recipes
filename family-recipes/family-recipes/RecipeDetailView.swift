//
//  RecipeDetailView.swift
//  family-recipes
//
//  Created by Bosco "Bosko" Kante on 1/26/26.
//

import SwiftUI

struct RecipeDetailView: View {
    let recipe: Recipe
    @State private var scale: Double = 1.0
    @State private var showWeights: Bool = false
    @State private var showCamera: Bool = false
    @State private var capturedImage: UIImage?
    
    @StateObject private var cameraService = CameraService()
    
    private let scaleOptions: [Double] = [0.5, 1.0, 1.5, 2.0, 3.0]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Cover Image
                if let coverImage = recipe.coverImage, let url = URL(string: coverImage) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Color.gray.opacity(0.2))
                            .frame(height: 200)
                    }
                    .frame(height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                if let youtubeURL = recipe.youtubeUrl, !youtubeURL.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Video")
                            .font(.headline)
                        YouTubeEmbedView(youtubeURL: youtubeURL)
                            .frame(height: 220)
                            .clipShape(RoundedRectangle(cornerRadius: 12))

                        if let safeURL = URL(string: youtubeURL) {
                            Link(destination: safeURL) {
                                Label("Open on YouTube", systemImage: "play.rectangle")
                                    .font(.caption)
                            }
                        }
                    }
                }
                
                VStack(alignment: .leading, spacing: 16) {
                    // Title & Camera Button
                    HStack {
                        Text(recipe.title)
                            .font(.largeTitle)
                            .bold()
                        
                        Spacer()
                        
                        Button {
                            cameraService.checkPermissions()
                            showCamera = true
                        } label: {
                            Image(systemName: "camera.fill")
                                .font(.title2)
                                .foregroundColor(.blue)
                                .padding(8)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(Circle())
                        }
                    }
                    
                    // Metadata & Scaling
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 16) {
                            if let prepTime = recipe.prepTime {
                                Label("\(prepTime) min", systemImage: "clock")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            if let cookTime = recipe.cookTime {
                                Label("\(cookTime) min", systemImage: "flame")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            if let servings = recipe.servings {
                                let scaledServings = Double(servings) * scale
                                Label("\(Int(scaledServings)) servings", systemImage: "person.2")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        HStack {
                            Text("Scale:")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            
                            Picker("Scale", selection: $scale) {
                                ForEach(scaleOptions, id: \.self) { option in
                                    Text(String(format: "%.1fx", option)).tag(option)
                                }
                            }
                            .pickerStyle(.segmented)
                            .frame(maxWidth: 250)
                            
                            Spacer()
                            
                            Button {
                                withAnimation {
                                    showWeights.toggle()
                                }
                            } label: {
                                Image(systemName: showWeights ? "scalemass.fill" : "scalemass")
                                    .foregroundColor(showWeights ? .blue : .secondary)
                            }
                        }
                    }
                    
                    if let category = recipe.category {
                        Text(category.capitalized)
                            .font(.subheadline)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .clipShape(Capsule())
                    }
                    
                    // Captured Image Preview (if any)
                    if let image = capturedImage {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Your Photo")
                                .font(.headline)
                            Image(uiImage: image)
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(maxHeight: 300)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            
                            Text("Shared with family!")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                    }
                    
                    // Story
                    if let story = recipe.story, !story.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("The Story")
                                .font(.headline)
                            Text(story)
                                .font(.body)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    
                    // Description
                    if let description = recipe.description, !description.isEmpty {
                        Text(description)
                            .font(.body)
                            .foregroundColor(.secondary)
                    }
                    
                    // Ingredients
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Ingredients")
                            .font(.headline)
                        
                        ForEach(Array(recipe.ingredients.enumerated()), id: \.offset) { _, ingredient in
                            HStack(alignment: .top, spacing: 8) {
                                Text("•")
                                    .foregroundColor(.secondary)
                                VStack(alignment: .leading, spacing: 2) {
                                    HStack {
                                        if showWeights {
                                            // Try explicit weight first, then convert from volume
                                            if let weight = ingredient.weightValue, let unit = ingredient.weightUnit {
                                                let scaledWeight = weight * scale
                                                Text(String(format: "%.0f%@", scaledWeight, unit))
                                                    .fontWeight(.bold)
                                                    .foregroundColor(.blue)
                                            } else if let converted = RecipeUtils.convertToWeight(amount: ingredient.amount, ingredientName: ingredient.name) {
                                                let scaledWeight = converted.value * scale
                                                Text(String(format: "%.0f%@", scaledWeight, converted.unit))
                                                    .fontWeight(.bold)
                                                    .foregroundColor(.blue)
                                            } else if !ingredient.amount.isEmpty {
                                                Text(RecipeUtils.scaleAmount(ingredient.amount, by: scale))
                                                    .fontWeight(.medium)
                                            }
                                        } else if !ingredient.amount.isEmpty {
                                            Text(RecipeUtils.scaleAmount(ingredient.amount, by: scale))
                                                .fontWeight(.medium)
                                        }
                                        Text(ingredient.name)
                                    }
                                    if let notes = ingredient.notes, !notes.isEmpty {
                                        Text(notes)
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    
                    // Instructions
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Instructions")
                            .font(.headline)
                        
                        ForEach(Array(recipe.instructions.enumerated()), id: \.offset) { index, instruction in
                            HStack(alignment: .top, spacing: 12) {
                                Text("\(index + 1)")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(width: 28, height: 28)
                                    .background(Color.blue)
                                    .clipShape(Circle())
                                
                                Text(instruction)
                                    .font(.body)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    
                    // Tips
                    if let tips = recipe.tips, !tips.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Tips")
                                .font(.headline)
                            Text(tips)
                                .font(.body)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .background(Color.yellow.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    
                    // Contributed By
                    if let contributedBy = recipe.contributedBy, !contributedBy.isEmpty {
                        Text("Contributed by \(contributedBy)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .italic()
                    }
                }
                .padding()
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showCamera) {
            ImagePicker(image: $capturedImage)
        }
    }
}

#Preview {
    NavigationView {
        RecipeDetailView(recipe: Recipe(
            id: 1,
            slug: "test",
            title: "Test Recipe",
            description: "A test recipe",
            story: "This is a test story",
            servings: 4,
            prepTime: 20,
            cookTime: 30,
            ingredients: [
                Ingredient(amount: "1 cup", name: "flour", weightValue: 120, weightUnit: "g", notes: nil, isOriginal: nil, originalName: nil)
            ],
            instructions: ["Step 1", "Step 2"],
            tips: "Test tip",
            coverImage: nil,
            category: "main",
            cuisine: "American",
            tags: nil,
            contributedBy: "Test",
            familyPhoto: nil
        ))
    }
}
