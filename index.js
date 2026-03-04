import "react-native-gesture-handler";
import { AppRegistry, Platform, InteractionManager } from "react-native";
import App from "./App";
import messaging from "@react-native-firebase/messaging";

// Register a background message handler so Firebase notifications are processed
// even when the app is killed or in the background.
// This MUST be called before AppRegistry.registerComponent.
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("FCM background message received:", remoteMessage.messageId);
});

/**
 * Firebase "Setting a timer for a long period" Android fix.
 *
 * Firebase's Web SDK schedules internal keep-alive / long-polling timers that
 * can last several minutes. Android's timer module warns (and misbehaves) when
 * a single setTimeout exceeds ~60 seconds. This patch intercepts any call to
 * global.setTimeout whose duration exceeds MAX_TIMER_DURATION_MS and splits it
 * into a chain of shorter timers, effectively giving the same end result while
 * keeping each individual timer under the threshold.
 *
 * Must be applied as early as possible — before any Firebase module is imported
 * — which is why it lives here in index.js.
 */
if (Platform.OS === "android") {
  const MAX_TIMER_DURATION_MS = 60 * 1000; // 60 seconds
  const _setTimeout = global.setTimeout;
  const _clearTimeout = global.clearTimeout;

  // Map of our synthetic timer ids → real native timer ids
  const longTimerHandles = {};
  let _idCounter = 0;

  /**
   * Recursively re-schedules the callback in MAX_TIMER_DURATION_MS slices
   * until the original target time (ttl) is reached.
   */
  const runTask = (id, fn, ttl, args) => {
    const remaining = ttl - Date.now();

    if (remaining <= 1) {
      // Time's up — run the callback after any pending interactions settle
      InteractionManager.runAfterInteractions(() => {
        if (!longTimerHandles[id]) return; // was cleared in the meantime
        delete longTimerHandles[id];
        fn(...args);
      });
      return;
    }

    // Schedule the next slice (at most MAX_TIMER_DURATION_MS away)
    const slice = Math.min(remaining, MAX_TIMER_DURATION_MS);
    longTimerHandles[id] = _setTimeout(() => runTask(id, fn, ttl, args), slice);
  };

  global.setTimeout = (fn, time = 0, ...args) => {
    if (time <= MAX_TIMER_DURATION_MS) {
      // Short timer — pass straight through, no overhead
      return _setTimeout(fn, time, ...args);
    }

    // Long timer — replace with chained short timers
    const id = "__lt_" + _idCounter++;
    const ttl = Date.now() + time;
    runTask(id, fn, ttl, args);
    return id;
  };

  global.clearTimeout = (id) => {
    if (typeof id === "string" && id.startsWith("__lt_")) {
      // Cancel any pending slice for this synthetic timer
      _clearTimeout(longTimerHandles[id]);
      delete longTimerHandles[id];
      return;
    }
    _clearTimeout(id);
  };
}

AppRegistry.registerComponent("HappiMynd", () => App);
