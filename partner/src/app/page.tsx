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
    
    const partnerId = localStorage.getItem("partnerId");
    const authToken = localStorage.getItem("authToken");
    
    if (partnerId && authToken) {
      router.replace("/pickups");
    } else {
      router.replace("/welcome");
    }


  }, [router, isCapacitor]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFFFF' }}>
      <div className="text-center px-5">
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
            }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes dotPulse {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          .scooter-circle {
            animation: pulse 2s ease-in-out infinite;
          }
          .scooter-icon {
            animation: bounce 1.5s ease-in-out infinite;
          }
          .dot {
            animation: dotPulse 1.4s ease-in-out infinite;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
        `}</style>
        
        <div className="scooter-circle" style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '4px solid #EF4444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 30px'
        }}>
          <span className="scooter-icon" style={{ fontSize: '80px' }}>🛵</span>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '12px'
        }}>Urban Steam Captain</h1>
        
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '30px'
        }}>Smart pickups & fast deliveries</p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <div className="dot" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#EF4444'
          }}></div>
          <div className="dot" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#EF4444'
          }}></div>
          <div className="dot" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#EF4444'
          }}></div>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#9CA3AF'
        }}>Initializing...</p>
      </div>
    </div>
  );
}
