@echo off
echo Getting SHA-1 fingerprint...
echo.
cd android
call gradlew signingReport
pause
