# Google Auth Real Fix - Missing google-services.json

## The REAL Problem

You're missing the `google-services.json` file which is **REQUIRED** for Google Sign-In to work on Android.

## Complete Fix Steps

### Step 1: Create/Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Click on "Add app" → Select Android
4. Enter package name: `com.laundrymate.customer`
5. Enter SHA-1 fingerprint: `DA:D0:14:AD:5D:87:4A:44:46:8B:D6:84:A1:95:78:A4:40:E5:30:2E`
6. Download `google-services.json`

### Step 2: Add google-services.json to Project

Place the downloaded file here:
```
customer/android/app/google-services.json
```

### Step 3: Update build.gradle

Add Google Services plugin to `customer/android/build.gradle`:

```gradle
buildscript {
    dependencies {
        // Add this line
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

Add to `customer/android/app/build.gradle` at the bottom:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### Step 4: Sync and Rebuild

```bash
cd customer
npx cap sync
npx cap open android
```

In Android Studio:
1. File → Sync Project with Gradle Files
2. Build → Clean Project
3. Build → Rebuild Project
4. Run on device

## Why This Works

The `google-services.json` file contains:
- ✅ OAuth 2.0 Client IDs
- ✅ API Keys
- ✅ Project configuration
- ✅ Required for Google Play Services authentication

Without this file, Google Sign-In will ALWAYS fail with "Something went wrong" error.

## Alternative: Use Firebase Authentication

If you want a more robust solution, you can use Firebase Authentication which handles all of this automatically:

```bash
npm install @capacitor-firebase/authentication
```

This is more reliable and handles all the OAuth complexity for you.

## Current Configuration Status

✅ Package name: `com.laundrymate.customer`
✅ SHA-1 fingerprint added to Google Cloud Console
✅ Web Client ID: `514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq`
✅ Android Client ID: `514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4`
❌ **google-services.json: MISSING** ← This is the problem!

## After Adding google-services.json

Google Sign-In will work perfectly because:
1. The file links your app to Firebase/Google Cloud project
2. Contains all necessary OAuth credentials
3. Enables Google Play Services integration
4. Provides proper authentication flow

## Test After Fix

1. Install APK on device
2. Click "Continue with Google"
3. Select Google account
4. Should successfully authenticate and log in

The error will be gone! 🎉
