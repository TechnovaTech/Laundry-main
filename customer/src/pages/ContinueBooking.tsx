import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Shirt, CheckCircle2, MapPin, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ContinueBooking = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center mx-4">Final Step</h1>
        <button className="flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-black text-sm sm:text-base">Order #12345</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">3 Shirts, 1 Bedsheet</p>
                <p className="text-base sm:text-lg font-bold text-blue-500">₹120</p>
              </div>
            </div>
            <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0">
              In Progress
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" fill="currentColor" />
            <span className="font-semibold text-blue-500 text-sm sm:text-base">Scheduled</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0" fill="currentColor" />
            <span className="text-black text-sm sm:text-base">Picked Up at 10:20 AM</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0" />
            <span className="text-black text-sm sm:text-base">Ironing</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0" />
            <span className="text-black text-sm sm:text-base">Out for Delivery</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 flex-shrink-0" />
            <span className="text-black text-sm sm:text-base">Delivered</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg relative overflow-hidden">
          <div className="mb-3 sm:mb-4 h-32 sm:h-48 bg-green-100 rounded-xl flex items-center justify-center relative">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm font-semibold text-blue-500">Arriving in 25 min</p>
            </div>
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-12 h-16 sm:w-16 sm:h-20 bg-white rounded-lg shadow-lg p-1.5 sm:p-2">
              <div className="w-full h-6 sm:h-8 bg-blue-100 rounded flex items-center justify-center mb-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1 bg-green-500 rounded"></div>
                <div className="h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold bg-white border border-gray-300 text-black hover:bg-gray-50 text-xs sm:text-sm">
              Contact Partner
            </Button>
            <Button className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold bg-white border border-red-300 text-red-500 hover:bg-red-50 text-xs sm:text-sm">
              Report Issue
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Past Orders</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2 gap-3">
              <p className="font-bold text-black text-sm sm:text-base">Order #12219</p>
              <span className="px-2 sm:px-4 py-1 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0">
                Delivered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-2">2 Shirts, 1 Saree</p>
            <button className="text-blue-500 font-semibold text-xs sm:text-sm">View Details</button>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Additional Information</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-2 text-xs sm:text-sm text-gray-600">
            <p>Delivery Address: 123 Main Street, Cityville</p>
            <p>Contact Number: +123 456 7890</p>
            <p>Payment Method: Credit Card</p>
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Coupon Code</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg space-y-3 sm:space-y-4">
            <div className="flex gap-2 sm:gap-3">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 h-10 sm:h-12 rounded-2xl border-2 bg-white text-sm sm:text-base"
              />
              <Button className="h-10 sm:h-12 rounded-2xl px-4 sm:px-8 font-semibold bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm">Apply</Button>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total (Included GST):</span>
                <span className="text-black">₹120</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount Added:</span>
                <span>₹20</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold text-black">
                <span>Grand Total:</span>
                <span>₹100</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/booking-confirmation")}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ContinueBooking;
