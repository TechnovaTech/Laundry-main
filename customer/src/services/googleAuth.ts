import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

export class GoogleAuthService {
  private static initialized = false;

  static async initialize() {
    if (this.initialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await GoogleAuth.initialize({
        clientId: '514222866895-0i6cvatbmt7qnqhepqd3j0uv1er5hnb4.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      this.initialized = true;
      console.log('Google Auth initialized successfully');
    } catch (error) {
      console.error('Google Auth initialization failed:', error);
      throw error;
    }
  }

  static async signIn() {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Native Google Auth only available on mobile platforms');
    }

    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const result = await GoogleAuth.signIn();
      console.log('Google Sign-In successful:', result);
      return result;
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  }

  static async signOut() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await GoogleAuth.signOut();
      console.log('Google Sign-Out successful');
    } catch (error) {
      console.error('Google Sign-Out failed:', error);
      throw error;
    }
  }
}