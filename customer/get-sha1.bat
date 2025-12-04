@echo off
echo Getting SHA-1 fingerprint...
cd /d "d:\OFFICE WORK\laundry-main\customer"
jdk-21.0.9\bin\keytool -list -v -keystore android\app\laundry-customer.keystore -alias upload -storepass 123456 | findstr SHA1
pause