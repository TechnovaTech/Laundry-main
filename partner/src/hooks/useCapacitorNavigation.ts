'use client'

import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

export const useCapacitorNavigation = () => {
  const router = useRouter();

  const navigateTo = (path: string, replace = false) => {
    if (Capacitor.isNativePlatform()) {
      // For Capacitor, prevent app refresh by using history API
      if (replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
      
      // Trigger Next.js router after state change
      setTimeout(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      }, 50);
    } else {
      // For web, use normal router
      if (replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    }
  };

  return { navigateTo };
};