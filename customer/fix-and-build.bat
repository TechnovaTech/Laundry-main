@echo off
echo Fixing Customer App Crash Issues...

echo.
echo Step 1: Clean previous builds
call npm run build

echo.
echo Step 2: Sync with Capacitor
call npx cap sync

echo.
echo Step 3: Clean Android build
cd android
call gradlew clean

echo.
echo Step 4: Build APK
call gradlew assembleRelease

echo.
echo Build completed! Check android/app/build/outputs/apk/release/ for the APK
pause