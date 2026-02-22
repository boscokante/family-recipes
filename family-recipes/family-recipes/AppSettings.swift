import Foundation
import SwiftUI

/// User-configurable app settings
@Observable
class AppSettings {
    static let shared = AppSettings()
    
    var familyName: String {
        didSet {
            UserDefaults.standard.set(familyName, forKey: "familyName")
        }
    }
    
    var showWelcomeOnLaunch: Bool {
        didSet {
            UserDefaults.standard.set(showWelcomeOnLaunch, forKey: "showWelcomeOnLaunch")
        }
    }
    
    private init() {
        self.familyName = UserDefaults.standard.string(forKey: "familyName") ?? ""
        self.showWelcomeOnLaunch = UserDefaults.standard.object(forKey: "showWelcomeOnLaunch") as? Bool ?? true
    }
    
    /// Get display name for family (custom or default)
    var displayFamilyName: String {
        familyName.isEmpty ? "My Family" : familyName
    }
    
    /// Reset to defaults
    func reset() {
        familyName = ""
        showWelcomeOnLaunch = true
    }
}
