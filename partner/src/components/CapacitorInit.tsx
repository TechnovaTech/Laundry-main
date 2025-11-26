"use client";
import { useEffect } from "react";

export default function CapacitorInit() {
  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        
        console.log('Initializing Capacitor for Android...');
        
        // Initialize Google Auth - uses strings.xml configuration
        try {
          const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
          await GoogleAuth.initialize();
          console.log('✓ Google Auth initialized using strings.xml configuration');
        } catch (error) {
          console.error('✗ Google Auth initialization failed:', error);
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