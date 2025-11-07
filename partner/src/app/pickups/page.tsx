'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import BottomNav from "@/components/BottomNav";
import { API_URL } from '@/config/api';

interface Pickup {
  _id: string;
  orderId: string;
  customerId: {
    name: string;
    mobile: string;
  };
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  pickupSlot: {
    date: string;
    timeSlot: string;
  };
  status: string;
}

export default function Pickups() {
  const router = useRouter();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingPickup, setStartingPickup] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePickup, setActivePickup] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    checkKYCStatus();
    setupPullToRefresh();
    
    // Auto-refresh every 30 seconds for new orders
    const interval = setInterval(() => {
      if (!loading && !startingPickup) {
        fetchPickups(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const setupPullToRefresh = () => {
    let startY = 0;
    let currentY = 0;
    let pulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling) return;
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 80 && !refreshing) {
        setRefreshing(true);
        handleRefresh();
        pulling = false;
      }
    };

    const handleTouchEnd = () => {
      pulling = false;
      startY = 0;
      currentY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  };

  const handleRefresh = async () => {
    await fetchPickups(true);
    setRefreshing(false);
  };

  const checkKYCStatus = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      if (!partnerId) {
        router.push('/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`);
      const data = await response.json();
      
      if (data.success) {
        const kycStatus = data.data.kycStatus;
        
        if (kycStatus === 'rejected') {
          router.push('/profile/kyc');
          return;
        }
        
        if (kycStatus === 'pending') {
          router.push('/profile/kyc-details');
          return;
        }
        
        if (kycStatus === 'approved') {
          fetchPickups();
        }
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      setLoading(false);
    }
  };

  const fetchPickups = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      const partnerId = localStorage.getItem('partnerId');
      const partnerRes = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`);
      const partnerData = await partnerRes.json();
      
      if (partnerData.success && partnerData.data.address?.pincode) {
        const partnerPincode = partnerData.data.address.pincode;
        
        const response = await fetch(`${API_URL}/api/orders`);
        const data = await response.json();
        
        if (data.success) {
          // Check for active pickup (any order assigned to this partner that's not completed)
          const active = data.data.find((order: any) => {
            const orderPartnerId = typeof order.partnerId === 'object' ? order.partnerId?._id : order.partnerId;
            const isMatch = orderPartnerId === partnerId;
            const isActiveStatus = ['pending', 'reached_location', 'picked_up'].includes(order.status);
            console.log('Checking order:', order.orderId, 'Partner match:', isMatch, 'Status:', order.status, 'Active:', isActiveStatus);
            return isMatch && isActiveStatus;
          });
          console.log('Active pickup found:', active);
          setActivePickup(active || null);
          
          const pendingPickups = data.data.filter((order: any) => {
            const isInPartnerArea = order.pickupAddress?.pincode === partnerPincode;
            const isPending = order.status === 'pending';
            const isNotFailed = order.paymentStatus !== 'failed';
            const isUnassigned = !order.partnerId;
            
            return isPending && isInPartnerArea && isNotFailed && isUnassigned;
          });
          
          setPickups(pendingPickups);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };

  return (
    <div className="page-content bg-gray-50 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#452D9B', borderTopColor: 'transparent' }}></div>
            <span className="text-sm font-medium" style={{ color: '#452D9B' }}>Refreshing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-4 pt-6 pb-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Today&apos;s Pickups</h2>
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0ebf8' }}>
            <span className="text-xl">🔔</span>
          </button>
        </div>
      </header>

      {/* Active Pickup Alert */}
      {activePickup && (
        <button
          onClick={() => {
            if (activePickup.status === 'pending') {
              router.push(`/pickups/start?id=${activePickup._id}`);
            } else if (activePickup.status === 'reached_location') {
              router.push(`/pickups/confirm?id=${activePickup._id}`);
            } else if (activePickup.status === 'picked_up') {
              router.push('/hub/drop');
            }
          }}
          className="w-full bg-red-500 text-white py-3 px-4 flex items-center justify-between"
          style={{ backgroundColor: '#ef4444' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div className="text-left">
              <p className="text-sm font-bold">Active Pickup in Progress</p>
              <p className="text-xs">Order #{activePickup.orderId} - Tap to continue</p>
            </div>
          </div>
          <span className="text-xl">→</span>
        </button>
      )}

      {/* Map Banner */}
      <div className="mt-4 mx-4 relative rounded-2xl overflow-hidden h-40 shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Floating card */}
        <div className="absolute left-4 top-4 bg-white shadow-lg rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900">
          <span style={{ color: '#452D9B' }}>{pickups.length}</span> pickups today
        </div>
      </div>

      {/* Pickup cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4" style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #452D9B',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p className="text-gray-600">Loading orders...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : pickups.length > 0 ? (
          pickups.map((p) => (
            <div key={p._id} className="rounded-2xl bg-white card-shadow p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">{p.customerId?.name || 'Customer'}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {p.pickupAddress?.street}, {p.pickupAddress?.city}
                  </p>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#452D9B' }}>
                    🕐 {p.pickupSlot?.timeSlot || 'Time not set'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">#{p.orderId}</span>
              </div>
              <div className="flex items-center gap-3">
                <a href={'tel:' + p.customerId?.mobile} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-bold btn-press" style={{ borderColor: '#452D9B', color: '#452D9B' }}>
                  <span>📞</span>
                  Call
                </a>
                <button
                  onClick={async () => {
                    if (startingPickup) return;
                    
                    setStartingPickup(p._id);
                    try {
                      const partnerId = localStorage.getItem('partnerId');
                      
                      const checkRes = await fetch(`${API_URL}/api/orders/${p._id}`);
                      const checkData = await checkRes.json();
                      
                      if (checkData.data?.partnerId && checkData.data.partnerId !== partnerId) {
                        setToast({ message: 'This order was just assigned to another partner', type: 'warning' });
                        fetchPickups();
                        setStartingPickup(null);
                        return;
                      }
                      
                      const assignRes = await fetch(`${API_URL}/api/orders/${p._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ partnerId })
                      });
                      
                      if (!assignRes.ok) {
                        setToast({ message: 'Failed to assign order. Please try again.', type: 'error' });
                        setStartingPickup(null);
                        return;
                      }
                      
                      // Use router.push for proper SPA navigation
                      router.push(`/pickups/start?id=${p._id}`);
                    } catch (error) {
                      console.error('Error starting pickup:', error);
                      setToast({ message: 'Network error. Please try again.', type: 'error' });
                      setStartingPickup(null);
                    }
                  }}
                  className="flex-1 inline-flex justify-center items-center text-white rounded-xl py-2.5 text-sm font-bold shadow-md btn-press"
                  style={{ 
                    background: startingPickup === p._id 
                      ? '#9ca3af' 
                      : 'linear-gradient(to right, #452D9B, #07C8D0)',
                    pointerEvents: startingPickup === p._id ? 'none' : 'auto'
                  }}
                >
                  {startingPickup === p._id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Starting...
                    </div>
                  ) : (
                    'Start Pickup'
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-20 text-center px-6">
            <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #452D9B 0%, #07C8D0 100%)' }}>
              <span className="text-6xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 text-base">No customers have placed orders in your area. Orders will appear here when customers make bookings.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
