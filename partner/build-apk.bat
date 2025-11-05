@echo off
echo ========================================
echo Building Partner App APK
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
call npm run cap:sync
if %errorlevel% neq 0 (
    echo Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Opening Android Studio...
echo Please build APK from Android Studio:
echo Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo.
call npm run cap:open:android

pause
