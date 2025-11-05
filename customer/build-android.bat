@echo off
echo ========================================
echo Building Urban Steam Customer App
echo ========================================
echo.

echo Step 1: Building web assets...
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
    echo Sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo Build preparation complete!
echo ========================================
echo.
echo Next steps in Android Studio:
echo 1. For APK: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo 2. For AAB: Build ^> Generate Signed Bundle / APK
echo.
pause
