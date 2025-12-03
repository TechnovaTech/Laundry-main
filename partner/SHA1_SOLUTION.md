# SHA-1 Fingerprint Check - Partner App

## Problem
Your partner app was rejected in Google Play Console internal testing due to Google Sign-In error. This usually happens when APK and AAB files have different SHA-1 fingerprints.

## Files Found
✅ **Keystore**: `partner-release-key-new.keystore`
✅ **AAB File**: `Urban-Steam-Partner-Fresh-v1.5.aab`
✅ **Old AAB**: `Urban-Steam-Partner-v1.1.aab`

## Quick Solution

### Step 1: Get SHA-1 from Keystore
```bash
# Open Command Prompt and navigate to partner folder
cd "d:\OFFICE WORK\laundry-main\partner"

# Get SHA-1 (replace with your Java path)
"C:\Program Files\Java\jdk-21\bin\keytool.exe" -list -v -keystore partner-release-key-new.keystore -alias partner-key -storepass laundry123
```

### Step 2: Verify Both APK and AAB Use Same Keystore
Both files MUST be signed with `partner-release-key-new.keystore` to have the same SHA-1.

### Step 3: Check Your Build Commands
Make sure you're using these commands:

**For APK:**
```bash
cd android
gradlew assembleRelease
```

**For AAB:**
```bash
cd android
gradlew bundleRelease
```

## Most Likely Issue
Your APK and AAB were signed with **different keystores**:
- APK might be signed with debug keystore
- AAB signed with release keystore (`partner-release-key-new.keystore`)

## Solution
1. **Delete old APK/AAB files**
2. **Clean build:**
   ```bash
   cd android
   gradlew clean
   gradlew assembleRelease
   gradlew bundleRelease
   ```
3. **Both files will now have SAME SHA-1**

## Firebase Console Update
1. Get SHA-1 from keystore (Step 1 above)
2. Add this SHA-1 to Firebase Console:
   - Project Settings → Your Apps → Android App
   - Add the SHA-1 fingerprint
3. Download new `google-services.json`
4. Replace in `android/app/google-services.json`
5. Rebuild APK and AAB

## Verification
Both APK and AAB signed with same keystore = Same SHA-1 = Google Sign-In works!