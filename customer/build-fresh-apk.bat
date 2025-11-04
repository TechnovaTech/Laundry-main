@echo off
echo ========================================
echo Building Fresh APK with Safe Area Support
echo ========================================
echo.

echo Step 1: Cleaning previous build...
if exist dist rmdir /s /q dist
if exist android\app\build rmdir /s /q android\app\build
echo Clean complete!
echo.

echo Step 2: Building web assets...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)
echo Web build complete!
echo.

echo Step 3: Syncing with Capacitor...
call npx cap sync android
if errorlevel 1 (
    echo Capacitor sync failed!
    pause
    exit /b 1
)
echo Capacitor sync complete!
echo.

echo Step 4: Building APK...
cd android
call gradlew assembleDebug
if errorlevel 1 (
    echo APK build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo APK build complete!
echo.

echo ========================================
echo SUCCESS! APK built successfully!
echo ========================================
echo.
echo APK Location:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo You can now install this APK on your Android device.
echo.
pause
