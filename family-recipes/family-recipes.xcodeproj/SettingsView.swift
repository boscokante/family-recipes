//  SettingsView.swift
//  family-recipes
//
//  Created by Build Fixer on 2/22/26.
//

import SwiftUI

struct SettingsView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Text("Settings")
                    .font(.largeTitle)
                    .padding(.top, 32)

                Text("This is a placeholder for settings.")
                    .font(.body)
                    .foregroundColor(.secondary)

                Spacer()
            }
            .padding()
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    SettingsView()
}
