import Link from "next/link";
import Image from "next/image";

export default function DeliveredToHub() {
  const delivered = [
    { id: "#12345", customer: "John Doe", items: "3 shirts, 1 bedsheet", when: "Delivered on: 16 Sep, 3:15 PM" },
    { id: "#12346", customer: "Jane Smith", items: "2 dresses, 1 towel", when: "Delivered on: 15 Sep, 2:00 PM" },
    { id: "#12347", customer: "Alex Brown", items: "1 coat, 2 trousers", when: "Delivered on: 14 Sep, 4:00 PM" },
  ];
  return (
    <div className="pb-10">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/hub/drop" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Delivered to Hub</h2>
          <span className="text-blue-600">🔽</span>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Order ID / Customer"
          />
          <button className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center text-blue-600">🔽</button>
        </div>
      </div>

      {/* Delivered cards */}
      <div className="mt-4 px-4 flex flex-col gap-4">
        {delivered.map((d) => (
          <div key={d.id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-semibold text-black">{d.id}</p>
                <p className="text-sm text-gray-700 mt-2">{d.customer}, <span className="text-black">{d.items}</span></p>
                <p className="text-sm text-blue-600 mt-2">{d.when}</p>
              </div>
              <span className="rounded-full bg-green-500 text-white px-3 py-1 text-xs font-semibold">Delivered</span>
            </div>
          </div>
        ))}
      </div>

      {/* Illustration and empty state */}
      <div className="mt-6 px-4 text-center">
        <Image src="/Delivery.svg" alt="Hub Building" width={260} height={180} className="mx-auto" />
        <p className="mt-2 text-base font-semibold">No delivered to hub orders yet.</p>
        <p className="text-xs text-black">Once you hand over pickups to hub, they’ll appear here.</p>
      </div>
    </div>
  );
}