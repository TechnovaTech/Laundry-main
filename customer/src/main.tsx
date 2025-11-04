import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

const GOOGLE_WEB_CLIENT_ID = "514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com";

// Initialize Google Auth for Capacitor - uses strings.xml configuration
if (Capacitor.isNativePlatform()) {
  GoogleAuth.initialize();
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
