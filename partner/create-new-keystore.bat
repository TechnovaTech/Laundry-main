@echo off
"C:\Program Files\Java\jdk-21\bin\keytool.exe" -genkey -v -keystore partner-release-key-new.keystore -alias partner-key -keyalg RSA -keysize 2048 -validity 10000 -storepass laundry123 -keypass laundry123 -dname "CN=Laundry Partner, OU=Development, O=Laundry, L=City, S=State, C=IN"
echo Keystore created successfully!
pause
