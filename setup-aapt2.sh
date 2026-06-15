#!/bin/bash
# Replaces AGP 7.4.2's bundled AAPT2 with the one from build-tools 37.0.0.
# Required to compile with compileSdkVersion 36+ (older AAPT2 can't parse android-36's android.jar).
#
# Run this once after any Gradle cache clear, e.g.:
#   ./gradlew clean
#   ./setup-aapt2.sh
#   ./gradlew installDebug

set -euo pipefail

AAPT2_VERSION="7.4.2-8841542"
BUILD_TOOLS_AAPT2="$HOME/Library/Android/sdk/build-tools/37.0.0/aapt2"

# Locate the AAPT2 jar in the Gradle cache
AAPT2_JAR=$(find "$HOME/.gradle/caches/modules-2/files-2.1/com.android.tools.build/aapt2/$AAPT2_VERSION" -name "aapt2-$AAPT2_VERSION-osx.jar" 2>/dev/null | head -1)

if [ -z "$AAPT2_JAR" ]; then
  echo "ERROR: AAPT2 jar not found at expected path."
  echo "Run './gradlew installDebug' first to populate the cache, then run this script."
  exit 1
fi

if [ ! -f "$BUILD_TOOLS_AAPT2" ]; then
  echo "ERROR: build-tools 37.0.0 AAPT2 not found at:"
  echo "  $BUILD_TOOLS_AAPT2"
  echo "Install build-tools 37.0.0 via SDK Manager first."
  exit 1
fi

# Replace the aapt2 binary inside the jar
echo "Replacing AAPT2 in: $(basename "$AAPT2_JAR")"
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"
jar xf "$AAPT2_JAR"
cp "$BUILD_TOOLS_AAPT2" aapt2
jar uf "$AAPT2_JAR" aapt2
rm -rf "$TEMP_DIR"
echo "  ✓ Jar updated"

# Replace the extracted copy in the transforms directory
TRANSFORM_DIR=$(find "$HOME/.gradle/caches/transforms-3" -path "*/aapt2-$AAPT2_VERSION-osx" -type d 2>/dev/null | head -1)
if [ -n "$TRANSFORM_DIR" ] && [ -f "$TRANSFORM_DIR/aapt2" ]; then
  cp "$BUILD_TOOLS_AAPT2" "$TRANSFORM_DIR/aapt2"
  echo "  ✓ Transform dir updated ($(basename "$TRANSFORM_DIR"))"
fi

echo "Done. AAPT2 version now:"
"$BUILD_TOOLS_AAPT2" version
