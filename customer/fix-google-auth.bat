@echo off
echo ========================================
echo Google Auth Fix - Switching to Official Plugin
echo ========================================
echo.

echo Step 1: Uninstalling old plugin...
call npm uninstall @codetrix-studio/capacitor-google-auth

echo.
echo Step 2: Installing official plugin...
call npm install @capacitor/google-auth

echo.
echo Step 3: Syncing Capacitor...
call npx cap sync

echo.
echo Step 4: Building app...
call npm run build

echo.
echo Step 5: Copying to native...
call npx cap copy

echo.
echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npx cap open android
echo 2. In Android Studio: Clean Project
echo 3. In Android Studio: Rebuild Project
echo 4. Run on device and test Google Sign-In
echo.
pause
