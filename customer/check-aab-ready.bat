@echo off
echo ========================================
echo   AAB Build Readiness Check
echo ========================================
echo.

set READY=1

REM Check Java
echo [1/6] Checking Java...
set JAVA_HOME=%~dp0jdk-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Java found
) else (
    echo ✗ Java not found
    set READY=0
)
echo.

REM Check Node
echo [2/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js found
    node --version
) else (
    echo ✗ Node.js not found
    set READY=0
)
echo.

REM Check npm
echo [3/6] Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm found
    npm --version
) else (
    echo ✗ npm not found
    set READY=0
)
echo.

REM Check keystore
echo [4/6] Checking keystore...
if exist "%~dp0android\app\laundry-customer.keystore" (
    echo ✓ Keystore found
) else (
    echo ✗ Keystore not found
    echo   Run: create-keystore.bat
    set READY=0
)
echo.

REM Check Android folder
echo [5/6] Checking Android project...
if exist "%~dp0android\app\build.gradle" (
    echo ✓ Android project found
) else (
    echo ✗ Android project not found
    echo   Run: npm run build:mobile
    set READY=0
)
echo.

REM Check node_modules
echo [6/6] Checking dependencies...
if exist "%~dp0node_modules" (
    echo ✓ Dependencies installed
) else (
    echo ✗ Dependencies not installed
    echo   Run: npm install
    set READY=0
)
echo.

echo ========================================
if %READY% equ 1 (
    echo   ✅ ALL CHECKS PASSED!
    echo ========================================
    echo.
    echo You're ready to build your AAB!
    echo.
    echo Next step: Run build-aab.bat
    echo.
) else (
    echo   ❌ SOME CHECKS FAILED
    echo ========================================
    echo.
    echo Please fix the issues above before building.
    echo.
)

REM Show current version
echo Current app version:
findstr "versionCode\|versionName" "%~dp0android\app\build.gradle"
echo.

REM Show environment
if exist "%~dp0.env" (
    echo Environment file found: .env
    echo Check that VITE_API_URL points to production
) else (
    echo ⚠️  Warning: .env file not found
)
echo.

pause
