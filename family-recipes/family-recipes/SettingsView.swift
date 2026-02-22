import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var familyName = ""
    @State private var showWelcome = true
    
    var body: some View {
        NavigationView {
            Form {
                Section("Family Settings") {
                    TextField("Family Name", text: $familyName, prompt: Text("e.g., Smith, Johnson"))
                        .autocorrectionDisabled()
                    
                    Text("This name appears throughout the app and on imported recipes.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Section("App Settings") {
                    Toggle("Show Welcome on Launch", isOn: $showWelcome)
                }
                
                Section {
                    Button("Reset to Defaults") {
                        familyName = ""
                        showWelcome = true
                    }
                    .foregroundColor(.red)
                }
                
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("About SafePlate")
                            .font(.headline)
                        Text("SafePlate helps families with allergies discover and adapt recipes from YouTube. Paste a recipe video link, and SafePlate will extract the ingredients, then adapt them for your family's specific dietary needs.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 8)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        saveSettings()
                        dismiss()
                    }
                }
            }
            .onAppear {
                loadSettings()
            }
        }
    }
    
    private func loadSettings() {
        familyName = AppSettings.shared.familyName
        showWelcome = AppSettings.shared.showWelcomeOnLaunch
    }
    
    private func saveSettings() {
        AppSettings.shared.familyName = familyName
        AppSettings.shared.showWelcomeOnLaunch = showWelcome
    }
}

#Preview {
    SettingsView()
}
