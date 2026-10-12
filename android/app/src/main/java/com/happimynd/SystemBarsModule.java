package com.happimynd;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SystemBarsModule extends ReactContextBaseJavaModule {

  public SystemBarsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "SystemBars";
  }

  @ReactMethod
  public void hideNavigationBar() {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          WindowInsetsController controller = activity.getWindow().getInsetsController();
          if (controller != null) {
            controller.hide(WindowInsets.Type.navigationBars());
            controller.setSystemBarsBehavior(
                WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
          }
        } else {
          View decorView = activity.getWindow().getDecorView();
          decorView.setSystemUiVisibility(
              decorView.getSystemUiVisibility()
                  | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                  | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
      }
    });
  }

  @ReactMethod
  public void showNavigationBar() {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          WindowInsetsController controller = activity.getWindow().getInsetsController();
          if (controller != null) {
            controller.show(WindowInsets.Type.navigationBars());
          }
        } else {
          View decorView = activity.getWindow().getDecorView();
          decorView.setSystemUiVisibility(
              decorView.getSystemUiVisibility()
                  & ~(View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY));
        }
      }
    });
  }
}