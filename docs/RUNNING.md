# Running HappiMynd App

## Prerequisites

- Node.js (v14+)
- Android Studio with Android SDK (API 33)
- AVD configured (e.g., `Pixel_6a_API_33`)
- Java JDK 11+

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Metro bundler
npm start

# 3. In a separate terminal, launch on emulator
npm run android

# Or do both at once:
npm run android
```

## Key Scripts (from package.json)

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro dev server |
| `npm run android` | Build + install on emulator |
| `npm run ios` | Build + install on iOS simulator |

## Notes

- The `android` script sets `NODE_OPTIONS=--openssl-legacy-provider` (required for Node 17+ with OpenSSL 3).
- First build takes longer (~4-10 min) due to Gradle downloading dependencies and compiling native modules.
- Subsequent builds are incremental and much faster.
- Ensure the emulator is running before `npm run android`, or it will auto-start one if an AVD is available.

## Release Builds

### Prerequisites

- Keystore `HappiMynd.jks` already present at `android/app/`
- Signing credentials configured in `android/gradle.properties`:
  - `MYAPP_UPLOAD_STORE_FILE=HappiMynd.jks`
  - `MYAPP_UPLOAD_KEY_ALIAS=key0`
  - `MYAPP_UPLOAD_STORE_PASSWORD=Test@1234`
  - `MYAPP_UPLOAD_KEY_PASSWORD=Test@1234`

### Build Release APK

```bash
cd android
$env:NODE_OPTIONS="--openssl-legacy-provider"
./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

### Build Android App Bundle (AAB)

```bash
cd android
$env:NODE_OPTIONS="--openssl-legacy-provider"
./gradlew bundleRelease
```

AAB output: `android/app/build/outputs/bundle/release/app-release.aab`

### Notes

- Both commands sign the build with the `HappiMynd.jks` keystore (release signing config).
- First build takes ~4-10 min (Gradle downloads dependencies and compiles native modules).
- `NODE_OPTIONS=--openssl-legacy-provider` is required for Node 17+ (project uses OpenSSL 3-incompatible dependencies).
- The `google-services.json` file is required at the project root for Firebase integration.

## Debugging

- Open Dev Menu: `Ctrl+M` (Windows/Linux) or `Cmd+M` (macOS) in the emulator.
- Use `react-native log-android` to view logs.
- Use Chrome DevTools by pressing `J` in the Metro CLI or navigating to `http://localhost:8081/debugger-ui/`.
