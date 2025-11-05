# Build APK and AAB for Urban Steam Customer App

## ✅ App Name Changed
- **Old Name**: Steam Iron
- **New Name**: Urban Steam

## 🚀 Build Steps

### Step 1: Clean and Build Web Assets
```bash
cd "d:\OFFICE WORK\laundry-main\customer"
npm run build
```

### Step 2: Sync with Capacitor
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```

### Step 4: Build APK in Android Studio
1. In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5: Build AAB (Release) in Android Studio
1. Go to **Build** → **Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Create or select your keystore
4. Choose **release** build variant
5. AAB will be located at: `android/app/build/outputs/bundle/release/app-release.aab`

## 📦 Alternative: Command Line Build

### For Debug APK:
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### For Release APK:
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### For Release AAB:
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 🔑 Signing (for Release builds)
You'll need a keystore file. If you don't have one, create it:
```bash
keytool -genkey -v -keystore urban-steam.keystore -alias urban-steam -keyalg RSA -keysize 2048 -validity 10000
```

Then add to `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=urban-steam.keystore
MYAPP_UPLOAD_KEY_ALIAS=urban-steam
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

## ✨ Quick Build Script
Run all steps at once:
```bash
npm run build && npx cap sync android && npx cap open android
```
