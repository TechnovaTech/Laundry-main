import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import group10Image from "@/assets/Group (10).png";

const Home = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('Sagnik');
  const [currentVoucher, setCurrentVoucher] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }

    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('userName');
      if (updatedName) {
        setUserName(updatedName);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userNameChanged', handleStorageChange);

    fetchVouchers();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userNameChanged', handleStorageChange);
    };
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/vouchers');
      const data = await response.json();
      if (data.success) {
        setVouchers(data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };
  
  // Auto-scroll vouchers only if not manually controlled
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentVoucher(prev => (prev + 1) % vouchers.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [vouchers.length, isAutoScrolling]);
  
  // Scroll to current voucher only during auto-scroll
  useEffect(() => {
    if (scrollRef.current && isAutoScrolling) {
      const scrollWidth = scrollRef.current.scrollWidth / vouchers.length;
      scrollRef.current.scrollTo({
        left: currentVoucher * scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [currentVoucher, vouchers.length, isAutoScrolling]);
  
  // Handle manual scroll
  const handleScroll = () => {
    if (!scrollRef.current || isAutoScrolling) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.scrollWidth / vouchers.length;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== currentVoucher) {
      setCurrentVoucher(newIndex);
    }
  };
  
  // Detect manual interaction
  const handleTouchStart = () => {
    setIsAutoScrolling(false);
  };
  
  // Resume auto-scroll after 5 seconds of no interaction
  useEffect(() => {
    if (!isAutoScrolling) {
      const timeout = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isAutoScrolling]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      {/* Blue Header Section */}
      <div className="bg-blue-500 text-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hi, {userName}</h1>
            <p className="text-white/90 text-sm sm:text-base">Let's schedule your order</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex-shrink-0"></div>
        </div>
      </div>

      {/* White Content Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Service Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 text-black mb-4 sm:mb-6 shadow-lg">
          <div className="flex-shrink-0">
            <img 
              src={group10Image}
              alt="Service Features" 
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="text-blue-500">
                <span className="text-sm sm:text-base font-medium">Fast pickup</span>
              </div>
              <div className="text-blue-500">
                <span className="text-sm sm:text-base font-medium">24h delivery</span>
              </div>
              <div className="text-blue-500">
                <span className="text-sm sm:text-base font-medium">Satisfaction guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Order Button */}
        <Button
          onClick={() => navigate("/booking")}
          className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm sm:text-base font-semibold mb-4 sm:mb-6 shadow-lg"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Book Your Order
        </Button>

        {/* Next Slot Info */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg">
          <p className="text-gray-600 text-xs sm:text-sm mb-1">Next available slot:</p>
          <p className="text-black font-semibold mb-2 text-sm sm:text-base">Tomorrow, 9-11 AM</p>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 break-words">Address preview: 123 Main Street, Newtown , Kolkata, India</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-black text-xl sm:text-2xl font-bold w-8 sm:w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Offer Cards - Horizontal Scroll */}
        <div className="mb-4 sm:mb-6">
          <div 
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onMouseDown={handleTouchStart}
          >
            {vouchers.map((voucher: any, index) => (
              <div key={voucher._id} className="bg-blue-200 rounded-2xl p-4 shadow-lg flex-shrink-0 w-72 snap-center">
                <div className="flex flex-col">
                  <h3 className="font-bold text-base mb-1 text-blue-800">{voucher.slogan}</h3>
                  <p className="text-blue-600 text-sm mb-2">Limited time offer</p>
                  <Button className="w-20 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {vouchers.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentVoucher ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-blue-500 text-sm sm:text-base">Order #12345</span>
              <Button
                onClick={() => navigate("/order-details")}
                className="h-8 sm:h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Reorder
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-blue-500 text-sm sm:text-base">Order #12346</span>
              <Button
                onClick={() => navigate("/order-details")}
                className="h-8 sm:h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Reorder
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-blue-500 text-sm sm:text-base">Order #12347</span>
              <Button
                onClick={() => navigate("/order-details")}
                className="h-8 sm:h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Reorder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-blue-500 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white shadow-lg">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default Home;