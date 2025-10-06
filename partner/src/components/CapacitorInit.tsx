"use client";
import { useEffect } from "react";

export default function CapacitorInit() {
  useEffect(() => {
    // Dynamically import to avoid bundling plugin on web
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        // Ensure status bar does not overlay the webview content
        await StatusBar.setOverlaysWebView({ overlay: false });
        // Use dark icons on light background
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        // Ignore if plugin not available
        console.warn("Capacitor status bar init skipped:", e);
      }
    })();
  }, []);

  return null;
}