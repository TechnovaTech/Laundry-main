import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

export default function DeliveryDetails({ params }: any) {
  const id = params.id;
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/delivery/pick" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivery Details</h2>
          <span className="text-blue-600">🔔</span>
        </div>
      </header>

      {/* Order summary card */}
      <div className="mt-3 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-black">Order #{id}</p>
          <span className="rounded-lg bg-blue-600 text-white px-3 py-1 text-xs font-semibold">Out for Delivery</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-black">John Smith</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-black">123-456-7890</p>
            <button className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">📞</button>
          </div>
        </div>
        <p className="mt-2 text-sm text-black">📍 123 Main St, Springfield</p>
        <button className="mt-2 text-sm text-blue-600">Open in Maps</button>
      </div>

      {/* Map banner */}
      <div className="mt-3 mx-4 relative rounded-xl overflow-hidden border border-gray-200">
        <Image src="/map-temp.svg" alt="Route Map" width={800} height={260} className="w-full h-48 object-cover" />
        <div className="absolute left-4 bottom-4 bg-white/90 rounded-xl px-3 py-1 text-xs text-black shadow">ETA: 15 mins (4.2 km)</div>
      </div>

      {/* Items card */}
      <div className="mt-4 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <p className="text-base font-semibold text-black">Order Items</p>
        <div className="mt-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-black">2 Shirts</p>
            <p className="text-black">Rs25.00 each</p>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-black">1 Bedsheet</p>
            <p className="text-black">Rs25.00</p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-blue-600">Total Price: $75.00</p>
      </div>

      {/* CTA */}
      <div className="mx-4">
        <Link href={`/delivery/${id}/start`} className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">
          Start Delivery
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { id: "56789" },
  ];
}