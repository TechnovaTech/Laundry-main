@echo off
"C:\Program Files\Java\jdk-21\bin\keytool.exe" -genkey -v -keystore partner-release-key.keystore -alias partner-key -keyalg RSA -keysize 2048 -validity 10000
pause
