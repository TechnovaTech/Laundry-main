import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.urbansteam.deliverypartner',
  appName: 'Urban Steam Captain',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'localhost'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    overrideUserAgent: 'CapacitorApp',
    appendUserAgent: 'CapacitorApp'
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#452D9B',
      overlaysWebView: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
