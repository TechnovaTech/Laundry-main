@echo off
echo Building Partner App AAB for Google Play Store...
echo.

echo Step 1: Building Next.js app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Capacitor sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Building signed AAB...
cd android
call gradlew bundleRelease
if %errorlevel% neq 0 (
    echo AAB build failed!
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! AAB built successfully!
echo Location: android\app\build\outputs\bundle\release\app-release.aab
echo.
echo Next steps:
echo 1. Upload the AAB to Google Play Console
echo 2. Fill in store listing details
echo 3. Submit for review
echo.
pause