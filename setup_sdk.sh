#!/bin/bash

SDK_DIR="android-sdk"
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"

echo "🛠️  Setting up local Android SDK..."

mkdir -p $SDK_DIR/cmdline-tools

if [ ! -d "$SDK_DIR/cmdline-tools/latest" ]; then
    echo "⬇️  Downloading command line tools..."
    wget -q $CMDLINE_TOOLS_URL -O cmdline-tools.zip
    
    echo "📦 Unzipping..."
    unzip -q cmdline-tools.zip -d $SDK_DIR/cmdline-tools
    mv $SDK_DIR/cmdline-tools/cmdline-tools $SDK_DIR/cmdline-tools/latest
    rm cmdline-tools.zip
else
    echo "✅ Command line tools already installed."
fi

export ANDROID_HOME="$(pwd)/$SDK_DIR"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

echo "📝 Accepting licenses..."
yes | sdkmanager --licenses > /dev/null 2>&1

echo "⬇️  Installing platform tools and SDK..."
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"

echo "✅ Android SDK setup complete!"
echo "📍 Location: $ANDROID_HOME"
