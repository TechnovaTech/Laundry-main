@echo off
echo ========================================
echo Urban Steam Customer App - Release Build
echo Version: 2.1.0
echo ========================================

echo.
echo [1/5] Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist android\app\build rmdir /s /q android\app\build

echo.
echo [2/5] Installing dependencies...
call npm install

echo.
echo [3/5] Building web app for production...
call npm run build

echo.
echo [4/5] Syncing with Capacitor...
call npx cap sync

echo.
echo [5/5] Building Android APK...
call npx cap build android --release

echo.
echo ========================================
echo Build completed successfully!
echo APK location: android/app/build/outputs/apk/release/
echo ========================================
pause