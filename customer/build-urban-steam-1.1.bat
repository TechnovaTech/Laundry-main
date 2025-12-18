@echo off
echo ========================================
echo  BUILDING URBAN STEAM 1.1 AAB
echo ========================================

echo Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"
if exist "android\app\build" rmdir /s /q "android\app\build"

echo Building web assets...
call npm run build

echo Syncing Capacitor...
call npx cap sync

echo Building signed AAB...
cd android
call gradlew bundleRelease

echo ========================================
echo  AAB BUILD COMPLETE!
echo ========================================
echo Location: android\app\build\outputs\bundle\release\app-release.aab
echo Version: 1.1 (Code: 6)
echo Package: com.urbansteam.customerapp
echo Google SHA-1: E2:41:56:43:F1:8D:8A:E2:7C:66:A9:C3:C4:55:8A:2C:50:36:1A:3F
pause