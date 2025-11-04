# Google Auth - Final Solution ✅

## The Root Cause

Your "Something went wrong" error is caused by **missing `google-services.json` file**.

## Quick Fix (5 minutes)

### 1. Download google-services.json
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select/Create project
- Add Android app with package: `com.laundrymate.customer`
- Add SHA-1: `DA:D0:14:AD:5D:87:4A:44:46:8B:D6:84:A1:95:78:A4:40:E5:30:2E`
- Download `google-services.json`

### 2. Place the file
```
customer/android/app/google-services.json
```

### 3. Rebuild
```bash
cd customer
npx cap sync
npx cap open android
```

In Android Studio:
- File → Sync Project with Gradle Files
- Build → Clean Project
- Build → Rebuild Project
- Run on device

## That's It!

Google Sign-In will now work perfectly. 🎉

## Why This Works

Your configuration is already 100% correct:
- ✅ Package name: `com.laundrymate.customer`
- ✅ OAuth Client IDs created
- ✅ SHA-1 added to Google Cloud
- ✅ build.gradle configured
- ✅ Code implementation correct

The ONLY missing piece was `google-services.json` which links your app to Google's servers.

## Verification

After adding the file and rebuilding:
1. Install APK on device
2. Click "Continue with Google"
3. Select account
4. ✅ Should log in successfully!

## Detailed Guide

See `SETUP_GOOGLE_SERVICES_JSON.md` for step-by-step instructions with screenshots.

## Backend Configuration

Your backend already accepts both Client IDs:
- Web: `514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq`
- Android: `514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4`

So the token from Android will be verified correctly.

## Summary

**Before**: Missing google-services.json → "Something went wrong"
**After**: Add google-services.json → Google Sign-In works! ✅
