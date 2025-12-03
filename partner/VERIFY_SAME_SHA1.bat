@echo off
echo ========================================
echo   Verify APK and AAB have Same SHA-1
echo ========================================
echo.

echo Checking keystore SHA-1...
"C:\Program Files\Java\jdk-21\bin\keytool.exe" -list -v -keystore partner-release-key-new.keystore -alias partner-key -storepass laundry123 -keypass laundry123 | findstr "SHA1:"

echo.
echo Files to upload:
if exist "Partner-App-v1.5.apk" (
    echo ✓ APK: Partner-App-v1.5.apk
) else (
    echo ✗ APK not found - run BUILD_MATCHING_APK_AAB.bat first
)

if exist "Partner-App-v1.5.aab" (
    echo ✓ AAB: Partner-App-v1.5.aab
) else (
    echo ✗ AAB not found - run BUILD_MATCHING_APK_AAB.bat first
)

echo.
echo ========================================
echo   IMPORTANT: Upload AAB to Google Play
echo ========================================
pause