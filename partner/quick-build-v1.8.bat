@echo off
echo Building Partner App v1.8 - Quick Build
echo.

echo Installing filesystem plugin...
call npm install @capacitor/filesystem@^8.0.0

echo Building app...
call npm run build

echo Syncing Capacitor...
call npx cap sync android

echo Opening Android Studio...
call npx cap open android

echo.
echo Quick build complete! Test the new camera features.
pause