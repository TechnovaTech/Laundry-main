# 📦 Build Android App Bundle (.aab) for Google Play Console

## 🎯 Quick Start

Run this command in the customer folder:
```bash
build-aab.bat
```

The .aab file will be generated at:
```
android\app\build\outputs\bundle\release\app-release.aab
```

---

## 📋 Prerequisites

1. ✅ Java JDK 21 (already in `jdk-21.0.9` folder)
2. ✅ Android SDK (via Android Studio)
3. ✅ Keystore file for signing (you need to create this)

---

## 🔑 Step 1: Create Keystore (First Time Only)

### Option A: Using the provided script
```bash
create-keystore.bat
```

### Option B: Manual creation
```bash
cd android\app
keytool -genkey -v -keystore laundry-customer.keystore -alias laundry-customer -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Save the keystore password and alias password securely!

---

## 🔧 Step 2: Configure Signing

The `build-aab.bat` script will automatically create `android/key.properties` with your keystore details.

You'll be prompted to enter:
- Keystore password
- Key alias
- Key password

---

## 🚀 Step 3: Build the AAB

### Automated Build (Recommended)
```bash
build-aab.bat
```

### Manual Build
```bash
# 1. Build web assets
npm run build

# 2. Sync with Capacitor
npx cap sync

# 3. Build AAB
cd android
gradlew.bat bundleRelease
```

---

## 📍 Output Location

After successful build, find your .aab file at:
```
customer\android\app\build\outputs\bundle\release\app-release.aab
```

---

## 📤 Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create new app)
3. Go to **Production** → **Create new release**
4. Upload `app-release.aab`
5. Fill in release details
6. Review and rollout

---

## 🔍 Verify Your AAB

Check AAB details:
```bash
cd android
gradlew.bat printBundleSize
```

---

## ⚙️ Build Configuration

### Current Settings (build.gradle)
- **Application ID:** `com.laundrymate.customer`
- **Version Code:** 1
- **Version Name:** 1.0
- **Min SDK:** 22
- **Target SDK:** 34
- **Compile SDK:** 34

### To Update Version
Edit `android/app/build.gradle`:
```gradle
versionCode 2
versionName "1.1"
```

---

## 🐛 Troubleshooting

### Error: "Keystore not found"
- Make sure you created the keystore file
- Check the path in `key.properties`

### Error: "JAVA_HOME not set"
- The script sets it automatically to `jdk-21.0.9`
- If issues persist, set manually:
  ```bash
  set JAVA_HOME=d:\OFFICE WORK\laundry-main\customer\jdk-21.0.9
  ```

### Error: "SDK location not found"
- Create `android/local.properties`:
  ```
  sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
  ```

### Error: "Build failed"
- Clean the build:
  ```bash
  cd android
  gradlew.bat clean
  gradlew.bat bundleRelease
  ```

---

## 📝 Important Notes

1. **Keystore Security:** Never commit your keystore file or passwords to Git
2. **Version Management:** Increment versionCode for each release
3. **Testing:** Test the release build before uploading
4. **Backup:** Keep a backup of your keystore file (if lost, you can't update the app)

---

## 🎨 App Details for Play Console

- **App Name:** Laundry Mate Customer
- **Package Name:** com.laundrymate.customer
- **Category:** Lifestyle
- **Content Rating:** Everyone

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message in the console
2. Review the troubleshooting section above
3. Ensure all prerequisites are installed
4. Try cleaning and rebuilding

---

## ✅ Checklist Before Upload

- [ ] Keystore created and secured
- [ ] Version code incremented (if updating)
- [ ] App tested on physical device
- [ ] All API URLs point to production
- [ ] Google services configured
- [ ] App icons and splash screens updated
- [ ] Privacy policy and terms updated
- [ ] AAB file generated successfully
- [ ] AAB file size is reasonable (< 150MB)

---

**Ready to build? Run `build-aab.bat` now!** 🚀
