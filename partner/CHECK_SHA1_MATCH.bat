@echo off
echo ========================================
echo   SHA-1 Fingerprint Comparison Tool
echo   Partner App - APK vs AAB
echo ========================================
echo.

:: Check if keytool exists
where keytool >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: keytool not found in PATH
    echo Please ensure Java JDK is installed and in PATH
    pause
    exit /b 1
)

:: Check if aapt exists (from Android SDK)
where aapt >nul 2>nul
if %errorlevel% neq 0 (
    echo WARNING: aapt not found in PATH
    echo Will try alternative methods...
    echo.
)

echo === STEP 1: Getting SHA-1 from Gradle Signing Report ===
cd android
call gradlew signingReport > ..\signing_report.txt 2>&1
cd ..

echo.
echo === STEP 2: Finding APK and AAB files ===
set APK_FILE=
set AAB_FILE=

:: Look for APK files
for /r android\app\build\outputs\apk %%f in (*.apk) do (
    echo Found APK: %%f
    set APK_FILE=%%f
)

:: Look for AAB files in current directory
for %%f in (*.aab) do (
    echo Found AAB: %%f
    set AAB_FILE=%%f
)

:: Also check in android/app/build/outputs/bundle
for /r android\app\build\outputs\bundle %%f in (*.aab) do (
    echo Found AAB: %%f
    set AAB_FILE=%%f
)

echo.
echo === STEP 3: Extracting SHA-1 from Signing Report ===
findstr /C:"SHA1:" signing_report.txt > sha1_from_gradle.txt
if exist sha1_from_gradle.txt (
    echo Gradle SHA-1 fingerprints:
    type sha1_from_gradle.txt
) else (
    echo No SHA-1 found in gradle signing report
)

echo.
echo === STEP 4: Checking Keystore SHA-1 ===
if exist partner-release-key.keystore (
    echo Getting SHA-1 from keystore: partner-release-key.keystore
    keytool -list -v -keystore partner-release-key.keystore -alias partner-key -storepass 123456 -keypass 123456 > keystore_sha1.txt 2>&1
    findstr /C:"SHA1:" keystore_sha1.txt
) else if exist partner-release-key-new.keystore (
    echo Getting SHA-1 from keystore: partner-release-key-new.keystore
    keytool -list -v -keystore partner-release-key-new.keystore -alias partner-key -storepass 123456 -keypass 123456 > keystore_sha1.txt 2>&1
    findstr /C:"SHA1:" keystore_sha1.txt
) else (
    echo No keystore file found
)

echo.
echo === STEP 5: Summary ===
echo APK File: %APK_FILE%
echo AAB File: %AAB_FILE%
echo.
echo === SHA-1 COMPARISON RESULT ===
if exist sha1_from_gradle.txt (
    echo.
    echo "All SHA-1 fingerprints from signing report:"
    type sha1_from_gradle.txt
    echo.
    echo "If you see the same SHA-1 for both debug and release variants,"
    echo "then your APK and AAB will have the same fingerprint."
    echo.
    echo "IMPORTANT: Make sure you're using the RELEASE SHA-1 in Firebase Console!"
) else (
    echo "Could not extract SHA-1 fingerprints. Please run manually:"
    echo "cd android && gradlew signingReport"
)

echo.
echo === NEXT STEPS ===
echo 1. Copy the RELEASE SHA-1 fingerprint from above
echo 2. Add it to Firebase Console - Project Settings - Your Apps - Android App
echo 3. Download new google-services.json and replace in android/app/
echo 4. Rebuild both APK and AAB with same keystore
echo.
pause