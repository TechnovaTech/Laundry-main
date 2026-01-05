@echo off
echo ========================================
echo Urban Steam Customer App - Debug Build
echo Version: 2.1.0
echo ========================================

echo.
echo [1/4] Cleaning previous builds...
if exist dist rmdir /s /q dist

echo.
echo [2/4] Building web app for development...
call npm run build:dev

echo.
echo [3/4] Syncing with Capacitor...
call npx cap sync

echo.
echo [4/4] Opening Android Studio...
call npx cap open android

echo.
echo ========================================
echo Debug build ready!
echo You can now build and test in Android Studio
echo ========================================
pause