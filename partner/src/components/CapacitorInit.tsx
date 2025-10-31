"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CapacitorInit() {
  const router = useRouter();

  useEffect(() => {
    // Dynamically import to avoid bundling plugin on web
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        
        // Initialize Google Auth for native platforms
        const { GoogleAuth } = await import("@codetrix-studio/capacitor-google-auth");
        await GoogleAuth.initialize({
          clientId: '514222866895-13bj0clqdvkihfpockb9bmkn9ufbvinf.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
        
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Handle Android back button
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