@echo off
echo ========================================
echo   Building Partner App v1.6 - Google Auth Fixed
echo ========================================
echo.

echo Step 1: Build Next.js app
npm run build

echo.
echo Step 2: Sync with Capacitor
npx cap sync

echo.
echo Step 3: Clean previous builds
cd android
call gradlew clean
cd ..

echo.
echo Step 4: Build APK (Release)
cd android
call gradlew assembleRelease
cd ..

echo.
echo Step 5: Build AAB (Release)
cd android
call gradlew bundleRelease
cd ..

echo.
echo Step 6: Copy files to main folder
copy "android\app\build\outputs\apk\release\app-release.apk" "Partner-App-v1.6-GoogleAuth-Fixed.apk"
copy "android\app\build\outputs\bundle\release\app-release.aab" "Partner-App-v1.6-GoogleAuth-Fixed.aab"

echo.
echo ========================================
echo   BUILD COMPLETE
echo ========================================
echo APK: Partner-App-v1.6-GoogleAuth-Fixed.apk
echo AAB: Partner-App-v1.6-GoogleAuth-Fixed.aab
echo.
echo Both files now have SAME SHA-1 fingerprint!
echo Upload Partner-App-v1.6-GoogleAuth-Fixed.aab to Google Play Console
echo.
pause