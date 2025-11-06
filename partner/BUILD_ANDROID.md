# Build Android App - Partner App

## Prerequisites
1. Node.js installed
2. Android Studio installed
3. Java JDK 17+ installed

## Quick Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Android
```bash
npm run build:android
```

This will:
- Build the Next.js app as static export
- Sync with Capacitor
- Open Android Studio

### 3. In Android Studio
1. Wait for Gradle sync to complete
2. Select "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
3. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Manual Steps

### Build Web Assets
```bash
npm run build
```

### Sync with Capacitor
```bash
npm run cap:sync
```

### Open Android Studio
```bash
npm run cap:open
```

## Generate App Icons & Splash Screens
```bash
npm run assets
```

Place your icon at `resources/icon.png` (1024x1024)
Place your splash at `resources/splash.png` (2732x2732)

## Environment Variables
Create `.env` file:
```
NEXT_PUBLIC_API_URL=https://acsgroup.cloud
```

## Troubleshooting

### Build fails with "webDir not found"
Run: `npm run build` first

### Gradle sync fails
1. Open Android Studio
2. File → Invalidate Caches → Restart
3. Sync Project with Gradle Files

### Google Auth not working
1. Get SHA-1 fingerprint: `npm run sha1` or use `GET_SHA1.bat`
2. Add to Firebase Console
3. Download `google-services.json`
4. Place in `android/app/`

## Production Build
1. Update version in `android/app/build.gradle`
2. Build → Generate Signed Bundle / APK
3. Create/use keystore
4. Build release APK

## Testing on Device
```bash
# Install on connected device
cd android
./gradlew installDebug
```

## App Details
- **App ID**: com.ironstream.deliverypartner
- **App Name**: Urban Steam Captain
- **Package**: com.ironstream.deliverypartner
