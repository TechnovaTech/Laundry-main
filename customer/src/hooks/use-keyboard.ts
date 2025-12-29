import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(info.keyboardHeight);
      
      // Prevent page jumping by maintaining viewport
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
      
      // Focus management
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          const rect = activeElement.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Only scroll if input is in bottom half and might be covered
          if (rect.bottom > viewportHeight * 0.6) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });
          }
        }
      }, 100);
    });

    const hideListener = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
      
      // Restore normal scrolling
      document.body.style.height = '';
      document.body.style.overflow = '';
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};