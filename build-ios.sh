#!/bin/bash
set -euo pipefail

# ─── Configuration ───────────────────────────────────────────────
SCHEME="HappiMynd"
WORKSPACE="ios/HappiMynd.xcworkspace"
CONFIGURATION="Release"
EXPORT_OPTIONS="ios/ExportOptions.plist"
ARCHIVE_PATH="/tmp/HappiMynd.xcarchive"
EXPORT_PATH="/tmp/HappiMyndIPA"
BUNDLE_OUTPUT="ios/main.jsbundle"
ASSETS_DEST="build/bundle-assets"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ─── Help ─────────────────────────────────────────────────────────
usage() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Build and export iOS archive for App Store submission."
  echo ""
  echo "Options:"
  echo "  -h, --help       Show this help"
  echo "  -u, --upload     Upload to App Store Connect after export"
  echo "  -a, --apple-id   Apple ID email for upload (required with -u)"
  echo "  -p, --password   App-specific password or '@keychain:ITEM'"
  echo ""
  echo "Examples:"
  echo "  $0                          # Build + export IPA only"
  echo "  $0 -u -a user@example.com   # Build + export + upload"
  echo "  $0 -u -a user@example.com -p '@keychain:AC_PASSWORD'"
  exit 0
}

UPLOAD=false
APPLE_ID=""
APP_SPECIFIC_PASSWORD=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -u|--upload) UPLOAD=true; shift ;;
    -a|--apple-id) APPLE_ID="$2"; shift 2 ;;
    -p|--password) APP_SPECIFIC_PASSWORD="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

# ─── Prerequisites ────────────────────────────────────────────────
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo -e "${CYAN}━━━ iOS Archive Build ━━━${NC}"
echo "  Root:       $ROOT_DIR"
echo "  Scheme:     $SCHEME"
echo "  Config:     $CONFIGURATION"
echo ""

# ─── Step 1: Generate JS Bundle ───────────────────────────────────
echo -e "${YELLOW}[1/4] Generating JS bundle...${NC}"
export NODE_OPTIONS=--openssl-legacy-provider
rm -rf "$ASSETS_DEST"
node node_modules/react-native/local-cli/cli.js bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output "$BUNDLE_OUTPUT" \
  --assets-dest "$ASSETS_DEST"
echo -e "${GREEN}  ✓ Bundle written to $BUNDLE_OUTPUT${NC}"
echo ""

# ─── Step 2: Archive ──────────────────────────────────────────────
echo -e "${YELLOW}[2/4] Archiving...${NC}"
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  | xcpretty || xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    -allowProvisioningUpdates
echo -e "${GREEN}  ✓ Archive created at $ARCHIVE_PATH${NC}"
echo ""

# ─── Step 3: Export IPA ──────────────────────────────────────────
echo -e "${YELLOW}[3/4] Exporting IPA...${NC}"
rm -rf "$EXPORT_PATH"
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -allowProvisioningUpdates

IPA="$EXPORT_PATH/$SCHEME.ipa"
if [ -f "$IPA" ]; then
  echo -e "${GREEN}  ✓ IPA exported to $IPA${NC}"
else
  # xcodebuild may lowercase the filename
  IPA="$EXPORT_PATH/$(echo "$SCHEME" | tr '[:upper:]' '[:lower:]').ipa"
  if [ -f "$IPA" ]; then
    echo -e "${GREEN}  ✓ IPA exported to $IPA${NC}"
  else
    echo -e "${RED}  ✗ IPA not found at expected path${NC}"
    ls "$EXPORT_PATH/"
    exit 1
  fi
fi
echo ""

# ─── Step 4: Validate IPA ────────────────────────────────────────
echo -e "${YELLOW}[4/4] Validating IPA...${NC}"
echo -e "  ${CYAN}Verifying Info.plist...${NC}"
PLIST=$(mktemp)
unzip -p "$IPA" "Payload/$SCHEME.app/Info.plist" > "$PLIST" 2>/dev/null || \
  unzip -p "$IPA" "Payload/$(echo "$SCHEME" | tr '[:upper:]' '[:lower:]').app/Info.plist" > "$PLIST" 2>/dev/null || true

if [ -s "$PLIST" ]; then
  VERSION=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "$PLIST" 2>/dev/null || echo "unknown")
  BUILD=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "$PLIST" 2>/dev/null || echo "unknown")
  BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" "$PLIST" 2>/dev/null || echo "unknown")
  echo -e "  Bundle ID:    $BUNDLE_ID"
  echo -e "  Version:      $VERSION"
  echo -e "  Build:        $BUILD"
  echo -e "${GREEN}  ✓ Info.plist valid${NC}"
else
  echo -e "${YELLOW}  ⚠ Could not parse Info.plist from IPA${NC}"
fi
rm -f "$PLIST"

echo ""
echo -e "${CYAN}━━━ Checking for bitcode in embedded frameworks...${NC}"
TEMP_DIR=$(mktemp -d)
unzip -q "$IPA" -d "$TEMP_DIR" 2>/dev/null || true
BITCODE_FOUND=false
find "$TEMP_DIR/Payload" -name "*.framework" -type d 2>/dev/null | while read -r fw; do
  binary="$fw/$(basename "$fw" .framework)"
  if [ -f "$binary" ] && file "$binary" | grep -q "Mach-O"; then
    if otool -l "$binary" 2>/dev/null | grep -q "__LLVM"; then
      echo -e "${RED}  ✗ Bitcode found in: $binary${NC}"
      BITCODE_FOUND=true
    fi
  fi
done
if [ "$BITCODE_FOUND" = false ]; then
  echo -e "${GREEN}  ✓ No bitcode detected in embedded frameworks${NC}"
fi
rm -rf "$TEMP_DIR"

# ─── Optional: Upload to App Store Connect ────────────────────────
if [ "$UPLOAD" = true ]; then
  if [ -z "$APPLE_ID" ]; then
    echo -e "${RED}  ✗ --apple-id is required for upload${NC}"
    exit 1
  fi
  if [ -z "$APP_SPECIFIC_PASSWORD" ]; then
    echo -e "${YELLOW}  ⚠ No password provided. Attempting keychain lookup...${NC}"
    APP_SPECIFIC_PASSWORD="@keychain:AC_PASSWORD"
  fi
  echo ""
  echo -e "${YELLOW}[upload] Uploading to App Store Connect...${NC}"
  xcrun altool --upload-app \
    -f "$IPA" \
    -u "$APPLE_ID" \
    -p "$APP_SPECIFIC_PASSWORD" \
    2>&1
  echo -e "${GREEN}  ✓ Upload submitted${NC}"
fi

# ─── Summary ──────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━ Summary ━━━${NC}"
echo "  Archive:  $ARCHIVE_PATH"
echo "  IPA:      $IPA"
echo "  Export:   $EXPORT_PATH"
if [ "$UPLOAD" = true ]; then
  echo "  Upload:   Submitted to App Store Connect"
fi
echo -e "${GREEN}━━━ Done ━━━${NC}"
