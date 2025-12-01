@echo off
echo Building Partner APK with package: com.urbansteam.partner
echo.

echo Cleaning Gradle cache...
rmdir /s /q "%USERPROFILE%\.gradle\caches\8.11.1\transforms\5f51ed623ec66baebfa6a053fe8a8b2a" 2>nul

echo Building Next.js...
call npm run build

echo Syncing Capacitor...
call npx cap sync android

echo Building APK...
cd android
call gradlew.bat clean assembleDebug --no-daemon --offline

echo.
echo ✅ APK Built: android\app\build\outputs\apk\debug\app-debug.apk
echo Package: com.urbansteam.partner
pause