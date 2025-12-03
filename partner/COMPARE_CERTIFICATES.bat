@echo off
echo ========================================
echo   Certificate Comparison - APK vs AAB
echo ========================================
echo.

:: Find APK file
set APK_FILE=
for /r android\app\build\outputs\apk %%f in (*.apk) do (
    set APK_FILE=%%f
    goto found_apk
)
:found_apk

:: Find AAB file
set AAB_FILE=
for %%f in (*.aab) do (
    set AAB_FILE=%%f
    goto found_aab
)
:found_aab

if "%APK_FILE%"=="" (
    echo ERROR: No APK file found
    echo Please build APK first: gradlew assembleRelease
    pause
    exit /b 1
)

if "%AAB_FILE%"=="" (
    echo ERROR: No AAB file found
    echo Please build AAB first: gradlew bundleRelease
    pause
    exit /b 1
)

echo Found APK: %APK_FILE%
echo Found AAB: %AAB_FILE%
echo.

:: Extract certificates using jarsigner
echo === Extracting APK Certificate ===
jarsigner -verify -verbose -certs "%APK_FILE%" > apk_cert.txt 2>&1
findstr /C:"SHA1" apk_cert.txt > apk_sha1.txt

echo === Extracting AAB Certificate ===
jarsigner -verify -verbose -certs "%AAB_FILE%" > aab_cert.txt 2>&1
findstr /C:"SHA1" aab_cert.txt > aab_sha1.txt

echo.
echo === COMPARISON RESULT ===
echo APK SHA-1:
if exist apk_sha1.txt (
    type apk_sha1.txt
) else (
    echo Could not extract APK SHA-1
)

echo.
echo AAB SHA-1:
if exist aab_sha1.txt (
    type aab_sha1.txt
) else (
    echo Could not extract AAB SHA-1
)

echo.
echo === MANUAL VERIFICATION ===
echo If the above method doesn't work, use this command:
echo.
echo For APK: unzip -p "%APK_FILE%" META-INF/*.RSA ^| keytool -printcert
echo For AAB: unzip -p "%AAB_FILE%" META-INF/*.RSA ^| keytool -printcert
echo.
pause