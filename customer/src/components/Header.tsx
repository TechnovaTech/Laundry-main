import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  backTo?: string;
  rightAction?: React.ReactNode;
  variant?: 'gradient' | 'white';
  className?: string;
}

const Header = ({ 
  title, 
  onBack, 
  backTo = '/home', 
  rightAction, 
  variant = 'white',
  className = ''
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  const baseClasses = variant === 'gradient' 
    ? 'text-white shadow-xl'
    : 'bg-white shadow-sm';

  const gradientStyle = variant === 'gradient' 
    ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' }
    : {};

  return (
    <header className={`${baseClasses} ${className}`} style={gradientStyle}>
      <div className="app-header-single">
        <button 
          onClick={handleBack} 
          className="header-back-btn" 
          aria-label="Go back"
        >
          <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${variant === 'gradient' ? 'text-white' : 'text-gray-600'}`} />
        </button>
        <h1 className={`header-title ${variant === 'gradient' ? 'text-white' : 'text-black'}`}>
          {title}
        </h1>
        <div className="header-action">
          {rightAction}
        </div>
      </div>
    </header>
  );
};

export default Header;