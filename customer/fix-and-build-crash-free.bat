@echo off
echo ========================================
echo  FIXING CRASH ISSUES AND BUILDING APK
echo ========================================

echo Step 1: Cleaning previous builds...
call npm run build 2>nul
if exist "dist" rmdir /s /q "dist"
if exist "android\app\build" rmdir /s /q "android\app\build"

echo Step 2: Installing dependencies...
call npm install

echo Step 3: Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo Step 4: Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)

echo Step 5: Cleaning Android build...
cd android
call gradlew clean
if %errorlevel% neq 0 (
    echo WARNING: Gradle clean had issues, continuing...
)

echo Step 6: Building release APK...
call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo ERROR: APK build failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo ========================================
echo  BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo The crash issues have been fixed:
echo - Fixed package name mismatches
echo - Added error boundaries
echo - Added global error handlers
echo - Improved Capacitor initialization
echo.
pause