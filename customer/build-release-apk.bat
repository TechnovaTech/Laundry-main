@echo off
echo Building signed release APK with Google Auth fix...
echo.

echo Step 1: Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Step 2: Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo Capacitor sync failed!
    pause
    exit /b 1
)

echo Step 3: Building signed APK...
cd android
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo APK build failed!
    pause
    exit /b 1
)

echo.
echo SUCCESS! Signed APK created at:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo Google Sign-In should now work on mobile devices!
pause