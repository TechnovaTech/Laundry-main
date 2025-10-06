"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ src, active, showCheck }: { src: string; active: boolean; showCheck?: boolean }) {
  return (
    <div className="relative">
      <div
        className={active ? "h-6 w-6 bg-blue-600" : "h-6 w-6 bg-gray-500"}
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      {active && showCheck && (
        <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] leading-4 flex items-center justify-center">✓</span>
      )}
    </div>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  const isPickup = pathname.startsWith("/pickups");
  const isHub = pathname.startsWith("/hub");
  const isPickForDelivery = pathname.startsWith("/delivery/pick");
  const isDelivery = pathname.startsWith("/delivery") && !isPickForDelivery;

  const items = [
    { href: "/pickups", label: "Pickup", icon: "/PickupIcon.svg", active: isPickup, check: false },
    { href: "/hub/drop", label: "Reached Hub", icon: "/ReachedHubIcon.svg", active: isHub, check: false },
    { href: "/delivery/pick", label: "Pick for Delivery", icon: "/PickforDeliveryIcon.svg", active: isPickForDelivery, check: false },
    { href: "/delivery/history", label: "Delivery", icon: "/DeliveryIcon.svg", active: isDelivery, check: true },
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto max-w-md px-6 py-3">
        <ul className="grid grid-cols-4 items-center gap-6">
          {items.map((it) => (
            <li key={it.href} className="flex flex-col items-center text-center">
              <Link href={it.href} className="flex flex-col items-center gap-1">
                <Icon src={it.icon} active={it.active} showCheck={it.check} />
                <span className={it.active ? "text-blue-600 font-semibold text-sm" : "text-gray-500 text-sm"}>{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}