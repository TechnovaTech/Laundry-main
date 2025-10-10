import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import homeScreenImage from "@/assets/Home screen.png";

const Home = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('Sagnik');
  const [currentVoucher, setCurrentVoucher] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [customerAddress, setCustomerAddress] = useState('No address added yet');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>([]);
  const [recentOrders, setRecentOrders] = useState([]);

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
    fetchCustomerAddress();
    fetchRecentOrders();

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
  
  const fetchCustomerAddress = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data?.address?.[0]) {
        const address = data.data.address[0];
        const addressText = `${address.street || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}`;
        setCustomerAddress(addressText.replace(/^, |, $/, ''));
      }
    } catch (error) {
      console.error('Error fetching customer address:', error);
    }
  };
  
  const fetchRecentOrders = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`http://localhost:3000/api/orders?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success) {
        // Get only the 3 most recent orders
        setRecentOrders(data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
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

  const handleApplyVoucher = (voucherCode: string) => {
    setSelectedVoucherCode(voucherCode);
    setShowVoucherModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedVoucherCode);
    setIsCopied(true);
    setClaimedVouchers(prev => [...prev, selectedVoucherCode]);
  };

  const closeModal = () => {
    setShowVoucherModal(false);
    setSelectedVoucherCode('');
    setIsCopied(false);
  };

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
              src={homeScreenImage}
              alt="Service Features" 
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain"
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
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 break-words">Address preview: {customerAddress}</p>
          
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
                  <Button 
                    onClick={() => !claimedVouchers.includes(voucher.code) && handleApplyVoucher(voucher.code)}
                    className={`w-20 h-8 rounded-lg text-sm font-semibold ${
                      claimedVouchers.includes(voucher.code)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {claimedVouchers.includes(voucher.code) ? 'Claimed' : 'Apply'}
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

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="space-y-2 sm:space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-blue-500 text-sm sm:text-base">Order #{order.orderId}</span>
                  <Button
                    onClick={() => navigate("/order-details", { state: { orderId: order.orderId } })}
                    className="h-8 sm:h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Reorder
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No recent orders found
              </div>
            )}
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

      {/* Voucher Code Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg font-bold text-black mb-4">Your Voucher Code</h3>
              
              <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-4 mb-4">
                <p className="text-2xl font-bold text-blue-600 tracking-wider mb-2">{selectedVoucherCode}</p>
                <button 
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              
              <div className="text-left space-y-2 mb-6">
                <p className="text-sm text-gray-700">• It is one time use, so please copy it</p>
                <p className="text-sm text-gray-700">• Use it while you order</p>
              </div>
              
              <button 
                onClick={closeModal}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-2xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;