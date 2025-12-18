import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

// Global error handlers to prevent crashes
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

const GOOGLE_WEB_CLIENT_ID = "514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com";

// Initialize Google Auth for Capacitor with proper error handling
if (Capacitor.isNativePlatform()) {
  try {
    GoogleAuth.initialize({
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  } catch (error) {
    console.error('Google Auth initialization error:', error);
    // Continue app initialization even if Google Auth fails
  }
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
