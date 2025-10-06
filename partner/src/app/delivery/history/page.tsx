import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";

export default function DeliveryHistory() {
  const history = [
    { id: "65432", customer: "John Doe", address: "123 Main Street, City", when: "Delivered on: 15 Sep, 5:20 PM" },
    { id: "65433", customer: "Jane Smith", address: "456 Elm Street, City", when: "Delivered on: 14 Sep, 3:10 PM" },
    { id: "65434", customer: "Mark Johnson", address: "789 Pine Street, City", when: "Delivered on: 13 Sep, 4:30 PM" },
  ];
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/delivery/pick" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivery History</h2>
          <span className="text-blue-600">🔽</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-3">
        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by Order ID or Customer"
        />
        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-lg bg-blue-600 text-white px-3 py-1 text-xs font-semibold">This Week</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">Last Week</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">This Month</button>
          <button className="rounded-lg bg-gray-200 text-black px-3 py-1 text-xs font-semibold">Custom</button>
        </div>
      </div>

      {/* History cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {history.map((h) => (
          <div key={h.id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-black">Order #{h.id}</p>
                <p className="text-xs text-gray-600 mt-2">{h.customer}, <span className="text-black">{h.address}</span></p>
                <p className="text-xs text-gray-600 mt-2">{h.when}</p>
              </div>
              <span className="rounded-full bg-green-500 text-white px-3 py-1 text-xs font-semibold">Delivered</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="mt-6 px-4 text-center">
        <Image src="/Delivery.svg" alt="Delivery" width={220} height={160} className="mx-auto" />
        <p className="mt-2 text-base font-semibold">No delivery history yet.</p>
        <p className="text-xs text-black">Completed orders will appear here.</p>
      </div>

      <BottomNav />
    </div>
  );
}