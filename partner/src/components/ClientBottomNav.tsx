"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import { API_URL } from '@/config/api';

export default function ClientBottomNav() {
  const pathname = usePathname();
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (partnerId) {
      fetch(`${API_URL}/api/mobile/partners/${partnerId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setKycApproved(result.data.kycStatus === "approved");
          }
        })
        .catch(err => console.error("Failed to fetch partner:", err));
    }
  }, [pathname]);

  // Hide bottom nav on pre-KYC pages
  const preKycPages = ["/", "/check-availability", "/congrats", "/login", "/verify", "/profile/create", "/profile/kyc"];
  if (preKycPages.includes(pathname) || !kycApproved) return null;

  return <BottomNav />;
}