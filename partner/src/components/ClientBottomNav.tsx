"use client";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function ClientBottomNav() {
  const pathname = usePathname();
  // Hide bottom nav on splash/preloading screen
  if (pathname === "/") return null;
  return <BottomNav />;
}