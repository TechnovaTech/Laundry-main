"use client";
import { useEffect } from "react";

export default function CapacitorInit() {
  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        
        console.log('Initializing Capacitor for Android...');
        
        // Initialize Google Auth with proper configuration
        try {
          const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
          await GoogleAuth.initialize({
            clientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true
          });
          console.log('✓ Google Auth initialized with client ID');
          
          // Store initialization status globally
          (window as any).googleAuthInitialized = true;
        } catch (error) {
          console.error('✗ Google Auth initialization failed:', error);
          (window as any).googleAuthInitialized = false;
        }
        
        // Status Bar
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#452D9B' });
        console.log('✓ Status Bar configured');
        
        // Back Button Handler
        const { App } = await import("@capacitor/app");
        App.addListener("backButton", () => {
          const currentPath = window.location.pathname;
          const exitPages = ['/', '/pickups', '/check-availability'];
          
          if (exitPages.includes(currentPath)) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });
        console.log('✓ Back button handler registered');
        
        console.log('✓ Capacitor initialization complete');
      } catch (e) {
        console.error("Capacitor initialization error:", e);
      }
    })();
  }, []);

  return null;
}