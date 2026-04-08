/**
 * Postinstall patch for expo-notifications@0.13.3
 *
 * Problem: expo-notifications/android/build.gradle uses `apply plugin: 'maven'`
 * which was removed in Gradle 7.2+. This script replaces the broken build.gradle
 * with a Gradle 7.6-compatible version that:
 *   - Removes the deprecated `maven` plugin and its `uploadArchives` block
 *   - Moves `safeExtGet` to project scope so it's accessible outside `buildscript`
 *   - Removes the `unimodules-task-manager-interface` dependency (not installed)
 *
 * This script is run automatically via `postinstall` in package.json.
 */

const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-notifications',
  'android',
  'build.gradle'
);

if (!fs.existsSync(buildGradlePath)) {
  console.log('[patch-expo-notifications] expo-notifications not found, skipping patch.');
  process.exit(0);
}

const patchedContent = `apply plugin: 'com.android.library'
apply plugin: 'kotlin-android'

group = 'host.exp.exponent'
version = '0.13.3'

// Project-scoped helper so it is accessible both inside buildscript and in
// the android {} / dependencies {} blocks below.
ext.safeExtGet = { prop, fallback ->
  rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
}

buildscript {
  repositories {
    mavenCentral()
  }

  dependencies {
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.6.10")
  }
}

android {
  compileSdkVersion safeExtGet('compileSdkVersion', 33)

  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }

  kotlinOptions {
    jvmTarget = JavaVersion.VERSION_1_8
  }

  defaultConfig {
    minSdkVersion safeExtGet('minSdkVersion', 21)
    targetSdkVersion safeExtGet('targetSdkVersion', 33)
    versionCode 21
    versionName '0.13.3'
  }

  lintOptions {
    abortOnError false
  }
}

dependencies {
  implementation project(':expo-modules-core')

  api 'androidx.core:core:1.5.0'
  api 'androidx.lifecycle:lifecycle-runtime:2.2.0'
  api 'androidx.lifecycle:lifecycle-process:2.2.0'
  api 'androidx.lifecycle:lifecycle-common-java8:2.2.0'

  implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.10"

  api 'com.google.firebase:firebase-messaging:20.2.4'

  api 'me.leolin:ShortcutBadger:1.1.22@aar'
}
`;

const existing = fs.readFileSync(buildGradlePath, 'utf8');

// Only write if the file still contains the broken maven plugin line
if (existing.includes("apply plugin: 'maven'") || !existing.includes("ext.safeExtGet")) {
  fs.writeFileSync(buildGradlePath, patchedContent, 'utf8');
  console.log('[patch-expo-notifications] Patched expo-notifications/android/build.gradle successfully.');
} else {
  console.log('[patch-expo-notifications] build.gradle already patched, skipping.');
}
