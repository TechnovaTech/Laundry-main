"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        setIsCapacitor(Capacitor.isNativePlatform());
      } catch {
        setIsCapacitor(false);
      }
    };
    checkPlatform();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') return;
    
    const timer = setTimeout(() => {
      const partnerId = localStorage.getItem("partnerId");
      const authToken = localStorage.getItem("authToken");
      
      if (partnerId && authToken) {
        router.replace("/pickups");
      } else {
        router.replace("/welcome");
      }
    }, isCapacitor ? 100 : 0);

    return () => clearTimeout(timer);
  }, [router, isCapacitor]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #452D9B 0%, #07C8D0 100%)' }}>
      <div className="text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-5xl">🚚</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Urban Steam Captain</h1>
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <p className="text-white/90 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}
