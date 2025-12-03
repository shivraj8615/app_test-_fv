#!/bin/bash

# Build Release Script for Manuals App

echo "🚀 Starting Build Process..."

# 1. Check for Prerequisites
if ! command -v java &> /dev/null; then
    echo "❌ Error: Java is not installed. Please install JDK 17."
    exit 1
fi

if [ -d "$(pwd)/android-sdk" ]; then
    export ANDROID_HOME="$(pwd)/android-sdk"
    echo "ℹ️  Using local Android SDK at $ANDROID_HOME"
elif [ -z "$ANDROID_HOME" ]; then
    if [ -d "/usr/lib/android-sdk" ]; then
        export ANDROID_HOME="/usr/lib/android-sdk"
        echo "ℹ️  ANDROID_HOME set to /usr/lib/android-sdk"
    else
        echo "❌ Error: ANDROID_HOME is not set. Please set it to your Android SDK location."
        exit 1
    fi
fi

# 2. Clean previous builds
echo "🧹 Cleaning previous output..."
rm -rf dist

# 3. Generate Native Android Project
if [ -d "android" ]; then
    echo "ℹ️  Android project found. Skipping regeneration for faster build."
    echo "⚠️  If you changed app.json or native dependencies, delete 'android' folder manually."
else
    echo "⚙️  Generating Android project..."
    npx expo prebuild -p android
fi

# 4. Build APK
echo "🏗️  Building APK (this may take a while)..."
cd android
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "✅ Build Successful!"
    
    # 5. Move APK to dist folder
    cd ..
    mkdir -p dist
    cp android/app/build/outputs/apk/release/app-release.apk dist/manuals-app.apk
    
    echo "📦 APK created at: dist/manuals-app.apk"
    echo "📱 You can now copy this file to your device."

    # 6. Clean up PDFs
    echo "🗑️  Deleting used PDFs..."
    rm -f assets/pdfs/*.pdf
    echo "✨ Ready for next client!"
else
    echo "❌ Build Failed. Check the logs above."
    exit 1
fi
