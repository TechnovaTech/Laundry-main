# 📱 Partner Android App

**Urban Steam Captain** - Delivery Partner Application

---

## 🚀 Quick Build

### Windows (One-Click)
```bash
build-android.bat
```

### Mac/Linux
```bash
npm run build:android
```

---

## 📋 What You Need

1. **Node.js** (v18+)
2. **Android Studio**
3. **Java JDK** (v17+)

Check setup:
```bash
check-setup.bat
```

---

## 🔨 Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env`:
```
NEXT_PUBLIC_API_URL=https://acsgroup.cloud
```

### 3. Build & Open
```bash
npm run build:android
```

### 4. In Android Studio
- Wait for Gradle sync
- Build → Build APK
- Find APK in: `android/app/build/outputs/apk/debug/`

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Fast reference guide |
| `ANDROID_SETUP.md` | Complete setup instructions |
| `BUILD_ANDROID.md` | Build process details |
| `ANDROID_CONVERSION.md` | What was changed |

---

## 🎯 Key Features

✅ Google Authentication (native)
✅ Mobile OTP login
✅ Order pickup management
✅ Hub drop-off
✅ Delivery tracking
✅ KYC verification
✅ Profile management
✅ Real-time updates

---

## 🔧 Common Commands

```bash
npm run dev              # Web dev server
npm run build            # Build web assets
npm run build:android    # Build + open Android Studio
npm run cap:sync         # Sync to Android
npm run cap:open         # Open Android Studio
npm run assets           # Generate icons/splash
```

---

## 📱 App Info

- **Package**: com.ironstream.deliverypartner
- **Name**: Urban Steam Captain
- **Version**: 1.0.0
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)

---

## 🐛 Troubleshooting

**White screen?**
```bash
npm run build && npm run cap:sync
```

**Build fails?**
```bash
npm install && npm run build
```

**Google Auth not working?**
1. Run `GET_SHA1.bat`
2. Add SHA-1 to Firebase Console
3. Download `google-services.json` to `android/app/`

---

## 📞 Need Help?

1. Check `ANDROID_SETUP.md` for detailed instructions
2. Run `check-setup.bat` to verify prerequisites
3. Review Android Studio Logcat for errors

---

## 🎉 Ready to Build!

Run this now:
```bash
build-android.bat
```

Then test your APK on a device!

---

**Made with ❤️ for Urban Steam Captain Partners**
