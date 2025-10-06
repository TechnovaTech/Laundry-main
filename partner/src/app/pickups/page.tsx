import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

const pickups = [
  { id: "12345", name: "Alice Johnson", address: "123 Elm Street, Springfield", time: "Pickup between 9–11 AM" },
  { id: "12346", name: "Bob Smith", address: "456 Oak Avenue, Springfield", time: "Pickup between 10–12 PM" },
  { id: "12347", name: "Charlie Davis", address: "789 Pine Street, Springfield", time: "Pickup between 2–4 PM" },
];

export default function Pickups() {
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
      <div className="mt-3 mx-4 relative rounded-xl overflow-hidden">
        <Image src="/map-temp.svg" alt="Temp Location Map" width={800} height={260} className="w-full h-40 object-cover" />
        {/* Floating card */}
        <div className="absolute left-4 top-4 bg-white shadow-sm rounded-xl px-4 py-2 text-sm font-medium">
          3 pickups assigned today
        </div>
        {/* Pins */}
        <span className="absolute left-6 bottom-6 text-blue-600">📍</span>
        <span className="absolute right-10 top-10 text-orange-500">📍</span>
        <span className="absolute right-6 bottom-8 text-blue-600">📍</span>

        {/* Location chip removed to match screenshot */}
      </div>

      {/* Pickup cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {pickups.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-black">{p.name}</p>
                <p className="text-xs text-black mt-1">{p.address}</p>
                <p className="text-[11px] mt-1 text-black">{p.time}</p>
              </div>
              <span className="text-xs text-gray-500">Order #{p.id}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">
                <span>📞</span>
                Call
              </button>
              <Link href={`/pickups/start/${p.id}`} className="inline-flex justify-center items-center bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold">
                Start Pickup
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="mt-6 px-4 text-center">
        <Image src="/scooter.svg" alt="Scooter" width={180} height={130} className="mx-auto" />
        <p className="mt-2 text-base font-semibold">No pickups assigned yet.</p>
        <p className="text-xs text-black">Orders will appear here once assigned.</p>
      </div>

      <BottomNav />
    </div>
  );
}