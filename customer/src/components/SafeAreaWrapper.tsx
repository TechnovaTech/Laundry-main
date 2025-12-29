import { ReactNode } from 'react';
import { useKeyboard } from '../hooks/use-keyboard';
import { useSafeArea } from '../hooks/use-safe-area';

interface SafeAreaWrapperProps {
  children: ReactNode;
}

const SafeAreaWrapper = ({ children }: SafeAreaWrapperProps) => {
  const { isKeyboardOpen } = useKeyboard();
  const safeAreaInsets = useSafeArea();

  return (
    <div 
      className={`app-safe-wrapper ${isKeyboardOpen ? 'keyboard-open' : ''}`}
      style={{
        paddingTop: `${safeAreaInsets.top}px`,
        paddingBottom: `${safeAreaInsets.bottom}px`,
        paddingLeft: `${safeAreaInsets.left}px`,
        paddingRight: `${safeAreaInsets.right}px`,
      }}
    >
      {children}
    </div>
  );
};

export default SafeAreaWrapper;