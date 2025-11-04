# How to Get google-services.json File

## The Problem
Your Google Sign-In is failing because the `google-services.json` file is missing from:
```
customer/android/app/google-services.json
```

## Solution: Download from Firebase Console

### Step 1: Go to Firebase Console
1. Open [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with your Google account

### Step 2: Create or Select Project
- **If you already have a Firebase project**: Select it
- **If you don't have one**: Click "Add project" and follow the wizard

### Step 3: Add Android App to Firebase
1. In your Firebase project, click on the **Android icon** or "Add app" → "Android"
2. Fill in the details:
   - **Android package name**: `com.laundrymate.customer`
   - **App nickname** (optional): Steam Iron Customer
   - **Debug signing certificate SHA-1**: `DA:D0:14:AD:5D:87:4A:44:46:8B:D6:84:A1:95:78:A4:40:E5:30:2E`
3. Click "Register app"

### Step 4: Download google-services.json
1. Firebase will show you a "Download google-services.json" button
2. Click it to download the file
3. **IMPORTANT**: If you missed this step, you can always download it later:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Find your Android app
   - Click the "google-services.json" download button

### Step 5: Place the File in Your Project
1. Copy the downloaded `google-services.json` file
2. Paste it to: `customer/android/app/google-services.json`
3. The file should be in the same folder as `build.gradle`

### Step 6: Verify File Location
Your file structure should look like:
```
customer/
└── android/
    └── app/
        ├── build.gradle
        ├── google-services.json  ← File should be here
        └── src/
```

### Step 7: Enable Google Sign-In in Firebase
1. In Firebase Console, go to "Authentication"
2. Click "Get started" if you haven't enabled it
3. Go to "Sign-in method" tab
4. Click on "Google"
5. Toggle "Enable"
6. Select your support email
7. Click "Save"

### Step 8: Rebuild Your App
```bash
cd customer
npx cap sync
npx cap open android
```

In Android Studio:
1. **File** → **Sync Project with Gradle Files**
2. **Build** → **Clean Project**
3. **Build** → **Rebuild Project**
4. **Run** on your device

## What This File Does

The `google-services.json` file:
- ✅ Links your app to your Firebase/Google Cloud project
- ✅ Contains OAuth 2.0 client IDs
- ✅ Provides API keys for Google services
- ✅ Enables Google Sign-In authentication
- ✅ Required for Google Play Services integration

## After Adding the File

Your Google Sign-In will work because:
1. The app can now communicate with Google's authentication servers
2. OAuth credentials are properly configured
3. Google Play Services can verify your app
4. The authentication flow completes successfully

## Troubleshooting

### If you still get errors after adding the file:

1. **Wait 5-10 minutes**: Google Cloud changes take time to propagate
2. **Check SHA-1**: Make sure the SHA-1 in Firebase matches your debug keystore
3. **Verify package name**: Must be exactly `com.laundrymate.customer`
4. **Clean and rebuild**: Always clean project after adding google-services.json
5. **Check internet**: Device must have active internet connection
6. **Update Google Play Services**: On your test device

### To verify SHA-1 fingerprint:
```bash
cd customer/android
./gradlew signingReport
```

Look for the SHA-1 under "Variant: debug" and verify it matches:
`DA:D0:14:AD:5D:87:4A:44:46:8B:D6:84:A1:95:78:A4:40:E5:30:2E`

## Alternative: Use Firebase Authentication Plugin

If you want an even more reliable solution:

```bash
npm install @capacitor-firebase/authentication
```

This plugin handles all OAuth complexity automatically and is more stable than the Google Auth plugin.

## Summary

**Current Status:**
- ✅ Google Cloud Console configured
- ✅ OAuth Client IDs created
- ✅ SHA-1 fingerprint added
- ✅ build.gradle files configured
- ❌ **google-services.json MISSING** ← Download this from Firebase!

**After adding google-services.json:**
- ✅ Google Sign-In will work perfectly!
