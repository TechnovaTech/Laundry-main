"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import BottomNav from "@/components/BottomNav";
import { API_URL } from '@/config/api';

export default function PickForDelivery() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkKYCStatus();
      setupPullToRefresh();
    }
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
    await fetchOrders();
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
          fetchOrders();
        }
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      const partnerRes = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`);
      const partnerData = await partnerRes.json();
      
      if (partnerData.success && partnerData.data.address?.pincode) {
        const partnerPincode = partnerData.data.address.pincode;
        
        const ordersRes = await fetch(`${API_URL}/api/orders`);
        const ordersData = await ordersRes.json();
        
        if (ordersData.success) {
          console.log('Partner pincode:', partnerPincode);
          console.log('All orders:', ordersData.data);
          
          // Check for active delivery
          const active = ordersData.data.find((order: any) => {
            const orderPartnerId = typeof order.partnerId === 'object' ? order.partnerId?._id : order.partnerId;
            return orderPartnerId === partnerId && order.status === 'out_for_delivery';
          });
          setActiveDelivery(active || null);
          
          const filteredOrders = ordersData.data.filter((order: any) => {
            console.log('Order:', order.orderId, 'Status:', order.status, 'Delivery Pincode:', order.deliveryAddress?.pincode, 'Pickup Pincode:', order.pickupAddress?.pincode);
            return order.status === 'process_completed' && 
                   (order.deliveryAddress?.pincode === partnerPincode || order.pickupAddress?.pincode === partnerPincode);
          });
          console.log('Filtered orders:', filteredOrders);
          setOrders(filteredOrders);
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="pb-24" suppressHydrationWarning>
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
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-black">Pick for Delivery</h2>
          <span style={{ color: '#452D9B' }}>🔔</span>
        </div>
        <div className="text-white text-center py-2 text-sm font-semibold" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>Orders ready at Main Processing Hub</div>
      </header>

      {/* Active Delivery Alert */}
      {activeDelivery && (
        <button
          onClick={() => router.push(`/delivery/details?id=${activeDelivery._id}`)}
          className="w-full text-white py-3 px-4 flex items-center justify-between"
          style={{ 
            background: 'linear-gradient(to right, #f59e0b, #d97706)',
            transition: 'opacity 0.2s'
          }}
          onTouchStart={(e) => e.currentTarget.style.opacity = '0.9'}
          onTouchEnd={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-25 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🚚</span>
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold">Delivery in Progress</p>
              <p className="text-xs opacity-90">Order #{activeDelivery.orderId} - Tap to continue</p>
            </div>
          </div>
          <span className="text-xl">→</span>
        </button>
      )}

      {/* Section title */}
      <div className="px-4 pt-4">
        <p className="text-base font-semibold text-black">Select Orders to Deliver ({orders.length})</p>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="mt-4 px-4 text-center text-gray-500">Loading...</div>
      ) : orders.length > 0 ? (
        <div className="mt-3 px-4 flex flex-col gap-4">
          {orders.map((order) => {
            const isSelected = selected.has(order._id);
            return (
              <div key={order._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <p className="text-sm font-semibold text-black">Order ID: #{order.orderId}</p>
                      {order.redeliveryScheduled && <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }}>REDELIVERY</span>}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Customer: <span className="text-black">{order.customerId?.name || 'N/A'}</span></p>
                    <p className="text-xs text-gray-600 mt-1">Items: <span className="text-black">{order.items?.map((item: any) => item.quantity + ' ' + item.name).join(', ')}</span></p>
                    <p className="text-xs text-gray-600 mt-1">Address: <span className="text-black">{order.pickupAddress?.street}, {order.pickupAddress?.city}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label={isSelected ? "Selected" : "Not selected"}
                      onClick={() => toggle(order._id)}
                      className="h-8 w-8 rounded-lg border-2 flex items-center justify-center text-white"
                      style={isSelected ? { borderColor: '#452D9B', background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { borderColor: '#b8a7d9', background: 'transparent', color: '#000' }}
                    >
                      {isSelected ? "✔" : ""}
                    </button>
                    <span style={{ color: '#452D9B' }}>ℹ️</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center">
          <p className="text-base font-semibold">No orders available for delivery.</p>
          <p className="text-xs text-gray-600">Orders ready for delivery in your area will appear here.</p>
        </div>
      )}

      {/* Confirm CTA */}
      <div className="px-4">
        <button
          onClick={() => {
            if (selected.size > 0) {
              const firstOrderId = Array.from(selected)[0];
              router.push(`/delivery/details?id=${firstOrderId}`);
            } else {
              setToast({ message: 'Please select at least one order', type: 'warning' });
            }
          }}
          disabled={orders.length === 0}
          className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
          style={orders.length > 0 ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          Confirm Selection ({selected.size})
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
