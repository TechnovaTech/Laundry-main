# 📦 Android App Bundle (.aab) Build Guide

## 🎯 What is an AAB?

An Android App Bundle (.aab) is the publishing format required by Google Play Console. It's more efficient than APK and allows Google Play to generate optimized APKs for different device configurations.

---

## ⚡ Quick Start (3 Commands)

```bash
# 1. Check if you're ready
check-aab-ready.bat

# 2. Create keystore (first time only)
create-keystore.bat

# 3. Build AAB
build-aab.bat
```

**Output:** `android\app\build\outputs\bundle\release\app-release.aab`

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `build-aab.bat` | Main script to build AAB |
| `create-keystore.bat` | Create signing keystore |
| `check-aab-ready.bat` | Verify prerequisites |
| `BUILD_AAB_GUIDE.md` | Detailed build guide |
| `AAB_QUICK_START.md` | Quick reference |
| `GOOGLE_PLAY_CHECKLIST.md` | Submission checklist |
| `AAB_BUILD_SUMMARY.md` | Complete summary |

---

## 🔧 Prerequisites

✅ **Included:**
- Java JDK 21 (in `jdk-21.0.9` folder)
- Capacitor configuration
- Android project setup

❓ **You Need:**
- Node.js and npm (already installed)
- Android SDK (install Android Studio)
- Google Play Console account

---

## 📝 Step-by-Step Process

### 1️⃣ First Time Setup

#### A. Check Readiness
```bash
check-aab-ready.bat
```

#### B. Create Keystore
```bash
create-keystore.bat
```

**You'll be asked for:**
- Keystore password (choose strong password)
- Key password (can be same as keystore)
- Your name
- Organization name
- City, State, Country

**⚠️ IMPORTANT:**
- Remember your passwords
- Backup the keystore file
- Never commit to Git (already in .gitignore)

#### C. Configure Environment
Edit `.env` file:
```env
VITE_API_URL=https://your-production-api.com
```

### 2️⃣ Build AAB

```bash
build-aab.bat
```

**The script will:**
1. Check Java installation
2. Verify keystore exists
3. Build web assets
4. Sync with Capacitor
5. Build signed AAB
6. Open output folder

### 3️⃣ Upload to Google Play

1. **Find AAB:** `android\app\build\outputs\bundle\release\app-release.aab`
2. **Go to:** [Google Play Console](https://play.google.com/console)
3. **Navigate:** Production → Create new release
4. **Upload:** Drag and drop the .aab file
5. **Fill:** Release notes and details
6. **Submit:** For review

---

## 🔄 For Updates

### Update Version
Edit `android/app/build.gradle`:
```gradle
versionCode 2  // Increment this (must be higher)
versionName "1.1"  // Update version string
```

### Build New AAB
```bash
build-aab.bat
```

### Upload to Play Console
- Create new release
- Upload new .aab
- Add release notes
- Submit for review

---

## 🎨 Google Play Assets

### Required Assets

1. **App Icon** (512x512 PNG)
   - No transparency
   - High quality

2. **Feature Graphic** (1024x500 PNG/JPEG)
   - Showcases your app
   - No transparency

3. **Screenshots** (at least 2)
   - Phone: 1080x1920 or 1920x1080
   - Show key features
   - Clear and professional

4. **Privacy Policy**
   - URL to your privacy policy
   - Must be accessible

5. **App Description**
   - Short: 80 characters
   - Full: Up to 4000 characters

See `GOOGLE_PLAY_CHECKLIST.md` for complete list.

---

## 🔐 Keystore Management

### Location
```
android\app\laundry-customer.keystore
```

### Backup Strategy
1. **Cloud Storage:** Google Drive, Dropbox
2. **USB Drive:** Keep offline backup
3. **Password Manager:** Store passwords securely

### Security Rules
- ✅ Backup immediately after creation
- ✅ Store in secure location
- ✅ Use strong passwords
- ❌ Never commit to Git
- ❌ Never share publicly
- ❌ Never lose it (can't update app without it)

---

## 🐛 Common Issues

### Issue: "Keystore not found"
**Solution:**
```bash
create-keystore.bat
```

### Issue: "JAVA_HOME not set"
**Solution:** Script sets it automatically. If persists:
```bash
set JAVA_HOME=d:\OFFICE WORK\laundry-main\customer\jdk-21.0.9
```

### Issue: "SDK location not found"
**Solution:** Create `android/local.properties`:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Issue: Build fails
**Solution:** Clean and rebuild:
```bash
cd android
gradlew.bat clean
cd ..
build-aab.bat
```

### Issue: Wrong API URL in build
**Solution:** Update `.env` and rebuild:
```bash
npm run build
npx cap sync
cd android
gradlew.bat bundleRelease
```

---

## 📊 Build Configuration

### Current Settings
```gradle
applicationId: com.laundrymate.customer
versionCode: 1
versionName: 1.0
minSdkVersion: 22 (Android 5.1)
targetSdkVersion: 34 (Android 14)
compileSdkVersion: 34
```

### File Location
`android/app/build.gradle`

---

## 🧪 Testing Before Release

### Test Checklist
- [ ] Install on physical device
- [ ] Test all major features
- [ ] Test Google Sign-In
- [ ] Test payments
- [ ] Test offline behavior
- [ ] Check for crashes
- [ ] Verify API connections
- [ ] Test on different Android versions
- [ ] Test on different screen sizes

### Internal Testing
Before production release:
1. Create internal testing track in Play Console
2. Add test users
3. Upload AAB to internal testing
4. Test thoroughly
5. Fix any issues
6. Then promote to production

---

## 📈 Version Management

### Version Code
- Integer that increases with each release
- Google Play uses this to determine updates
- Must always increase

### Version Name
- String shown to users
- Can be any format (1.0, 1.0.0, v1.0, etc.)
- Semantic versioning recommended: MAJOR.MINOR.PATCH

### Example Progression
```
Release 1: versionCode 1, versionName "1.0"
Release 2: versionCode 2, versionName "1.1"
Release 3: versionCode 3, versionName "1.2"
Release 4: versionCode 4, versionName "2.0"
```

---

## 🎯 Release Tracks

### Internal Testing
- Quick testing with team
- No review process
- Up to 100 testers

### Closed Testing
- Invite-only testing
- Larger group of testers
- Gather feedback before public release

### Open Testing
- Public beta
- Anyone can join
- Get feedback from real users

### Production
- Public release
- Available to all users
- Requires review (1-3 days)

---

## 📞 Support

### Documentation
- `BUILD_AAB_GUIDE.md` - Detailed guide
- `AAB_QUICK_START.md` - Quick reference
- `GOOGLE_PLAY_CHECKLIST.md` - Submission checklist
- `AAB_BUILD_SUMMARY.md` - Complete summary

### Useful Links
- [Google Play Console](https://play.google.com/console)
- [Android Developer Docs](https://developer.android.com)
- [App Bundle Format](https://developer.android.com/guide/app-bundle)
- [Publishing Guide](https://developer.android.com/studio/publish)

---

## ✅ Pre-Release Checklist

- [ ] Keystore created and backed up
- [ ] Version code incremented
- [ ] Version name updated
- [ ] Environment variables set to production
- [ ] App tested thoroughly
- [ ] AAB built successfully
- [ ] AAB file size checked (< 150MB)
- [ ] App icon ready (512x512)
- [ ] Feature graphic ready (1024x500)
- [ ] Screenshots captured (at least 2)
- [ ] Privacy policy URL ready
- [ ] App description written
- [ ] Release notes prepared
- [ ] Google Play Console account ready

---

## 🚀 Launch Day

1. ✅ Complete all checklist items
2. ✅ Build final AAB
3. ✅ Upload to Google Play Console
4. ✅ Fill in all required information
5. ✅ Submit for review
6. ✅ Wait for approval (1-3 days)
7. ✅ Publish to production
8. ✅ Monitor for crashes and reviews
9. ✅ Respond to user feedback
10. ✅ Plan for updates

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just follow the steps above and you'll have your app on Google Play in no time!

**Start here:** Run `check-aab-ready.bat` to verify everything is ready.

**Good luck with your launch! 🚀**
