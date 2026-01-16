import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const useSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      if (Capacitor.isNativePlatform()) {
        const computedStyle = getComputedStyle(document.documentElement);
        
        const top = parseInt(computedStyle.getPropertyValue('--safe-area-inset-top').replace('px', '')) || 0;
        const left = parseInt(computedStyle.getPropertyValue('--safe-area-inset-left').replace('px', '')) || 0;
        const right = parseInt(computedStyle.getPropertyValue('--safe-area-inset-right').replace('px', '')) || 0;
        const bottom = parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom').replace('px', '')) || 0;

        setSafeAreaInsets({
          top,
          bottom: Math.max(bottom, 100),
          left,
          right
        });
      } else {
        setSafeAreaInsets({
          top: 0,
          bottom: 8,
          left: 0,
          right: 0
        });
      }
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    const timeouts = [100, 500, 1000, 2000].map(delay => 
      setTimeout(updateSafeArea, delay)
    );

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return safeAreaInsets;
};