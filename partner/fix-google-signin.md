# Fix Google Sign-In for AAB

## Issue
APK works but AAB doesn't for Google Sign-In because Google Play Console uses Play App Signing.

## Solution Steps:

### 1. Get App Signing Certificate SHA-1
- Upload AAB to Google Play Console (Internal Testing)
- Go to Release Management → App Signing
- Copy the SHA-1 from "App signing certificate"

### 2. Add SHA-1 to Google Cloud Console
- Go to Google Cloud Console → Credentials
- Edit Android OAuth Client ID
- Add the Play Console SHA-1 fingerprint
- Package name: com.urbansteam.partner

### 3. Alternative: Use Debug SHA-1 for Testing
- Get debug SHA-1: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
- Add debug SHA-1 to Google Cloud Console

### 4. Current Configuration
- Package: com.urbansteam.partner
- Version: 1.1 (Code: 7)
- Keystore: partner-release-key-new.keystore

## The Real Fix
Google Play Console generates its own signing certificate. You need the SHA-1 from Play Console, not your upload certificate.