'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import BottomNav from "@/components/BottomNav";
import { API_URL } from '@/config/api';
import { Capacitor } from '@capacitor/core';

export default function DropToHub() {
  const router = useRouter();
  const [hub, setHub] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
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
    await fetchHubAndOrders();
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
          fetchHubAndOrders();
        }
      }
    } catch (error) {
      console.error('Failed to check KYC status:', error);
    }
  };

  const fetchHubAndOrders = async () => {
    setLoading(true);
    const partnerId = localStorage.getItem('partnerId');
    const partnerRes = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`);
    const partnerData = await partnerRes.json();
    
    if (partnerData.success && partnerData.data.address?.pincode) {
      const hubRes = await fetch(`${API_URL}/api/hubs?pincode=${partnerData.data.address.pincode}`);
      const hubData = await hubRes.json();
      if (hubData.success && hubData.data.length > 0) setHub(hubData.data[0]);
    }

    const ordersRes = await fetch(`${API_URL}/api/orders`);
    const ordersData = await ordersRes.json();
    if (ordersData.success) {
      console.log('Partner ID:', partnerId);
      console.log('All orders:', ordersData.data.length);
      
      const deliveryFailedOrders = ordersData.data.filter((o: any) => o.status === 'delivery_failed');
      console.log('Delivery failed orders:', deliveryFailedOrders);
      deliveryFailedOrders.forEach((o: any) => {
        console.log(`Order ${o.orderId}:`, {
          status: o.status,
          partnerId: o.partnerId?._id,
          redeliveryScheduled: o.redeliveryScheduled,
          returnToHubApproved: o.returnToHubApproved,
          returnToHubRequested: o.returnToHubRequested
        });
      });
      
      const filtered = ordersData.data.filter((o: any) => {
        const isPartnerMatch = o.partnerId?._id === partnerId;
        const isPickedUp = o.status === 'picked_up';
        const isDeliveryFailed = o.status === 'delivery_failed' && !o.redeliveryScheduled && !o.returnToHubApproved;
        const isRedeliveryFailed = o.status === 'delivery_failed' && o.redeliveryScheduled && !o.redeliveryReturnApproved;
        
        return isPartnerMatch && (isPickedUp || isDeliveryFailed || isRedeliveryFailed);
      });
      
      // Check for delivered orders
      const delivered = ordersData.data.filter((o: any) => {
        const isPartnerMatch = o.partnerId?._id === partnerId;
        const isDeliveredToHub = o.status === 'delivered_to_hub';
        return isPartnerMatch && isDeliveredToHub;
      });
      
      console.log('Filtered orders:', filtered);
      setOrders(filtered);
      setDeliveredOrders(delivered);
    }
    setLoading(false);
  };

  return (
    <div className="pb-6">
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
          <h2 className="text-lg font-semibold text-black">Drop To Hub</h2>
          <span style={{ color: '#452D9B' }}>🔔</span>
        </div>
      </header>

      {/* Delivered Orders Alert */}
      <button
        onClick={() => router.push('/hub/delivered')}
        className="w-full text-white py-2.5 px-4 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(to right, #10b981, #059669)',
          transition: 'opacity 0.2s'
        }}
        onTouchStart={(e) => e.currentTarget.style.opacity = '0.9'}
        onTouchEnd={(e) => e.currentTarget.style.opacity = '1'}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-white bg-opacity-25 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">✅</span>
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-bold">Orders Delivered to Hub</p>
            <p className="text-xs opacity-90">{deliveredOrders.length > 0 ? `${deliveredOrders.length} order(s) • ` : ''}Tap to view details</p>
          </div>
        </div>
      </button>

      {/* Map */}
      {hub && (
        <div className="mt-3 mx-4 relative rounded-xl overflow-hidden h-48">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${hub.address.street}, ${hub.address.city}, ${hub.address.state}`)}&zoom=15`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute left-4 bottom-4 bg-white shadow-sm rounded-xl px-4 py-2">
            <p className="text-sm font-semibold text-black">{hub.name}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hub.address.street}, ${hub.address.city}`)}`} target="_blank" className="text-xs" style={{ color: '#452D9B' }}>Open in Google Maps</a>
          </div>
        </div>
      )}

      {/* Orders to Drop */}
      <div className="mt-4 mx-4">
        <p className="text-base font-semibold text-black">Orders to Drop ({orders.length})</p>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4" style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #10b981',
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
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="mt-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders([...selectedOrders, order._id]);
                      } else {
                        setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                      }
                    }}
                    className="mt-1 w-4 h-4"
                    style={{ accentColor: '#452D9B' }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-black">Order ID: #{order.orderId}</p>
                    <p className="text-xs text-black mt-1">{order.items?.length || 0} items</p>
                    <span className="mt-1 text-xs" style={{ color: order.status === 'delivery_failed' || (order.status === 'out_for_delivery' && order.redeliveryScheduled) ? '#dc2626' : '#452D9B' }}>
                      {order.status === 'delivery_failed' ? (order.redeliveryScheduled ? '⚠ Redelivery Failed' : '⚠ Delivery Failed') : 
                       order.status === 'out_for_delivery' && order.redeliveryScheduled ? '🔄 Redelivery Order' : 
                       'Picked Up'}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-black">{order.customerId?.name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-12 text-center px-6">
            <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <span className="text-6xl">📦</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600 text-sm">No orders ready to drop at the hub right now. Orders will appear here after you complete pickups.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4">
        <button
          onClick={async () => {
            try {
              const ordersToUpdate = selectedOrders.length > 0 ? selectedOrders : orders.map(o => o._id);
              console.log('Orders to update:', ordersToUpdate);
              
              let hasFailedOrders = false;
              
              for (const orderId of ordersToUpdate) {
                const order = orders.find(o => o._id === orderId);
                console.log('Processing order:', order?.orderId, 'Status:', order?.status);
                
                if (order?.status === 'delivery_failed') {
                  hasFailedOrders = true;
                  console.log('Sending return request for failed delivery order:', orderId);
                  
                  // Check if it's a redelivery failure
                  const isRedeliveryFailure = order.redeliveryScheduled === true;
                  
                  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      returnToHubRequested: true,
                      returnToHubRequestedAt: new Date().toISOString(),
                      ...(isRedeliveryFailure && { 
                        redeliveryReturnRequested: true,
                        redeliveryReturnRequestedAt: new Date().toISOString()
                      })
                    })
                  });
                  const result = await response.json();
                  console.log('Return request response:', result);
                } else {
                  console.log('Sending normal hub delivery for order:', orderId);
                  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      status: 'delivered_to_hub',
                      deliveredToHubAt: new Date().toISOString()
                    })
                  });
                  const result = await response.json();
                  console.log('Hub delivery response:', result);
                }
              }
              
              if (hasFailedOrders) {
                const hasRedeliveryFailures = ordersToUpdate.some(id => {
                  const order = orders.find(o => o._id === id);
                  return order?.redeliveryScheduled === true;
                });
                
                if (hasRedeliveryFailures) {
                  setToast({ message: 'Redelivery return request sent to admin', type: 'success' });
                } else {
                  setToast({ message: 'Return request sent to admin for approval', type: 'success' });
                }
              } else {
                setToast({ message: 'Orders delivered to hub successfully', type: 'success' });
              }
              
              setTimeout(() => router.push('/hub/delivered'), 1500);
            } catch (error) {
              console.error('Error dropping orders:', error);
              setToast({ message: 'Failed to drop orders. Please try again.', type: 'error' });
            }
          }}
          disabled={orders.length === 0}
          className="mt-5 w-full inline-flex justify-center items-center text-white rounded-xl py-3 text-base font-semibold"
          style={orders.length > 0 ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          Drop to Hub ({selectedOrders.length > 0 ? selectedOrders.length : orders.length})
        </button>
      </div>
      <BottomNav />
    </div>
  );
}