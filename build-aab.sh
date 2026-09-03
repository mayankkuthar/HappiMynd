#!/bin/bash
set -e

cd "$(dirname "$0")"

export NODE_OPTIONS=--openssl-legacy-provider

echo "Cleaning previous build..."
cd android && ./gradlew clean

echo "Building release AAB (Android App Bundle)..."
./gradlew bundleRelease

AAB_PATH="app/build/outputs/bundle/release/app-release.aab"

if [ -f "$AAB_PATH" ]; then
  echo "✅ AAB generated at: $AAB_PATH"
else
  echo "❌ AAB not found at expected path: $AAB_PATH"
  exit 1
fi
