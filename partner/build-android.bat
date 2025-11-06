@echo off
echo ========================================
echo Building Partner Android App
echo ========================================
echo.

echo [1/3] Building Next.js app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Next steps in Android Studio:
echo 1. Wait for Gradle sync
echo 2. Build ^> Build Bundle/APK ^> Build APK
echo 3. Find APK in: android\app\build\outputs\apk\debug\
echo.
pause
