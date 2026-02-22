//  AppSettings.swift
//  family-recipes
//
//  Created by Build Fixer on 2/22/26.
//

import Foundation

final class AppSettings: ObservableObject {
    static let shared = AppSettings()
    
    // You can customize this property as needed
    @Published var displayFamilyName: String = "Kante"
    
    private init() {}
}
