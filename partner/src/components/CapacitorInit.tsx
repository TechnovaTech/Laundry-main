"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();
  const listenerAdded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        
        console.log('Initializing Capacitor for Android...');
        
        // Initialize Google Auth
        const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
        try {
          await GoogleAuth.initialize({
            clientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
          console.log('✓ Google Auth initialized');
        } catch (error) {
          console.error('✗ Google Auth failed:', error);
        }
        
        // Status Bar
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#452D9B' });
        console.log('✓ Status Bar configured');
        
        // Back Button Handler - Register only once
        if (!listenerAdded.current) {
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
          listenerAdded.current = true;
          console.log('✓ Back button handler registered');
        }
        
        console.log('✓ Capacitor initialization complete');
      } catch (e) {
        console.warn("Capacitor init skipped:", e);
      }
    })();
  }, []);

  return null;
}