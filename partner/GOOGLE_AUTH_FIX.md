# Google Auth Fix for Partner Android App

## Changes Made

### 1. Updated Client IDs
- Changed from Android client ID to **Web client ID**: `514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com`
- Updated in:
  - `capacitor.config.ts`
  - `CapacitorInit.tsx`
  - `login/page.tsx`

### 2. Added Initialization Before Sign-In
- GoogleAuth.initialize() is now called before signIn() to ensure proper setup

## Next Steps

### Step 1: Get Your SHA-1 Fingerprint
Run this command in the `android` folder:
```bash
cd android
gradlew signingReport
```

Or use the provided batch file:
```bash
GET_SHA1.bat
```

Look for the **SHA-1** under `Variant: debug` -> `Config: debug`

### Step 2: Add SHA-1 to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `laundry-mate-app`
3. Go to Project Settings
4. Select your Android app: `com.ironstream.deliverypartner`
5. Add the SHA-1 fingerprint from Step 1
6. Download the new `google-services.json`
7. Replace `android/app/google-services.json` with the new file

### Step 3: Rebuild the App
```bash
npm run build
npx cap sync
npx cap open android
```

Then build and run from Android Studio.

## Common Issues

### "Something went wrong" Error
- **Cause**: SHA-1 fingerprint not added to Firebase
- **Fix**: Complete Step 2 above

### "12501: User Cancelled" Error
- **Cause**: Wrong client ID or SHA-1 mismatch
- **Fix**: Verify Web client ID and SHA-1 are correct

### "10: Developer Error" Error
- **Cause**: Package name mismatch or missing SHA-1
- **Fix**: Ensure package name is `com.ironstream.deliverypartner` and SHA-1 is added

## Verification

After fixing, you should see in logs:
```
Google Auth initialized successfully
Starting Google Sign-In...
Google sign-in result: { authentication: { idToken: "..." } }
```
