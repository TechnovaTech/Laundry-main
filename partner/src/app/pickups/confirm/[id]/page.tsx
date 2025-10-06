import Link from "next/link";

export default function PickupConfirm({ params }: any) {
  return (
    <div className="pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={`/pickups/start/${params.id}`} className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Confirm</h2>
          <span className="w-6" />
        </div>
      </header>

      {/* Order summary card */}
      <div className="mt-3 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-black">Order ID: #{params.id}</p>
            <p className="mt-2 text-sm text-black">Customer: Sarah Johnson</p>
            <p className="text-sm text-black">Phone: (123) 456-7890</p>
            <p className="mt-2 text-sm text-black">📍 123 Main St, Springfield</p>
            <button className="mt-3 inline-flex items-center rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">Open in Maps</button>
          </div>
          <span className="rounded-lg border-2 border-blue-400 text-blue-600 px-3 py-1 text-sm font-semibold">Scheduled</span>
        </div>
      </div>

      {/* Upload section */}
      <div className="mt-4 mx-4">
        <p className="text-base font-semibold text-black">Upload Clothes Photos</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center">
              <span className="text-blue-600">📷</span>
            </div>
          ))}
        </div>

        <input
          className="mt-4 w-full rounded-xl border border-gray-300 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add Notes (optional)…"
          type="text"
        />
        <p className="mt-2 text-xs text-gray-500">Example: Customer gave extra bedsheet.</p>
      </div>

      {/* Checkbox and CTA */}
      <div className="mx-4 mt-3">
        <label className="flex items-center gap-2 text-base text-black">
          <input type="checkbox" className="h-4 w-4 accent-blue-600" />
          I have collected all items from customer.
        </label>
        <Link href="/hub/drop" className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">
          Confirm & Proceed
        </Link>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { id: "12345" },
    { id: "12346" },
    { id: "12347" },
  ];
}