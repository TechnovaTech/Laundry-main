import { ReactNode, useEffect } from 'react';
import { useKeyboard } from '../hooks/use-keyboard';
import { useSafeArea } from '../hooks/use-safe-area';

interface SafeAreaWrapperProps {
  children: ReactNode;
}

const SafeAreaWrapper = ({ children }: SafeAreaWrapperProps) => {
  const { isKeyboardOpen } = useKeyboard();
  const safeAreaInsets = useSafeArea();

  // Set CSS custom property for dynamic bottom padding
  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-bottom-padding', `${safeAreaInsets.bottom}px`);
  }, [safeAreaInsets.bottom]);

  return (
    <div 
      className={`app-safe-wrapper ${isKeyboardOpen ? 'keyboard-open' : ''}`}
      style={{
        paddingTop: `${safeAreaInsets.top}px`,
        paddingLeft: `${safeAreaInsets.left}px`,
        paddingRight: `${safeAreaInsets.right}px`,
        // No bottom padding here - handled by individual components
      }}
    >
      {children}
    </div>
  );
};

export default SafeAreaWrapper;