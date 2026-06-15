#!/bin/bash
# Auto-dismiss the "Android App Compatibility" 16 KB page size dialog.
# This dialog shows once per fresh install on 16 KB page-size devices
# (API 36+ emulators with page size = 16384).
#
# Usage:
#   ./dismiss-16kb-dialog.sh                          # watch + dismiss
#   DISMISS_AND_INSTALL=1 ./dismiss-16kb-dialog.sh path/to/app.apk  # install + dismiss

BUTTON_X=${BUTTON_X:-1028}
BUTTON_Y=${BUTTON_Y:-2779}
MAX_WAIT=25

dismiss() {
  echo "Waiting for 16 KB compat dialog (up to ${MAX_WAIT}s)..."

  # Start logcat watcher in background — exits as soon as dialog is detected
  adb logcat -v raw -s AppWarnings:D 2>/dev/null \
    | grep -m1 "Showing PageSizeMismatchDialog" &
  local LC_PID=$!
  sleep 1

  # Launch the app
  adb shell monkey -p com.happimynd -c android.intent.category.LAUNCHER 1 2>/dev/null

  # Wait for logcat match (grep -m1 exits when found; kill -0 checks it's alive)
  local elapsed=0
  while [ $elapsed -lt $MAX_WAIT ]; do
    if ! kill -0 $LC_PID 2>/dev/null; then
      echo "Dialog detected! Tapping 'Don't Show Again'..."
      adb shell input tap $BUTTON_X $BUTTON_Y
      sleep 1
      echo "Done."
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  kill $LC_PID 2>/dev/null
  echo "No dialog detected within ${MAX_WAIT}s (likely already dismissed)."
  return 1
}

if [ -n "$DISMISS_AND_INSTALL" ] && [ -f "$1" ]; then
  echo "Installing $1..."
  adb install -r "$1" || { echo "Install failed"; exit 1; }
fi

dismiss
