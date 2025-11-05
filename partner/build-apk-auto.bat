@echo off
echo ========================================
echo Building Partner App APK (Automated)
echo ========================================

echo.
echo Step 1: Building Next.js app...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Building APK with Gradle...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Gradle build failed!
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ========================================
echo APK Built Successfully!
echo ========================================
echo Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.

pause
