import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Shirt, MapPin, CheckCircle2, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const [pickupType, setPickupType] = useState<"now" | "later">("now");
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showSlotError, setShowSlotError] = useState(false);
  
  useEffect(() => {
    fetchPricingItems();
    fetchTimeSlots();
  }, []);
  
  const fetchPricingItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pricing');
      const data = await response.json();
      if (data.success) {
        setPricingItems(data.data);
        // Initialize quantities
        const initialQuantities: {[key: string]: number} = {};
        data.data.forEach((item: PricingItem) => {
          initialQuantities[item._id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Failed to fetch pricing items:', error);
    }
  };
  
  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/time-slots');
      const data = await response.json();
      if (data.success) {
        setTimeSlots(data.data);
        // Set first available slot as default
        const availableSlots = getAvailableSlots(data.data);
        if (availableSlots.length > 0) {
          setSelectedSlot(availableSlots[0].time);
        }
      }
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    }
  };
  
  const isSlotPassed = (slotTime: string) => {
    if (pickupType === 'later') return false; // Tomorrow slots are always available
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Extract end time from slot (e.g., "7-8 AM" -> 8, "2-4 PM" -> 16)
    const timeMatch = slotTime.match(/(\d+)-(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return false;
    
    const endHour = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    
    let slotEndHour = endHour;
    if (period === 'PM' && endHour !== 12) {
      slotEndHour = endHour + 12;
    } else if (period === 'AM' && endHour === 12) {
      slotEndHour = 0;
    }
    
    return currentHour >= slotEndHour;
  };
  
  const getAvailableSlots = (slots: any[]) => {
    return slots.filter(slot => !isSlotPassed(slot.time));
  };
  
  const handleSlotSelection = (slotTime: string) => {
    if (isSlotPassed(slotTime)) {
      setShowSlotError(true);
      setTimeout(() => setShowSlotError(false), 3000);
      return;
    }
    setSelectedSlot(slotTime);
  };

  const updateQuantity = (itemId: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + (increment ? 1 : -1))
    }));
  };
  
  const calculateTotal = () => {
    return pricingItems.reduce((total, item) => {
      return total + (item.price * (quantities[item._id] || 1));
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black flex-1 text-center mx-4 truncate">Book Your Order</h1>
        <button className="flex-shrink-0">
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Clothes Quantity</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-3 sm:space-y-4">
            {pricingItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black text-sm sm:text-base">
                      {item.name} <span className="text-blue-500">₹{item.price}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item._id, false)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold touch-manipulation"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-6 sm:w-8 text-center font-semibold text-black text-sm sm:text-base">
                    {quantities[item._id] || 1}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold touch-manipulation"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Select Pickup</h2>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => setPickupType("now")}
              className={`flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base ${
                pickupType === "now" 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-white border border-gray-300 text-blue-500 hover:bg-gray-50"
              }`}
            >
              Pickup Now
            </Button>
            <Button
              onClick={() => setPickupType("later")}
              className={`flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base ${
                pickupType === "later" 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-white border border-gray-300 text-blue-500 hover:bg-gray-50"
              }`}
            >
              Pickup Later
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Schedule Pickup & Delivery</h2>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button className="h-10 sm:h-12 rounded-2xl font-semibold whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-3 sm:px-4 flex-shrink-0">
              {pickupType === "now" ? "Today" : "Tomorrow"}
            </Button>
            {timeSlots.map((slot) => (
              <Button 
                key={slot._id}
                onClick={() => handleSlotSelection(slot.time)}
                className={`h-10 sm:h-12 rounded-2xl font-semibold whitespace-nowrap text-sm sm:text-base px-3 sm:px-4 flex-shrink-0 ${
                  isSlotPassed(slot.time) && pickupType === 'now'
                    ? 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed'
                    : selectedSlot === slot.time 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
                }`}
              >
                {slot.time}
              </Button>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-blue-500 mt-2 sm:mt-3">
            Next available slot: {pickupType === "now" ? "Today" : "Tomorrow"}, {selectedSlot || 'No slots available'}
          </p>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Pickup & Delivery Address</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-black text-sm sm:text-base">123 Main Street,</p>
                  <p className="font-semibold text-black text-sm sm:text-base">Springfield</p>
                </div>
              </div>
              <button className="text-blue-500 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                Change / Add Address
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-black">Order Summary</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-black">
              Items: {pricingItems.map(item => `${quantities[item._id] || 1} ${item.name}`).join(', ')}
            </p>
            <p className="text-xs sm:text-sm text-black">Service: Steam Iron</p>
            <div className="border-t pt-2 sm:pt-3">
              <p className="text-base sm:text-lg font-bold text-blue-500">Estimated Total: ₹{calculateTotal()}</p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Payment will be collected upon delivery</p>
            </div>
          </div>
        </div>

        {showSlotError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 animate-pulse">
            <p className="text-red-700 text-sm sm:text-base font-medium text-center">
              ⏰ This time slot has passed. Please select another slot.
            </p>
          </div>
        )}
        
        <Button
          onClick={() => navigate("/continue-booking")}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Confirm Order
        </Button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-lg">
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

export default Booking;
