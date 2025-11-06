# 📱 Safe Area & Navigation Button Handling Guide

## Problem Statement
Mobile devices have:
- **Status bar** at the top (time, battery, signal)
- **Notches/Dynamic Island** on modern phones
- **Navigation buttons** at the bottom (back, home, recent apps)
- **Gesture bars** on gesture-based navigation

Without proper handling, your app content gets hidden behind these UI elements.

---

## ✅ Complete Solution (Copy-Paste Ready)

### Step 1: Install Required Packages

```bash
npm install @capacitor/status-bar @capacitor/safe-area
npx cap sync
```

### Step 2: Configure Status Bar (App Entry Point)

**For React/Vite (`src/main.tsx` or `src/App.tsx`):**
```typescript
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// Initialize status bar on app start
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Light }); // or Style.Dark
  StatusBar.setBackgroundColor({ color: '#452D9B' }); // Your brand color
  StatusBar.setOverlaysWebView({ overlay: false }); // Important!
}
```

**For Next.js (`src/app/layout.tsx` or `_app.tsx`):**
```typescript
'use client';
import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function RootLayout({ children }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#452D9B' });
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }, []);

  return <html><body>{children}</body></html>;
}
```

### Step 3: Add Safe Area CSS (Global Styles)

**Add to `src/index.css` or `globals.css`:**
```css
/* Safe Area Variables */
:root {
  --sat: env(safe-area-inset-top);
  --sar: env(safe-area-inset-right);
  --sab: env(safe-area-inset-bottom);
  --sal: env(safe-area-inset-left);
}

/* Apply to body */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Utility classes for manual control */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}

.safe-all {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### Step 4: Fix Bottom Navigation/Tab Bar

**React Component Example:**
```tsx
import { SafeArea } from '@capacitor/safe-area';
import { useEffect, useState } from 'react';

export function BottomNav() {
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  useEffect(() => {
    SafeArea.getSafeAreaInsets().then(({ insets }) => {
      setSafeAreaBottom(insets.bottom);
    });
  }, []);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t z-50"
      style={{ 
        paddingBottom: `${safeAreaBottom}px`,
        // Alternative: paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* Your navigation items */}
      <div className="flex justify-around py-3">
        <button>Home</button>
        <button>Orders</button>
        <button>Profile</button>
      </div>
    </nav>
  );
}
```

**Tailwind CSS Approach (Recommended):**
```tsx
export function BottomNav() {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around py-3">
        <button>Home</button>
        <button>Orders</button>
        <button>Profile</button>
      </div>
    </nav>
  );
}
```

### Step 5: Configure Capacitor

**Update `capacitor.config.ts`:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourapp.id',
  appName: 'YourApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#452D9B',
      overlaysWebView: false
    },
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: '#452D9B',
      navigationBarColor: '#FFFFFF'
    }
  }
};

export default config;
```

### Step 6: Android Configuration

**Update `android/app/src/main/res/values/styles.xml`:**
```xml
<resources>
    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:windowDrawsSystemBarBackgrounds">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/white</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    </style>
</resources>
```

**Update `android/app/src/main/AndroidManifest.xml`:**
```xml
<activity
    android:theme="@style/AppTheme.NoActionBar"
    android:windowSoftInputMode="adjustResize">
</activity>
```

### Step 7: iOS Configuration

**Update `ios/App/App/Info.plist`:**
```xml
<key>UIViewControllerBasedStatusBarAppearance</key>
<true/>
<key>UIStatusBarStyle</key>
<string>UIStatusBarStyleLightContent</string>
```

---

## 🎯 Common Use Cases

### Fixed Header with Safe Area
```tsx
<header 
  className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#452D9B] to-[#07C8D0] z-50"
  style={{ paddingTop: 'env(safe-area-inset-top)' }}
>
  <div className="px-4 py-4">
    <h1 className="text-white text-xl font-bold">My App</h1>
  </div>
</header>
```

### Full-Screen Modal
```tsx
<div 
  className="fixed inset-0 bg-white z-50"
  style={{ 
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)'
  }}
>
  <div className="p-4">
    {/* Modal content */}
  </div>
</div>
```

### Scrollable Content with Fixed Bottom Button
```tsx
<div className="min-h-screen pb-24"> {/* Extra padding for button */}
  {/* Scrollable content */}
</div>

<button 
  className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#452D9B] to-[#07C8D0] text-white py-4"
  style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
>
  Continue
</button>
```

---

## 🔧 Debugging Tips

### Check Safe Area Values
```typescript
import { SafeArea } from '@capacitor/safe-area';

SafeArea.getSafeAreaInsets().then(({ insets }) => {
  console.log('Top:', insets.top);
  console.log('Bottom:', insets.bottom);
  console.log('Left:', insets.left);
  console.log('Right:', insets.right);
});
```

### Visual Debug Helper
```tsx
// Add this component temporarily to see safe areas
export function SafeAreaDebug() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-red-500 opacity-50 z-[9999]" 
           style={{ height: 'env(safe-area-inset-top)' }} />
      <div className="fixed bottom-0 left-0 right-0 bg-blue-500 opacity-50 z-[9999]" 
           style={{ height: 'env(safe-area-inset-bottom)' }} />
    </>
  );
}
```

---

## 📋 Quick Checklist

- [ ] Install `@capacitor/status-bar` and `@capacitor/safe-area`
- [ ] Configure StatusBar in app entry point
- [ ] Add safe area CSS variables to global styles
- [ ] Update `capacitor.config.ts` with StatusBar and SafeArea plugins
- [ ] Fix bottom navigation with `paddingBottom: env(safe-area-inset-bottom)`
- [ ] Fix top header with `paddingTop: env(safe-area-inset-top)`
- [ ] Update Android `styles.xml` and `AndroidManifest.xml`
- [ ] Update iOS `Info.plist`
- [ ] Run `npx cap sync`
- [ ] Test on real device (not emulator for accurate results)

---

## 🚨 Common Mistakes to Avoid

1. **Don't use fixed pixel values** - Device safe areas vary
2. **Don't forget `npx cap sync`** - After config changes
3. **Don't test only on emulator** - Real devices have different safe areas
4. **Don't set `overlaysWebView: true`** - Unless you want transparent status bar
5. **Don't forget z-index** - Fixed elements need proper stacking

---

## 💡 Pro Tips

1. **Use CSS variables** for consistency across components
2. **Test on multiple devices** - iPhone with notch, Android with buttons
3. **Consider landscape mode** - Safe areas change in landscape
4. **Use `calc()`** for combined padding: `calc(1rem + env(safe-area-inset-bottom))`
5. **Dark mode support** - Switch StatusBar style based on theme

---

## 🎨 Tailwind Plugin (Optional)

Create custom Tailwind utilities:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    }
  }
}
```

Usage:
```tsx
<div className="pt-safe-top pb-safe-bottom">
  Content with safe areas
</div>
```

---

## 📱 Device-Specific Notes

### iPhone X and newer (with notch/Dynamic Island)
- Top safe area: ~44-59px
- Bottom safe area: ~34px (home indicator)

### Android with gesture navigation
- Top safe area: ~24-48px (status bar)
- Bottom safe area: ~0-24px (gesture bar)

### Android with button navigation
- Top safe area: ~24-48px (status bar)
- Bottom safe area: ~48px (navigation buttons)

---

**Save this guide and use it for any Capacitor/React Native project! 🚀**
