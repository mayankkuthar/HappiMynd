#!/bin/bash
# Build, install, launch, and auto-dismiss the 16 KB page compat dialog.
# Usage: ./run-debug.sh

set -e

# 1. Start Metro if not running
if ! pgrep -f "react-native start" > /dev/null 2>&1; then
  echo "Starting Metro..."
  NODE_OPTIONS="--openssl-legacy-provider" npx react-native start --reset-cache &
  sleep 12
fi

# 2. Build and install
echo "Building and installing..."
npx react-native run-android --no-launch 2>&1 | tail -5

# 3. Launch and dismiss dialog
echo "Launching app and dismissing 16 KB dialog..."
bash dismiss-16kb-dialog.sh
