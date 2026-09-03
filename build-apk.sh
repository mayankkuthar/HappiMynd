#!/bin/bash
set -e

cd "$(dirname "$0")"

export NODE_OPTIONS=--openssl-legacy-provider

echo "Cleaning previous build..."
cd android && ./gradlew clean

echo "Building release APK..."
./gradlew assembleRelease

APK_PATH="app/build/outputs/apk/release/app-release.apk"

if [ -f "$APK_PATH" ]; then
  echo "✅ APK generated at: $APK_PATH"
else
  echo "❌ APK not found at expected path: $APK_PATH"
  exit 1
fi
