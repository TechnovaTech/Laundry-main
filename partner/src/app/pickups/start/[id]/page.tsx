import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const orders = {
  "12345": {
    name: "John Smith",
    phone: "+1 234 567 8901",
    addr: "1234 Elm Street, Apt 567",
    eta: "12 mins",
    distance: "2.5 km",
    price: "$45.00",
    items: 3,
    orderId: "#123456789",
    instructions: "Leave at the front door.",
  },
  "12346": {
    name: "Bob Smith",
    phone: "+1 111 222 3333",
    addr: "456 Oak Avenue",
    eta: "10 mins",
    distance: "1.9 km",
    price: "$30.00",
    items: 2,
    orderId: "#12346",
    instructions: "Call on arrival.",
  },
  "12347": {
    name: "Charlie Davis",
    phone: "+1 999 888 7777",
    addr: "789 Pine Street",
    eta: "15 mins",
    distance: "3.4 km",
    price: "$60.00",
    items: 4,
    orderId: "#12347",
    instructions: "Ring the doorbell twice.",
  },
} as const;

export default function StartPickup({ params }: any) {
  const order = orders[params.id as keyof typeof orders];
  if (!order) return notFound();
  return (
    <div className="pb-6">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/pickups" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Pickup in Progress</h2>
          <span className="w-6" />
        </div>
      </header>

      {/* Map with overlay */}
      <div className="mt-3 mx-4 relative rounded-xl overflow-hidden">
        <Image src="/map-temp.svg" alt="Route Map" width={800} height={260} className="w-full h-48 object-cover" />
        <div className="absolute left-4 bottom-4 bg-white shadow-sm rounded-xl px-4 py-2">
          <p className="text-sm font-semibold text-black">{order.eta} ({order.distance})</p>
          <p className="text-xs text-blue-600">Open in Google Maps</p>
        </div>
      </div>

      {/* Customer card */}
      <div className="mt-4 mx-4 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
        <p className="text-base font-semibold text-black">{order.name}</p>
        <p className="text-xs text-black mt-1">{order.phone}</p>
        <p className="text-xs text-black mt-1">📍 {order.addr}</p>
        <div className="mt-3 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">
            <span>📞</span>
            Call Customer
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-400 text-blue-600 px-4 py-2 text-sm font-semibold">
            <span>💬</span>
            Message
          </button>
        </div>
      </div>

      {/* Order Details */}
      <div className="mt-4 mx-4 rounded-xl border-2 border-blue-500 bg-white p-4">
        <p className="text-base font-semibold text-black">Order Details</p>
        <div className="mt-2 text-sm text-black">
          <p>Order ID: {order.orderId}</p>
          <p>Items: {order.items}</p>
          <p>Total Price: {order.price}</p>
          <p>Delivery Instructions: {order.instructions}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-4">
        <Link href={`/pickups/confirm/${params.id}`} className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">
          Reached Location
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