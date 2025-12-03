# Google Sign-In Setup - Partner App

## 📱 APK Information
- **Latest APK**: `Partner-App-v1.7-GoogleAuth-Complete-Fix.apk`
- **Package Name**: `com.urbansteam.partner`
- **App Name**: Urban Steam Captain

## 🔧 How Google Sign-In Works

### 1. **Configuration Files**
```
📁 partner/
├── capacitor.config.ts          # Google Auth client ID
├── android/app/google-services.json  # Firebase configuration
└── src/components/CapacitorInit.tsx   # Initialization logic
```

### 2. **Client ID Setup**
- **Android Client ID**: `514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com`
- **Package Name**: `com.urbansteam.partner`
- **SHA-1 Fingerprint**: `B8:45:94:86:85:23:1F:49:B0:71:DB:C5:83:DC:7B:49:86:BF:8B:A2`

### 3. **Initialization Flow**
```typescript
// 1. App starts → CapacitorInit.tsx runs
await GoogleAuth.initialize({
  clientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  grantOfflineAccess: true
});

// 2. Sets global flag
window.googleAuthInitialized = true;

// 3. Login page checks initialization
if (!window.googleAuthInitialized) {
  // Re-initialize if needed
}

// 4. Sign-in process
const result = await GoogleAuth.signIn();
```

### 4. **Sign-In Process**
1. **User taps "Continue with Google"**
2. **Check if GoogleAuth is initialized**
3. **Call GoogleAuth.signIn()**
4. **Get idToken from result**
5. **Send to backend API**
6. **Redirect based on user status**

## 🔑 Google Cloud Console Setup

### Required Configuration:
1. **Project**: laundry-mate-app
2. **OAuth 2.0 Client ID**: Android type
3. **Package Name**: `com.urbansteam.partner`
4. **SHA-1 Certificate**: `B8:45:94:86:85:23:1F:49:B0:71:DB:C5:83:DC:7B:49:86:BF:8B:A2`

### Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. **Create OAuth 2.0 Client ID** (Android)
4. Add package name and SHA-1 fingerprint
5. Copy client ID to `capacitor.config.ts`

## 📱 Google Play Console Setup

### App Signing Configuration:
- **App Signing Key SHA-1**: `B8:45:94:86:85:23:1F:49:B0:71:DB:C5:83:DC:7B:49:86:BF:8B:A2`
- **Upload Key SHA-1**: `93:B6:E9:BB:2C:7F:DB:97:1B:18:85:56:CF:BF:68:FE:BB:73:1D:11`

### Important:
- Use **App Signing Key SHA-1** in Google Cloud Console
- This ensures Google Sign-In works on Google Play Store

## 🔄 Authentication Flow

```
User Login → Google Sign-In → Get ID Token → Backend API → Response
     ↓              ↓              ↓              ↓           ↓
  Tap Button → GoogleAuth.signIn() → idToken → /api/auth/google-login → Success/Error
```

## 🛠️ Files Modified

### `capacitor.config.ts`
```typescript
GoogleAuth: {
  scopes: ['profile', 'email'],
  serverClientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
  forceCodeForRefreshToken: true
}
```

### `android/app/google-services.json`
```json
{
  "client_info": {
    "android_client_info": {
      "package_name": "com.urbansteam.partner"
    }
  },
  "oauth_client": [{
    "client_id": "514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com",
    "certificate_hash": "b84594868523f149b071dbc583dc7b4986bf8ba2"
  }]
}
```

### `CapacitorInit.tsx`
- Initializes GoogleAuth on app startup
- Sets global initialization flag
- Handles proper configuration

### `login/page.tsx`
- Checks initialization before sign-in
- Handles mobile Google Sign-In flow
- Sends idToken to backend

## ✅ Testing Checklist

1. **Install APK**: `Partner-App-v1.7-GoogleAuth-Complete-Fix.apk`
2. **Tap "Continue with Google"**
3. **Should open Google account picker**
4. **Select account and sign in**
5. **Should redirect to app (new user → profile, existing → pickups)**

## 🐛 Troubleshooting

### Common Errors:
- **"Something went wrong"**: SHA-1 not added to Google Cloud Console
- **"12501: User Cancelled"**: Wrong client ID or package name mismatch
- **"10: Developer Error"**: Missing google-services.json or SHA-1 mismatch

### Solutions:
1. **Verify SHA-1** in Google Cloud Console matches Google Play Console
2. **Check package name** is `com.urbansteam.partner`
3. **Ensure google-services.json** exists in `android/app/`
4. **Use Android Client ID** (not Web Client ID)

## 📋 Summary

✅ **Google Cloud Console**: Configured with correct SHA-1  
✅ **Google Play Console**: App signing configured  
✅ **APK**: Built with proper configuration  
✅ **Initialization**: Proper GoogleAuth setup  
✅ **Sign-In Flow**: Complete authentication process  

**Google Sign-In is now fully functional in the Partner App!**