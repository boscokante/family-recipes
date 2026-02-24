# iOS Development & TestFlight Automation in Cursor

This guide explains how to configure an iOS project to be developed, built, tested, and deployed to TestFlight entirely from the command line using Cursor (or any terminal). 

By using **XcodeGen** and a **Makefile**, we eliminate the need to manually edit `.xcodeproj` files (which AI agents struggle with) and fully automate the App Store Connect upload process.

## Why This Workflow?

1. **AI-Friendly:** Cursor/AI agents struggle to edit the complex, XML-like `project.pbxproj` file safely. A `project.yml` is simple, readable, and perfectly suited for AI generation and modification.
2. **Git-Friendly:** No more merge conflicts in the `.xcodeproj` file. The project file is generated on the fly and ignored in git.
3. **Speed:** You can build, test, and run the app in the simulator directly from the integrated terminal without context-switching to Xcode.

---

## Prerequisites

Ensure you have the required CLI tools installed via Homebrew:

```bash
brew install xcodegen
```

---

## 1. Project Configuration (`project.yml`)

Instead of managing settings in Xcode, define your project declaratively in a `project.yml` file. This file generates the `.xcodeproj` on the fly.

Create `project.yml` at the root of your iOS code:

```yaml
name: YourAppName
options:
  minimumXcodeGenVersion: 2.38.0
  deploymentTarget:
    iOS: "16.0" # Update as needed
  createIntermediateGroups: true

settings:
  base:
    SWIFT_VERSION: "5.0"
    DEVELOPMENT_TEAM: YOUR_TEAM_ID # e.g., 3L66A32827
    CURRENT_PROJECT_VERSION: 1
    MARKETING_VERSION: 1.0
    TARGETED_DEVICE_FAMILY: "1,2" # 1=iPhone, 2=iPad
    CODE_SIGN_STYLE: Automatic
  configs:
    Debug:
      SWIFT_ACTIVE_COMPILATION_CONDITIONS: DEBUG

targets:
  YourAppName:
    type: application
    platform: iOS
    sources:
      - path: YourAppName # Folder containing your Swift files
        excludes:
          - Info.plist
    resources:
      - YourAppName/Assets.xcassets
      - YourAppName/Preview Content/Preview Assets.xcassets
      # Add LaunchScreen.storyboard here if you have one
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: com.yourcompany.yourappname
        INFOPLIST_FILE: YourAppName/Info.plist
        GENERATE_INFOPLIST_FILE: "YES"
        INFOPLIST_KEY_CFBundleDisplayName: YourAppName
        ASSETCATALOG_COMPILER_APPICON_NAME: AppIcon

  YourAppNameTests:
    type: bundle.unit-test
    platform: iOS
    sources:
      - YourAppNameTests
    dependencies:
      - target: YourAppName
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: com.yourcompany.yourappname.tests
        GENERATE_INFOPLIST_FILE: "YES"

schemes:
  YourAppName:
    build:
      targets:
        YourAppName: all
        YourAppNameTests: [test]
    test:
      targets:
        - name: YourAppNameTests
```

---

## 2. TestFlight Export Configuration (`ExportOptions.plist`)

To upload via command line, `xcodebuild` needs to know how to export the archive. Create `ExportOptions.plist` next to your `project.yml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>destination</key>
    <string>export</string>
    <key>uploadSymbols</key>
    <true/>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>generateAppStoreInformation</key>
    <false/>
    <key>manageAppVersionAndBuildNumber</key>
    <false/>
</dict>
</plist>
```

---

## 3. App Store Connect Credentials

To upload to TestFlight without opening Xcode or Transporter, you need an App Store Connect API Key.

1. Go to [App Store Connect API Keys](https://appstoreconnect.apple.com/access/api).
2. Click **Generate API Key** (Name it "CLI Upload", give it "App Manager" access).
3. Note the **Issuer ID** and **Key ID**.
4. Download the `.p8` file.
5. Create a file named `.asc-credentials` in your project root:

```bash
ISSUER_ID=your-issuer-id-here
API_KEY=your-key-id-here
PRIVATE_KEY_PATH=/path/to/your/AuthKey_XXXXXX.p8
BUNDLE_ID=com.yourcompany.yourappname
```

⚠️ **CRITICAL:** Add `.asc-credentials` and `*.p8` to your `.gitignore` immediately!

---

## 4. The Master Makefile

Create a `Makefile` that ties everything together. It handles local generation, building, running in the simulator, and uploading to TestFlight.

```makefile
# Variables - Update these for your project
SIM_NAME ?= iPhone 15 Pro Max
SIM_OS ?= 18.0
DERIVED_DATA ?= /tmp/yourapp-dd
PROJECT = YourAppName.xcodeproj
SCHEME = YourAppName
BUNDLE_ID = com.yourcompany.yourappname

# TestFlight / App Store Connect settings
ARCHIVE_PATH ?= /tmp/yourapp.xcarchive
IPA_PATH ?= /tmp/yourapp-ipa
ASC_ISSUER_ID ?= $(shell cat .asc-credentials 2>/dev/null | grep ISSUER_ID | cut -d= -f2)
ASC_API_KEY ?= $(shell cat .asc-credentials 2>/dev/null | grep API_KEY | cut -d= -f2)
ASC_PRIVATE_KEY_PATH ?= $(shell cat .asc-credentials 2>/dev/null | grep PRIVATE_KEY_PATH | cut -d= -f2)

.PHONY: ios-generate ios-build ios-test ios-run ios-all ios-archive ios-export ios-upload ios-beta ios-beta-clean ios-bump-build ios-bump-version

# --- Local Development ---

ios-generate:
	xcodegen generate --spec project.yml

ios-build: ios-generate
	xcodebuild build -project "$(PROJECT)" -scheme "$(SCHEME)" -destination 'platform=iOS Simulator,name=$(SIM_NAME),OS=$(SIM_OS)' -derivedDataPath "$(DERIVED_DATA)"

ios-test: ios-generate
	xcodebuild test -project "$(PROJECT)" -scheme "$(SCHEME)" -destination 'platform=iOS Simulator,name=$(SIM_NAME),OS=$(SIM_OS)' -derivedDataPath "$(DERIVED_DATA)"

ios-run: ios-build
	xcrun simctl boot "$(SIM_NAME)" || true
	xcrun simctl bootstatus "$(SIM_NAME)" -b
	xcrun simctl install "$(SIM_NAME)" "$(DERIVED_DATA)/Build/Products/Debug-iphonesimulator/$(SCHEME).app"
	xcrun simctl launch "$(SIM_NAME)" "$(BUNDLE_ID)"

ios-all: ios-test ios-run

# --- App Store / TestFlight Upload ---

ios-archive: ios-generate
	@echo "📦 Archiving for App Store..."
	xcodebuild archive \
		-project "$(PROJECT)" \
		-scheme "$(SCHEME)" \
		-destination "generic/platform=iOS" \
		-archivePath "$(ARCHIVE_PATH)" \
		-allowProvisioningUpdates

ios-export: ios-archive
	@echo "📤 Exporting IPA..."
	xcodebuild -exportArchive \
		-archivePath "$(ARCHIVE_PATH)" \
		-exportPath "$(IPA_PATH)" \
		-exportOptionsPlist ExportOptions.plist \
		-allowProvisioningUpdates

ios-upload: ios-export
	@echo "⬆️  Uploading to App Store Connect..."
	@if [ -z "$(ASC_ISSUER_ID)" ] || [ -z "$(ASC_API_KEY)" ] || [ -z "$(ASC_PRIVATE_KEY_PATH)" ]; then \
		echo "❌ Error: App Store Connect credentials not set!"; \
		exit 1; \
	fi
	xcrun altool --upload-app \
		--type ios \
		--file "$(IPA_PATH)/$(SCHEME).ipa" \
		--apiKey "$(ASC_API_KEY)" \
		--apiIssuer "$(ASC_ISSUER_ID)" \
		--verbose
	@echo "✅ Upload complete! Check App Store Connect."

ios-beta-clean:
	@echo "🧹 Cleaning up build artifacts..."
	@rm -rf "$(ARCHIVE_PATH)" "$(IPA_PATH)"

ios-beta: ios-upload ios-beta-clean

# --- Version Management ---

ios-bump-build:
	@echo "🔢 Bumping build number..."
	@current_build=$$(grep "CURRENT_PROJECT_VERSION:" project.yml | sed 's/.*: //'); \
	new_build=$$((current_build + 1)); \
	sed -i '' "s/CURRENT_PROJECT_VERSION: $$current_build/CURRENT_PROJECT_VERSION: $$new_build/" project.yml; \
	echo "Build number: $$current_build → $$new_build"; \
	xcodegen generate --spec project.yml

ios-bump-version:
	@echo "📌 Current version: $$(grep "MARKETING_VERSION:" project.yml | sed 's/.*: //')"
	@read -p "Enter new version (e.g., 1.1): " new_version; \
	current_version=$$(grep "MARKETING_VERSION:" project.yml | sed 's/.*: //'); \
	sed -i '' "s/MARKETING_VERSION: \"$$current_version\"/MARKETING_VERSION: \"$$new_version\"/" project.yml; \
	sed -i '' "s/CURRENT_PROJECT_VERSION:.*/CURRENT_PROJECT_VERSION: 1/" project.yml; \
	echo "Version: $$current_version → $$new_version (build reset to 1)"; \
	xcodegen generate --spec project.yml
```

---

## 5. Git Configuration (`.gitignore`)

Add these lines to your `.gitignore`:

```gitignore
# Xcode (Auto-generated by XcodeGen)
*.xcodeproj/
*.xcworkspace/
xcuserdata/
DerivedData/
build/

# Archiving
*.xcarchive
*.ipa
*.dSYM.zip
*.dSYM

# App Store Connect credentials (NEVER commit these!)
.asc-credentials
*.p8
AuthKey_*

# XcodeGen
~/.xcodegen/
```

---

## Daily Workflow for Cursor/AI

When starting a new session or working with an AI agent, use this workflow:

### Adding New Swift Files
1. Create the new `.swift` file anywhere inside your `sources` path.
2. Because `project.yml` automatically includes everything in the folder, you do *not* need to manually link the file in Xcode.
3. Run `make ios-generate` to regenerate the project file.

### Local Development
- **Build only (check for errors):** `make ios-build`
- **Run in Simulator:** `make ios-run`
- **Run Tests & Simulator:** `make ios-all`

### Debugging Build Errors
If `make ios-build` fails, read the terminal output. Swift compiler errors will show the exact file, line number, and error description. Fix the code in the editor and run `make ios-build` again.

### TestFlight Deployment
When you are ready to send a build to testers:
1. `make ios-bump-build` (Increments the build number in `project.yml`)
2. `make ios-beta` (Archives, exports, uploads to App Store Connect, and cleans up artifacts)

**Troubleshooting Uploads:** 
- If `altool` fails with an authentication error, double-check your `.asc-credentials` file and ensure the `.p8` file path is absolute and correct.
- If it fails because of missing Provisioning Profiles, ensure the App exists in App Store Connect first, and that you have added your Apple ID account to Xcode's Preferences. The `-allowProvisioningUpdates` flag will handle the rest.

### When do you actually need Xcode?
You will rarely need Xcode, but you might still need to open it for:
1. Editing complex Storyboards or XIBs (e.g., `LaunchScreen.storyboard`).
2. Managing complex CoreData models (`.xcdatamodeld`).
3. The very first time you need to upload a build to App Store Connect (to auto-generate the cloud provisioning profiles).
4. Deep visual debugging using the View Hierarchy debugger. 

For 95% of standard SwiftUI development, you can stay entirely inside Cursor.
