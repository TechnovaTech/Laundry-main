'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

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
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      const data = await response.json();
      
      if (data.success) {
        const pendingPickups = data.data.filter((order: any) => 
          order.status === 'pending' || order.status === 'confirmed'
        );
        setPickups(pendingPickups);
      }
    } catch (error) {
      console.error('Failed to fetch pickups:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">Today’s Pickups</h2>
          <span className="text-blue-600">🔔</span>
        </div>
        {/* Intentionally no location line to match screenshot */}
      </header>

      {/* Map Banner */}
      <div className="mt-3 mx-4 relative rounded-xl overflow-hidden h-40">
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
        <div className="absolute left-4 top-4 bg-white shadow-sm rounded-xl px-4 py-2 text-sm font-medium">
          {pickups.length} pickups assigned today
        </div>
      </div>

      {/* Pickup cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading pickups...</div>
        ) : pickups.length > 0 ? (
          pickups.map((p) => (
            <div key={p._id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-black">{p.customerId?.name || 'Customer'}</p>
                  <p className="text-xs text-black mt-1">
                    {p.pickupAddress?.street}, {p.pickupAddress?.city}
                  </p>
                  <p className="text-[11px] mt-1 text-black">
                    Pickup {p.pickupSlot?.timeSlot || 'Time not set'}
                  </p>
                </div>
                <span className="text-xs text-gray-500">Order #{p.orderId}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <a href={`tel:${p.customerId?.mobile}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">
                  <span>📞</span>
                  Call
                </a>
                <Link href={`/pickups/start/${p._id}`} className="inline-flex justify-center items-center bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
                  Start Pickup
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-6 px-4 text-center">
            <Image src="/scooter.svg" alt="Scooter" width={180} height={130} className="mx-auto" />
            <p className="mt-2 text-base font-semibold">No pickups assigned yet.</p>
            <p className="text-xs text-black">Orders will appear here once assigned.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}