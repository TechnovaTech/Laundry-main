'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { API_URL } from '@/config/api';

export default function DeliveredToHub() {
  const [delivered, setDelivered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const partnerId = localStorage.getItem('partnerId');
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      
      if (data.success) {
        const filteredOrders = data.data.filter((order: any) => {
          const isMyOrder = order.partnerId?._id === partnerId || order.partnerId === partnerId;
          const isDeliveredToHub = order.status === 'delivered_to_hub' || order.status === 'ready' || order.status === 'delivered';
          const isReturnApproved = order.status === 'delivery_failed' && order.returnToHubApproved;
          return isMyOrder && (isDeliveredToHub || isReturnApproved);
        });
        setDelivered(filteredOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/hub/drop" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivered to Hub</h2>
          <span style={{ color: '#452D9B' }}>🔽</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none"
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
            placeholder="Search by Order ID / Customer"
          />
          <button className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center" style={{ color: '#452D9B' }}>🔽</button>
        </div>
      </div>

      {/* Delivered cards */}
      {loading ? (
        <div className="mt-4 px-4 text-center text-gray-500">Loading...</div>
      ) : delivered.length > 0 ? (
        <div className="mt-4 px-4 flex flex-col gap-4">
          {delivered.map((order: any) => (
            <div key={order._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-base font-semibold text-black">#{order.orderId}</p>
                  <p className="text-sm text-gray-700 mt-1">{order.customerId?.name || 'Customer'}</p>
                  <p className="text-xs text-black mt-1">{order.items?.length || 0} items • ₹{order.totalAmount || 0}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Delivered: {order.deliveredToHubAt ? new Date(order.deliveredToHubAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredToHubAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                  </p>
                  {(order.status === 'ready' || order.status === 'delivered') && order.hubApprovedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Approved: {new Date(order.hubApprovedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.hubApprovedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  )}
                  {order.status === 'delivery_failed' && order.returnToHubApproved && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Return Approved: {order.returnToHubApprovedAt ? new Date(order.returnToHubApprovedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.returnToHubApprovedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                    </p>
                  )}
                </div>
                <span className={`rounded-full text-white px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                  order.status === 'ready' || order.status === 'delivered' ? 'bg-green-500' : 
                  order.status === 'delivery_failed' && order.returnToHubApproved ? 'bg-blue-500' :
                  'bg-orange-500'
                }`}>
                  {order.status === 'ready' || order.status === 'delivered' ? 'Approved' : 
                   order.status === 'delivery_failed' && order.returnToHubApproved ? 'Return OK' :
                   'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 px-4 text-center">
          <Image src="/Delivery.svg" alt="Hub Building" width={260} height={180} className="mx-auto" />
          <p className="mt-2 text-base font-semibold">No delivered orders found.</p>
          <p className="text-xs text-black">Orders you deliver to hub will appear here.</p>
        </div>
      )}
    </div>
  );
}
