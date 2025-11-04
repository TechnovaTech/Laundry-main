# Google Auth Fix - Switch to Official Plugin

## Problem
The `@codetrix-studio/capacitor-google-auth` plugin has compatibility issues causing "Something went wrong" errors on Android.

## Solution
Switch to the official `@capacitor/google-auth` plugin which is more stable and reliable.

## Steps to Fix

### 1. Uninstall old plugin and install new one
```bash
cd customer
npm uninstall @codetrix-studio/capacitor-google-auth
npm install @capacitor/google-auth
```

### 2. Sync Capacitor
```bash
npx cap sync
```

### 3. Rebuild the app
```bash
npm run build
npx cap copy
npx cap open android
```

### 4. In Android Studio
- Clean Project: Build > Clean Project
- Rebuild Project: Build > Rebuild Project
- Run on device

## What Changed

### Files Updated:
1. ✅ `src/App.tsx` - Changed import and simplified initialization
2. ✅ `src/pages/Login.tsx` - Changed import and improved error handling
3. ✅ `capacitor.config.ts` - Added androidClientId configuration

### Configuration:
- **serverClientId**: `514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com` (Web)
- **androidClientId**: `514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com` (Android)

## Why This Works

The official `@capacitor/google-auth` plugin:
- ✅ Better maintained by Capacitor team
- ✅ More stable on Android devices
- ✅ Better error handling
- ✅ Works with Google Play Services
- ✅ Supports both Web and Android Client IDs

## Testing

After rebuilding:
1. Install APK on device
2. Click "Continue with Google"
3. Select Google account
4. Should successfully log in and navigate to home/profile

## Troubleshooting

If still getting errors:
1. Wait 10-15 minutes for Google Cloud changes to propagate
2. Clear app data and cache
3. Ensure Google Play Services is updated on device
4. Check device has active internet connection
5. Verify SHA-1 fingerprint is correct in Google Cloud Console

## Fallback

Phone login with OTP is always available as a reliable alternative.
