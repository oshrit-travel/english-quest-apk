// Small post-generation tweaks to the Capacitor Android project (runs in CI after `cap add android`).
import fs from 'node:fs';
const manifest = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(manifest, 'utf8');
// allow rotation in both directions, keep the activity alive on config changes, resize with the keyboard
if (!m.includes('screenOrientation')) m = m.replace('<activity', '<activity android:screenOrientation="fullUser"');
if (!m.includes('TTS_SERVICE')) m = m.replace('</manifest>', '  <queries><intent><action android:name="android.intent.action.TTS_SERVICE" /></intent></queries>\n</manifest>');
fs.writeFileSync(manifest, m);

// hide the system bars + keep the screen on during play (immersive full-screen)
const main = 'android/app/src/main/java/com/osher/englishquest/MainActivity.java';
if (fs.existsSync(main)) {
  fs.writeFileSync(main, `package com.osher.englishquest;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideBars();
  }
  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideBars();
  }
  private void hideBars() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  }
}
`);
}
console.log('Android project patched');
