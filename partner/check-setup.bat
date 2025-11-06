@echo off
echo ========================================
echo Partner App - Setup Checker
echo ========================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found! Install from https://nodejs.org/
    goto :error
) else (
    node --version
    echo [OK] Node.js installed
)
echo.

echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] npm not found!
    goto :error
) else (
    npm --version
    echo [OK] npm installed
)
echo.

echo Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Java not found! Install JDK 17+
    goto :error
) else (
    java -version
    echo [OK] Java installed
)
echo.

echo Checking Android Studio...
if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    echo [OK] Android SDK found
) else (
    echo [!] Android SDK not found at default location
    echo    Install Android Studio from https://developer.android.com/studio
)
echo.

echo Checking node_modules...
if exist "node_modules\" (
    echo [OK] Dependencies installed
) else (
    echo [!] Dependencies not installed
    echo    Run: npm install
)
echo.

echo Checking .env file...
if exist ".env" (
    echo [OK] .env file exists
    type .env
) else (
    echo [!] .env file not found
    echo    Create .env with: NEXT_PUBLIC_API_URL=https://acsgroup.cloud
)
echo.

echo Checking google-services.json...
if exist "android\app\google-services.json" (
    echo [OK] google-services.json exists
) else (
    echo [!] google-services.json not found
    echo    Download from Firebase Console and place in android\app\
)
echo.

echo ========================================
echo Setup Check Complete
echo ========================================
echo.
echo Ready to build? Run: build-android.bat
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo Setup Incomplete - Fix errors above
echo ========================================
pause
exit /b 1
