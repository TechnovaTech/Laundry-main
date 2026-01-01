'use client'

import { usePartnerOrderMonitor } from '@/hooks/usePartnerOrderMonitor';

export default function OrderMonitor() {
  usePartnerOrderMonitor();
  return null;
}