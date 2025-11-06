import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ironstream.deliverypartner',
  appName: 'Urban Steam Captain',
  webDir: '.next',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
    iosScheme: 'capacitor',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    appendUserAgent: 'CapacitorApp'
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      showSpinner: false,
      androidSplashResourceName: 'splash',
      splashFullScreen: false,
      splashImmersive: false
    }
  }
};

export default config;
