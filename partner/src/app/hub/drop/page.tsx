import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

export default function DropToHub() {
  return (
    <div className="pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-black">Drop To Hub</h2>
          <span className="text-blue-600">🔔</span>
        </div>
      </header>

      {/* Hub card */}
      <div className="mt-3 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <p className="text-base font-semibold text-black">Main Processing Hub</p>
        <p className="mt-2 text-sm text-black">📍 123 Hub Street, City</p>
        <button className="mt-3 inline-flex items-center rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">Open in Maps</button>
      </div>

      {/* Orders to Drop */}
      <div className="mt-4 mx-4">
        <p className="text-base font-semibold text-black">Orders to Drop</p>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">Order ID: #12345</p>
              <p className="text-xs text-black mt-1">3 shirts, 1 bedsheet</p>
              <button className="mt-1 text-xs text-blue-600">Picked Up</button>
            </div>
            <span className="text-sm text-black">John Smith</span>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">Order ID: #12346</p>
              <p className="text-xs text-black mt-1">2 coats, 1 pair of pants</p>
              <button className="mt-1 text-xs text-blue-600">Picked Up</button>
            </div>
            <span className="text-sm text-black">Emily Johnson</span>
          </div>
        </div>
      </div>

      {/* Empty state illustration */}
      <div className="mt-6 px-4 text-center">
        <Image src="/window.svg" alt="Hub" width={200} height={140} className="mx-auto" />
        <p className="mt-2 text-base font-semibold">No orders to deliver.</p>
        <p className="text-xs text-black">Pickups will appear here after collection.</p>
      </div>

      {/* CTA */}
      <div className="px-4">
        <Link href="/hub/delivered" className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">
          Delivered to Hub
        </Link>
      </div>
      <BottomNav />
    </div>
  );
}