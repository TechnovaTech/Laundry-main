# Partner Android App - Complete Setup Guide

## 🚀 Quick Start

### Option 1: One-Click Build (Windows)
```bash
build-android.bat
```

### Option 2: Manual Build
```bash
npm install
npm run build:android
```

---

## 📋 Prerequisites

### 1. Node.js
- Version: 18+ or 20+
- Download: https://nodejs.org/

### 2. Android Studio
- Download: https://developer.android.com/studio
- Install with Android SDK
- Minimum SDK: 22 (Android 5.1)
- Target SDK: 34 (Android 14)

### 3. Java JDK
- Version: 17 or higher
- Set JAVA_HOME environment variable

---

## 🔧 Initial Setup

### 1. Install Dependencies
```bash
cd partner
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
NEXT_PUBLIC_API_URL=https://acsgroup.cloud
```

### 3. Build Web Assets
```bash
npm run build
```

This creates the `out/` directory with static files.

### 4. Sync with Capacitor
```bash
npm run cap:sync
```

This copies web assets to `android/app/src/main/assets/public/`

---

## 📱 Building APK

### Debug APK (for testing)

#### Method 1: Android Studio
1. Run: `npm run cap:open`
2. Wait for Gradle sync
3. Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Method 2: Command Line
```bash
cd android
./gradlew assembleDebug
```

### Release APK (for production)

1. **Create Keystore** (first time only):
```bash
keytool -genkey -v -keystore partner-release.keystore -alias partner -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Signing** in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../partner-release.keystore')
            storePassword 'your-password'
            keyAlias 'partner'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

3. **Build Release APK**:
```bash
cd android
./gradlew assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔐 Google Authentication Setup

### 1. Get SHA-1 Fingerprint

#### Debug SHA-1:
```bash
cd android
./gradlew signingReport
```

Or use: `GET_SHA1.bat`

#### Release SHA-1:
```bash
keytool -list -v -keystore partner-release.keystore -alias partner
```

### 2. Add to Firebase Console
1. Go to Firebase Console
2. Project Settings → Your Apps → Android App
3. Add SHA-1 fingerprint
4. Download `google-services.json`
5. Place in `android/app/google-services.json`

### 3. Verify Configuration
- Client ID in `capacitor.config.ts`: `514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com`
- Package name: `com.ironstream.deliverypartner`

---

## 🎨 App Icons & Splash Screens

### Generate Assets
```bash
npm run assets
```

### Required Source Files
Place in `resources/` folder:
- `icon.png` - 1024x1024px (app icon)
- `splash.png` - 2732x2732px (splash screen)

### Manual Icon Setup
Icons are in: `android/app/src/main/res/`
- `mipmap-hdpi/` - 72x72
- `mipmap-mdpi/` - 48x48
- `mipmap-xhdpi/` - 96x96
- `mipmap-xxhdpi/` - 144x144
- `mipmap-xxxhdpi/` - 192x192

---

## 🧪 Testing

### Install on Device
1. Enable USB Debugging on Android device
2. Connect via USB
3. Run:
```bash
cd android
./gradlew installDebug
```

### Run in Emulator
1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Run → Run 'app'

### Live Reload (Development)
```bash
npm run dev
```
Then update `capacitor.config.ts`:
```typescript
server: {
  url: 'http://192.168.1.100:3002',
  cleartext: true
}
```
Run: `npm run cap:sync`

---

## 📦 App Configuration

### App Details
- **App ID**: com.ironstream.deliverypartner
- **App Name**: Urban Steam Captain
- **Version**: Check `android/app/build.gradle`

### Update Version
Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 2
        versionName "1.1.0"
    }
}
```

### Permissions
Configured in `android/app/src/main/AndroidManifest.xml`:
- Internet
- Network State
- Camera (for KYC)
- Location (for delivery tracking)

---

## 🐛 Troubleshooting

### Build Fails: "webDir not found"
```bash
npm run build
```

### Gradle Sync Issues
1. Android Studio → File → Invalidate Caches → Restart
2. Delete `android/.gradle/` and `android/build/`
3. Sync again

### Google Auth Not Working
1. Verify SHA-1 in Firebase
2. Check `google-services.json` exists
3. Verify package name matches

### White Screen on Launch
1. Check `out/` directory has files
2. Run: `npm run cap:sync`
3. Rebuild app

### API Calls Failing
1. Check `.env` has correct API_URL
2. Rebuild: `npm run build`
3. Sync: `npm run cap:sync`

---

## 📝 Build Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (web) |
| `npm run build` | Build static export |
| `npm run build:android` | Build + sync + open Android Studio |
| `npm run cap:sync` | Sync web assets to Android |
| `npm run cap:open` | Open Android Studio |
| `npm run cap:copy` | Copy web assets only |
| `npm run assets` | Generate icons & splash screens |

---

## 🚀 Deployment Checklist

- [ ] Update version in `build.gradle`
- [ ] Set production API URL in `.env`
- [ ] Build: `npm run build`
- [ ] Test on multiple devices
- [ ] Generate release APK with signing
- [ ] Test release APK
- [ ] Upload to Google Play Console

---

## 📞 Support

For issues:
1. Check console logs in Android Studio (Logcat)
2. Check browser console in app (enable webContentsDebuggingEnabled)
3. Review `BUILD_ANDROID.md` for quick reference

---

## 🎯 Key Features Enabled

✅ Google Authentication (native)
✅ Status Bar customization
✅ Back button handling
✅ Splash screen
✅ App icons
✅ Network requests
✅ Local storage
✅ Camera access (KYC)
✅ Location services (delivery)

---

**App is now ready for Android deployment!** 🎉
