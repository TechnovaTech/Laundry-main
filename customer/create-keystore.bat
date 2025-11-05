@echo off
echo ========================================
echo   Create Keystore for App Signing
echo ========================================
echo.

REM Set JAVA_HOME to local JDK
set JAVA_HOME=%~dp0jdk-21.0.9
set PATH=%JAVA_HOME%\bin;%PATH%

echo This will create a keystore file for signing your app.
echo.
echo ⚠️  IMPORTANT:
echo - Remember your passwords (you'll need them for every release)
echo - Keep the keystore file safe (backup it securely)
echo - Never share or commit the keystore to Git
echo.
pause

cd android\app

echo.
echo Creating keystore...
echo.
echo You will be asked for:
echo 1. Keystore password (choose a strong password)
echo 2. Key password (can be same as keystore password)
echo 3. Your name
echo 4. Organization name
echo 5. City, State, Country
echo.

keytool -genkey -v -keystore laundry-customer.keystore -alias laundry-customer -keyalg RSA -keysize 2048 -validity 10000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ Keystore created successfully!
    echo ========================================
    echo.
    echo Location: android\app\laundry-customer.keystore
    echo.
    echo ⚠️  BACKUP THIS FILE IMMEDIATELY!
    echo.
    echo Next step: Run build-aab.bat to create your .aab file
    echo.
) else (
    echo.
    echo ❌ Failed to create keystore
    echo.
)

cd ..\..
pause
