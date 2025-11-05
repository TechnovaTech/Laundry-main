"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CapacitorInit() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        
        // Initialize Google Auth
        const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
        try {
          await GoogleAuth.initialize({
            clientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
          });
          console.log('Google Auth initialized successfully');
        } catch (error) {
          console.error('Google Auth initialization failed:', error);
        }
        
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        
        const { App } = await import("@capacitor/app");
        App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) {
            router.back();
          } else {
            App.exitApp();
          }
        });
      } catch (e) {
        console.warn("Capacitor init skipped:", e);
      }
    })();
  }, [router]);

  return null;
}