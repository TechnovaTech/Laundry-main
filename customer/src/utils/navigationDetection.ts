import { Capacitor } from '@capacitor/core';

export interface NavigationInfo {
  type: 'gesture' | 'buttons' | 'unknown';
  bottomPadding: number;
}

export const detectNavigationType = (): NavigationInfo => {
  if (!Capacitor.isNativePlatform()) {
    return { type: 'unknown', bottomPadding: 4 };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  const safeAreaBottom = parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom').replace('px', '')) || 0;
  
  if (safeAreaBottom === 0) {
    return { type: 'buttons', bottomPadding: 16 };
  } else if (safeAreaBottom > 0 && safeAreaBottom < 20) {
    return { type: 'gesture', bottomPadding: Math.max(safeAreaBottom, 8) };
  } else {
    return { type: 'gesture', bottomPadding: safeAreaBottom };
  }
};

export const detectNavigationByViewport = (): NavigationInfo => {
  if (!Capacitor.isNativePlatform()) {
    return { type: 'unknown', bottomPadding: 4 };
  }

  const vh = window.innerHeight;
  const dvh = window.screen.height;
  const heightDiff = dvh - vh;
  
  if (heightDiff > 40) {
    return { type: 'buttons', bottomPadding: 16 };
  } else {
    return { type: 'gesture', bottomPadding: 8 };
  }
};

export const getOptimalBottomPadding = (): number => {
  if (!Capacitor.isNativePlatform()) {
    return 0;
  }
  
  const computedStyle = getComputedStyle(document.documentElement);
  const safeAreaBottom = parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom').replace('px', '')) || 0;
  
  // Universal approach: use safe area if available, otherwise minimal padding
  return Math.max(safeAreaBottom, 12);
};