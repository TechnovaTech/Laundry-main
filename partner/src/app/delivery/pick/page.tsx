"use client";
import Link from "next/link";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

type Order = {
  id: string;
  customer: string;
  items: string;
  address: string;
};

const ORDERS: Order[] = [
  { id: "56789", customer: "Alex Johnson", items: "2 shirts, 1 bedsheet", address: "123 Main St, Springfield" },
  { id: "56890", customer: "Maria Lopez", items: "3 towels, 2 pillowcases", address: "456 Elm St," },
  { id: "56901", customer: "John Smith", items: "1 jacket, 2 hats", address: "789 Pine St," },
];

export default function PickForDelivery() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["56901"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-black">Pick for Delivery</h2>
          <span className="text-blue-600">🔔</span>
        </div>
        <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">Orders ready at Main Processing Hub</div>
      </header>

      {/* Section title */}
      <div className="px-4 pt-4">
        <p className="text-base font-semibold text-black">Select Orders to Deliver</p>
      </div>

      {/* Cards */}
      <div className="mt-3 px-4 flex flex-col gap-4">
        {ORDERS.map((o) => {
          const isSelected = selected.has(o.id);
          return (
            <div key={o.id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-black">Order ID: #{o.id}</p>
                  <p className="text-xs text-gray-600 mt-2">Customer: <span className="text-black">{o.customer}</span></p>
                  <p className="text-xs text-gray-600 mt-1">Items: <span className="text-black">{o.items}</span></p>
                  <p className="text-xs text-gray-600 mt-1">Address: <span className="text-black">{o.address}</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    aria-label={isSelected ? "Selected" : "Not selected"}
                    onClick={() => toggle(o.id)}
                    className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center ${
                      isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-blue-400"
                    }`}
                  >
                    {isSelected ? "✔" : ""}
                  </button>
                  <span className="text-blue-600">ℹ️</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm CTA */}
      <div className="px-4">
        <Link href="/delivery/56789" className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">
          Confirm Selection
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}