"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function Icon({ src, active, showCheck }: { src: string; active: boolean; showCheck?: boolean }) {
  if (src === "profile") {
    return (
      <div className="relative">
        <svg className={`h-6 w-6 ${active ? "text-blue-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    );
  }
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
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => {
    const partner = localStorage.getItem("partner");
    if (partner) {
      const data = JSON.parse(partner);
      setKycApproved(data.kycStatus === "approved");
    }
  }, []);

  // Always show bottom nav
  // if (!kycApproved) {
  //   return null;
  // }

  const isPickup = pathname.startsWith("/pickups");
  const isHub = pathname.startsWith("/hub");
  const isPickForDelivery = pathname.startsWith("/delivery/pick");
  const isDelivery = pathname.startsWith("/delivery") && !isPickForDelivery;

  const isProfile = pathname.startsWith("/profile");

  const items = [
    { href: "/pickups", label: "Pickup", icon: "/PickupIcon.svg", active: isPickup, check: false },
    { href: "/hub/drop", label: "Reached Hub", icon: "/ReachedHubIcon.svg", active: isHub, check: false },
    { href: "/delivery/pick", label: "Pick for Delivery", icon: "/PickforDeliveryIcon.svg", active: isPickForDelivery, check: false },
    { href: "/delivery/history", label: "Delivery", icon: "/DeliveryIcon.svg", active: isDelivery, check: true },
    { href: "/profile", label: "Profile", icon: "profile", active: isProfile, check: false },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200" style={{ paddingBottom: "env(safe-area-inset-bottom)", zIndex: 50 }}>
      <div className="mx-auto max-w-md px-4 py-3">
        <ul className="grid grid-cols-5 items-center gap-1">
          {items.map((it) => (
            <li key={it.href} className="flex flex-col items-center text-center">
              <Link href={it.href} className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl hover:bg-gray-50 transition-colors">
                <Icon src={it.icon} active={it.active} showCheck={it.check} />
                <span className={it.active ? "text-blue-600 font-bold text-[10px]" : "text-gray-500 text-[10px]"}>{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}