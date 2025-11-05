# 🚀 Quick Start: Build AAB for Google Play

## 3 Simple Steps

### Step 1: Create Keystore (First Time Only)
```bash
create-keystore.bat
```
- Choose a strong password
- **BACKUP THE KEYSTORE FILE!**

### Step 2: Build AAB
```bash
build-aab.bat
```
- Enter your keystore password when prompted
- Wait for build to complete

### Step 3: Upload to Google Play
1. Find your AAB at: `android\app\build\outputs\bundle\release\app-release.aab`
2. Go to [Google Play Console](https://play.google.com/console)
3. Upload the .aab file

---

## 📋 What You Need

- ✅ Java JDK 21 (already included in `jdk-21.0.9` folder)
- ✅ Node.js and npm (already installed)
- ✅ Android SDK (install Android Studio if not present)

---

## 🔑 Keystore Information

**Location:** `android\app\laundry-customer.keystore`

**Alias:** `laundry-customer`

**⚠️ CRITICAL:** 
- Never lose this file (you can't update your app without it)
- Never commit to Git (already in .gitignore)
- Keep passwords secure

---

## 📦 App Details

- **Package Name:** com.laundrymate.customer
- **Version Code:** 1
- **Version Name:** 1.0
- **Min SDK:** 22 (Android 5.1)
- **Target SDK:** 34 (Android 14)

---

## 🔄 For Updates

1. Edit `android/app/build.gradle`:
   ```gradle
   versionCode 2  // Increment this
   versionName "1.1"  // Update version
   ```

2. Run `build-aab.bat` again

3. Upload new .aab to Google Play Console

---

## ❓ Troubleshooting

**"Keystore not found"**
→ Run `create-keystore.bat` first

**"JAVA_HOME not set"**
→ Script sets it automatically, restart if needed

**"SDK location not found"**
→ Install Android Studio or set SDK path in `android/local.properties`

**Build fails**
→ Try: `cd android && gradlew.bat clean && cd ..` then run `build-aab.bat` again

---

## 📞 Need Help?

See detailed guide: `BUILD_AAB_GUIDE.md`

---

**Ready? Run `create-keystore.bat` then `build-aab.bat`** 🎉
