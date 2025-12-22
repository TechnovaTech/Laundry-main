import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.urbansteam.customerapp',
  appName: 'Urban Steam',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#ffffff',
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    handleNavigationEvent: true
  },
  ios: {
    contentInset: 'automatic'
  },
  plugins: {
    StatusBar: {
      style: 'light',
      overlaysWebView: true,
      backgroundColor: '#00000000'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      androidClientId: '514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com'
    }
  }
};

export default config;
