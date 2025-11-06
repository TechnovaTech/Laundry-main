# 🚀 Partner App - Quick Start

## Build Android APK in 3 Steps

### Step 1: Install
```bash
npm install
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Open Android Studio
```bash
npm run cap:open
```

Then in Android Studio:
- Build → Build APK
- Find APK in: `android/app/build/outputs/apk/debug/`

---

## Or Use One Command

### Windows:
```bash
build-android.bat
```

### Mac/Linux:
```bash
npm run build:android
```

---

## Environment Setup

Create `.env`:
```
NEXT_PUBLIC_API_URL=https://acsgroup.cloud
```

---

## Common Commands

```bash
# Development
npm run dev                 # Web dev server (port 3002)

# Build
npm run build              # Build web assets
npm run build:android      # Build + open Android Studio

# Capacitor
npm run cap:sync          # Sync to Android
npm run cap:open          # Open Android Studio

# Assets
npm run assets            # Generate icons/splash
```

---

## Troubleshooting

**White screen?**
```bash
npm run build && npm run cap:sync
```

**Google Auth not working?**
1. Run `GET_SHA1.bat`
2. Add SHA-1 to Firebase
3. Download `google-services.json` to `android/app/`

**Build error?**
```bash
npm install
npm run build
```

---

## App Info

- **Package**: com.ironstream.deliverypartner
- **Name**: Urban Steam Captain
- **Port**: 3002 (dev)
- **API**: https://acsgroup.cloud

---

## Next Steps

1. ✅ Build APK
2. ✅ Test on device
3. ✅ Configure Google Auth
4. ✅ Generate release APK
5. ✅ Deploy to Play Store

See `ANDROID_SETUP.md` for detailed instructions.
