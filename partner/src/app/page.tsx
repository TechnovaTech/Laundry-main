"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // Only redirect if we're actually on the root page
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      return;
    }
    
    // Immediate redirect without splash screen
    const partnerId = localStorage.getItem("partnerId");
    const authToken = localStorage.getItem("authToken");
    
    if (partnerId && authToken) {
      // User is logged in, skip to pickups
      router.replace("/pickups");
    } else {
      // User not logged in, go to check availability
      router.replace("/check-availability");
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#452D9B' }}></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
