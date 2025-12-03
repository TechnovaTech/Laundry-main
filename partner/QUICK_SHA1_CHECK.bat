@echo off
echo === Partner App SHA-1 Fingerprint Check ===
echo.

echo Keystore: partner-release-key-new.keystore
echo Alias: partner-key
echo Password: laundry123
echo.

echo === Method 1: Using Java keytool ===
"C:\Program Files\Java\jdk-21\bin\keytool.exe" -list -v -keystore partner-release-key-new.keystore -alias partner-key -storepass laundry123 -keypass laundry123 | findstr SHA1

echo.
echo === Method 2: Using gradlew signingReport ===
cd android
"C:\Program Files\Java\jdk-21\bin\java.exe" -jar gradle\wrapper\gradle-wrapper.jar signingReport | findstr SHA1
cd ..

echo.
echo === Files Check ===
if exist partner-release-key-new.keystore (
    echo ✓ Keystore found: partner-release-key-new.keystore
) else (
    echo ✗ Keystore NOT found: partner-release-key-new.keystore
)

if exist "Urban-Steam-Partner-Fresh-v1.5.aab" (
    echo ✓ AAB found: Urban-Steam-Partner-Fresh-v1.5.aab
) else (
    echo ✗ AAB NOT found: Urban-Steam-Partner-Fresh-v1.5.aab
)

echo.
echo === IMPORTANT ===
echo Both APK and AAB must be signed with the SAME keystore
echo to have the SAME SHA-1 fingerprint!
echo.
pause