@echo off
echo Getting SHA-1 fingerprints for Partner App...
echo.
echo === DEBUG KEYSTORE SHA-1 ===
cd android
gradlew signingReport
echo.
echo === DONE ===
pause
