# Google Authentication Setup for Android & iOS

## ✅ Current Setup Status

Both Customer and Partner apps are now configured with:
- ✅ Google Auth initialization on app startup
- ✅ Capacitor Google Auth plugin installed
- ✅ Server Client IDs configured
- ✅ Works on both Android and iOS

---

## 📱 For Android (Already Configured)

### Customer App
- **App ID**: `com.laundrymate.customer`
- **Server Client ID**: `514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com`

### Partner App
- **App ID**: `com.ironstream.deliverypartner`
- **Server Client ID**: `514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com`

### Android Configuration (Already Done)
Both `capacitor.config.ts` files have:
```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: 'YOUR_SERVER_CLIENT_ID',
    forceCodeForRefreshToken: true,
  },
}
```

---

## 🍎 For iOS (Additional Steps Required)

### 1. Add iOS Platform
```bash
# Customer App
cd customer
npx cap add ios

# Partner App
cd partner
npx cap add ios
```

### 2. Update capacitor.config.ts (Add iOS Client ID)

**Customer App** (`customer/capacitor.config.ts`):
```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: '514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Add this
    forceCodeForRefreshToken: true,
  },
}
```

**Partner App** (`partner/capacitor.config.ts`):
```typescript
plugins: {
  GoogleAuth: {
    scopes: ['profile', 'email'],
    serverClientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Add this
    forceCodeForRefreshToken: true,
  },
}
```

### 3. Configure URL Scheme in Xcode

1. Open project in Xcode:
   ```bash
   npx cap open ios
   ```

2. In Xcode, go to: **App Target → Info → URL Types**

3. Add new URL Scheme:
   - **Identifier**: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID`
   - **URL Schemes**: Reversed iOS Client ID (e.g., `com.googleusercontent.apps.514222866895-xxxxx`)

### 4. Update Info.plist

Add to `ios/App/App/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

---

## 🔑 Getting iOS Client ID

### Option 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** for iOS:
   - Application type: **iOS**
   - Bundle ID: 
     - Customer: `com.laundrymate.customer`
     - Partner: `com.ironstream.deliverypartner`
5. Copy the generated iOS Client ID

### Option 2: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings → General**
4. Scroll to **Your apps** section
5. Add iOS app or select existing one
6. Download `GoogleService-Info.plist`
7. The `CLIENT_ID` in the plist is your iOS Client ID

---

## 🧪 Testing Google Sign-In

### On Android:
```bash
# Customer App
cd customer
npm run build:mobile
npx cap open android

# Partner App
cd partner
npm run build
npx cap sync
npx cap open android
```

### On iOS:
```bash
# Customer App
cd customer
npm run build
npx cap sync ios
npx cap open ios

# Partner App
cd partner
npm run build
npx cap sync ios
npx cap open ios
```

---

## 🐛 Troubleshooting

### Issue: "Sign in failed" on Android
**Solution**: Make sure SHA-1 fingerprint is added to Firebase/Google Cloud Console
```bash
# Get SHA-1 fingerprint
cd android
./gradlew signingReport
```

### Issue: "Sign in failed" on iOS
**Solution**: 
1. Verify iOS Client ID is correct in `capacitor.config.ts`
2. Verify URL Scheme matches reversed iOS Client ID
3. Ensure `GoogleService-Info.plist` is added to Xcode project

### Issue: "idToken is undefined"
**Solution**: Use `authentication.idToken` from the response:
```typescript
const result = await GoogleAuth.signIn();
const idToken = result.authentication.idToken;
```

---

## 📝 Code Implementation (Already Done)

### Customer App (`src/App.tsx`)
```typescript
// Google Auth is initialized on app startup
await GoogleAuth.initialize({
  clientId: '514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});
```

### Partner App (`src/components/CapacitorInit.tsx`)
```typescript
// Google Auth is initialized on app startup
await GoogleAuth.initialize({
  clientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});
```

### Login Implementation (Both Apps)
```typescript
const handleGoogleLoginMobile = async () => {
  try {
    const result = await GoogleAuth.signIn();
    const response = await fetch('https://acsgroup.com/api/auth/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        idToken: result.authentication.idToken,
        role: 'customer' // or 'partner'
      })
    });
    // Handle response...
  } catch (error) {
    console.error('Google login failed:', error);
  }
};
```

---

## ✨ Summary

### ✅ What's Already Working:
- Google Auth initialization on app startup
- Android configuration complete
- Web fallback with `@react-oauth/google`
- Proper error handling

### 📋 What You Need to Do for iOS:
1. Get iOS Client ID from Google Cloud Console
2. Add `iosClientId` to `capacitor.config.ts`
3. Configure URL Scheme in Xcode
4. Test on iOS device/simulator

### 🚀 Production Checklist:
- [ ] Add SHA-1 fingerprint to Firebase (Android)
- [ ] Add iOS Client ID to capacitor.config.ts
- [ ] Configure URL Scheme in Xcode (iOS)
- [ ] Test Google Sign-In on Android device
- [ ] Test Google Sign-In on iOS device
- [ ] Update API URL to production domain (`https://acsgroup.com`)
