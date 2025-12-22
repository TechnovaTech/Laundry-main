@echo off
echo ========================================
echo Building Urban Steam Customer App v1.2
echo ========================================

echo.
echo [1/6] Installing dependencies...
call npm install

echo.
echo [2/6] Building React app...
call npm run build

echo.
echo [3/6] Syncing with Capacitor...
call npx cap sync

echo.
echo [4/6] Copying assets...
call npx cap copy

echo.
echo [5/6] Building Android APK...
cd android
call ./gradlew assembleRelease

echo.
echo [6/6] Build completed!
echo.
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo ========================================
echo Urban Steam Customer v1.2 - Build Complete
echo ========================================

pause