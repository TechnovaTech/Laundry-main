@echo off
echo Building Partner App with new package name: com.urbansteam.partner
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
echo Step 3: Building APK...
cd android
call .\gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo APK build failed!
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! APK built with package name: com.urbansteam.partner
echo Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Package name: com.urbansteam.partner
echo App name: Urban Steam Captain
echo.
pause