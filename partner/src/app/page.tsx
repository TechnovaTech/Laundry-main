"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/check-availability"), 1800);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #452D9B 0%, #07C8D0 100%)' }}>
      <div className="flex flex-col items-center text-center px-6">
        <div className="mx-auto w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl">
          <span className="text-7xl">🛵</span>
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Steam Iron Partner</h1>
        <p className="mt-3 text-lg opacity-95">Smart pickups & fast deliveries</p>
        <div className="mt-8 flex gap-2.5">
          <span className="loading-dot bg-white" style={{ animationDelay: "0ms" }} />
          <span className="loading-dot bg-white" style={{ animationDelay: "150ms" }} />
          <span className="loading-dot bg-white" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="mt-4 text-sm opacity-90 font-medium">Initializing...</p>
      </div>

      <p className="absolute bottom-10 text-sm opacity-90 font-medium">Checking assignments...</p>
    </div>
  );
}
