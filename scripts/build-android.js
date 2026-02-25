const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = '';
const MAIN_ACTIVITY_KY = path + 'android/app/src/main/java/com/freelance/MainActivity.kt'; 
const ANDROID_MANIFEST_XML = path + 'android/app/src/main/AndroidManifest.xml';

(() => {
console.info('Configuring react-native-screens on Android');
const file = fs.readFileSync(MAIN_ACTIVITY_KY, 'utf8');
const lines = file.split('\n');
const newLines = [];
let check = false; 
lines.forEach((line) => {
    newLines.push(line);
    if (line.startsWith('package ')) check = true;
    if (check && line.trim() === '') {
        newLines.push('import android.os.Bundle');
        newLines.push('import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory');
        check = false;
    }
    if (line.includes('class MainActivity')) {
        newLines.push('');
        newLines.push('  override fun onCreate(savedInstanceState: Bundle?) {');
        newLines.push('    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()');
        newLines.push('    super.onCreate(savedInstanceState)');
        newLines.push('  }');
    }
});
fs.writeFileSync(MAIN_ACTIVITY_KY, newLines.join('\n'));
})();

(() => {
console.info('Opting-out of predictive back on Android');
const file = fs.readFileSync(ANDROID_MANIFEST_XML, 'utf8');
const lines = file.split('\n');
const newLines = [];
let check = false; 
lines.forEach((line) => {
    newLines.push(line);
    if (line.includes('<application')) {
        newLines.push('      android:enableOnBackInvokedCallback="false"');
    }
});
fs.writeFileSync(ANDROID_MANIFEST_XML, newLines.join('\n'));
})();
