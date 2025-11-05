@echo off
echo ========================================
echo   Building Android App Bundle (.aab)
echo   for Google Play Console
echo ========================================
echo.

REM Set JAVA_HOME to local JDK
set JAVA_HOME=%~dp0jdk-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%

echo [1/5] Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java not found!
    echo Please ensure JDK is installed.
    pause
    exit /b 1
)
echo ✓ Java found
echo.

REM Check if keystore exists
set KEYSTORE_PATH=%~dp0android\app\laundry-customer.keystore
if not exist "%KEYSTORE_PATH%" (
    echo.
    echo ⚠️  WARNING: Keystore not found!
    echo.
    echo You need to create a keystore file first.
    echo Run: create-keystore.bat
    echo.
    echo Or create manually:
    echo keytool -genkey -v -keystore android\app\laundry-customer.keystore -alias laundry-customer -keyalg RSA -keysize 2048 -validity 10000
    echo.
    pause
    exit /b 1
)
echo ✓ Keystore found
echo.

REM Check if key.properties exists
set KEY_PROPS=%~dp0android\key.properties
if not exist "%KEY_PROPS%" (
    echo.
    echo Creating key.properties file...
    echo.
    echo Enter keystore password:
    set /p STORE_PASSWORD=
    echo Enter key alias (default: laundry-customer):
    set /p KEY_ALIAS=
    if "%KEY_ALIAS%"=="" set KEY_ALIAS=laundry-customer
    echo Enter key password:
    set /p KEY_PASSWORD=
    
    (
        echo storePassword=%STORE_PASSWORD%
        echo keyPassword=%KEY_PASSWORD%
        echo keyAlias=%KEY_ALIAS%
        echo storeFile=laundry-customer.keystore
    ) > "%KEY_PROPS%"
    
    echo ✓ key.properties created
    echo.
)

echo [2/5] Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Web assets built
echo.

echo [3/5] Syncing with Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)
echo ✓ Capacitor synced
echo.

echo [4/5] Building Android App Bundle...
cd android
call gradlew.bat clean bundleRelease
if %errorlevel% neq 0 (
    echo ERROR: AAB build failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ AAB built successfully
echo.

echo [5/5] Locating AAB file...
set AAB_PATH=%~dp0android\app\build\outputs\bundle\release\app-release.aab
if exist "%AAB_PATH%" (
    echo.
    echo ========================================
    echo   ✅ SUCCESS!
    echo ========================================
    echo.
    echo AAB file created at:
    echo %AAB_PATH%
    echo.
    echo File size:
    for %%A in ("%AAB_PATH%") do echo %%~zA bytes
    echo.
    echo Next steps:
    echo 1. Go to Google Play Console
    echo 2. Create a new release
    echo 3. Upload this .aab file
    echo.
    echo Opening folder...
    explorer "%~dp0android\app\build\outputs\bundle\release"
) else (
    echo ERROR: AAB file not found!
    echo Expected location: %AAB_PATH%
)

echo.
pause
