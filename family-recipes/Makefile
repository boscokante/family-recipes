SIM_NAME ?= iPhone 15 Pro Max
SIM_OS ?= 18.3.1
DERIVED_DATA ?= /tmp/kinfood-dd
PROJECT = KinFood.xcodeproj
SCHEME = KinFood
BUNDLE_ID = com.electrospit.kinfood

# TestFlight / App Store Connect settings
ARCHIVE_PATH ?= /tmp/kinfood.xcarchive
IPA_PATH ?= /tmp/kinfood-ipa
ASC_ISSUER_ID ?= $(shell cat .asc-credentials 2>/dev/null | grep ISSUER_ID | cut -d= -f2)
ASC_API_KEY ?= $(shell cat .asc-credentials 2>/dev/null | grep API_KEY | cut -d= -f2)
ASC_PRIVATE_KEY_PATH ?= $(shell cat .asc-credentials 2>/dev/null | grep PRIVATE_KEY_PATH | cut -d= -f2)

.PHONY: ios-generate ios-build ios-test ios-run ios-all ios-archive ios-export ios-upload ios-beta ios-beta-clean ios-bump-build ios-bump-version ios-setup-asc

ios-generate:
	xcodegen generate --spec project.yml

ios-build: ios-generate
	xcodebuild build -project "$(PROJECT)" -scheme "$(SCHEME)" -destination 'platform=iOS Simulator,name=$(SIM_NAME),OS=$(SIM_OS)' -derivedDataPath "$(DERIVED_DATA)"

ios-test: ios-generate
	xcodebuild test -project "$(PROJECT)" -scheme "$(SCHEME)" -destination 'platform=iOS Simulator,name=$(SIM_NAME),OS=$(SIM_OS)' -derivedDataPath "$(DERIVED_DATA)"

ios-run: ios-build
	xcrun simctl boot "$(SIM_NAME)" || true
	xcrun simctl bootstatus "$(SIM_NAME)" -b
	xcrun simctl install "$(SIM_NAME)" "$(DERIVED_DATA)/Build/Products/Debug-iphonesimulator/KinFood.app"
	xcrun simctl launch "$(SIM_NAME)" "$(BUNDLE_ID)"

ios-all: ios-test ios-run

# TestFlight workflow
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
		echo "   Run: make ios-setup-asc to see instructions"; \
		exit 1; \
	fi
	@mkdir -p ~/.appstoreconnect/private_keys
	@cp "$(ASC_PRIVATE_KEY_PATH)" ~/.appstoreconnect/private_keys/ 2>/dev/null || true
	xcrun altool --upload-app \
		--type ios \
		--file "$(IPA_PATH)/KinFood.ipa" \
		--apiKey "$(ASC_API_KEY)" \
		--apiIssuer "$(ASC_ISSUER_ID)" \
		--verbose
	@echo ""
	@echo "✅ Upload complete! Check App Store Connect for the build."
	@echo "   https://appstoreconnect.apple.com/apps"

# Full TestFlight pipeline
ios-beta: ios-upload ios-beta-clean

ios-beta-clean:
	@echo "🧹 Cleaning up build artifacts..."
	@rm -rf "$(ARCHIVE_PATH)" "$(IPA_PATH)"

# Version management
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

# Setup instructions
ios-setup-asc:
	@echo "📋 App Store Connect API Setup Instructions:"
	@echo ""
	@echo "1. Go to https://appstoreconnect.apple.com/access/api"
	@echo "2. Click 'Generate API Key'"
	@echo "3. Name it 'TestFlight Upload' (or whatever)"
	@echo "4. Select 'App Manager' or 'Admin' access"
	@echo "5. Click 'Generate' and download the .p8 file"
	@echo "6. Note the Issuer ID and Key ID"
	@echo ""
	@echo "7. Create a file named .asc-credentials in this directory:"
	@echo "   ISSUER_ID=your-issuer-id-here"
	@echo "   API_KEY=your-key-id-here"
	@echo "   PRIVATE_KEY_PATH=/path/to/AuthKey_XXXXXX.p8"
	@echo ""
	@echo "⚠️  Never commit .asc-credentials to git! It's already in .gitignore"
	@echo ""
	@echo "After setup, run: make ios-beta"
