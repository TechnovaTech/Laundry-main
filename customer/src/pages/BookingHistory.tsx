import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shirt, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import group12Image from "@/assets/Group (12).png";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scheduled");

  const orders = [
    {
      id: "12345",
      items: "3 Shirts, 2 Trousers",
      date: "12 Sep, 2025 - 10:20 AM",
      price: "₹200",
      status: "Delivered",
    },
    {
      id: "12346",
      items: "2 Towels, 1 Jacket",
      date: "Pickup Today, 5-7 PM",
      price: "₹150",
      status: "In Progress",
    },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === "scheduled") return true;
    if (activeTab === "in progress") return order.status === "In Progress";
    if (activeTab === "delivered") return order.status === "Delivered";
    if (activeTab === "cancelled") return order.status === "Cancelled";
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-24">
      <header className="sticky top-0 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center z-10">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold ml-3 sm:ml-4">Booking History</h1>
      </header>

      <div className="px-4 sm:px-6 py-4">
        <div className="overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
          <div className="flex gap-2 sm:gap-3 pl-1 pr-4">
            {["Scheduled", "In Progress", "Delivered", "Cancelled"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`h-8 sm:h-10 rounded-2xl font-semibold whitespace-nowrap flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm ${
                  activeTab === tab.toLowerCase()
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {filteredOrders.map((order) => (
            <Card key={order.id} className="p-3 sm:p-4 rounded-2xl border-2">
              <div className="flex items-start justify-between mb-2 sm:mb-3 gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm sm:text-base">Order #{order.id}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{order.items}</p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                    order.status === "Delivered"
                      ? "bg-primary text-white"
                      : "bg-blue-100 text-primary"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{order.date}</p>
                <p className="text-base sm:text-lg font-bold text-primary">{order.price}</p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/order-details", { state: { order } })}
                  className="text-primary font-semibold text-xs sm:text-sm"
                >
                  View Order
                </button>
                <button
                  onClick={() => navigate("/booking")}
                  className="text-primary font-semibold text-xs sm:text-sm"
                >
                  Reorder
                </button>
                <button className="text-primary font-semibold text-xs sm:text-sm">Rate Service</button>
              </div>
            </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 sm:py-12">
          <img 
            src={group12Image}
            alt="No Orders" 
            className="w-32 h-32 sm:w-48 sm:h-48 mb-4 sm:mb-6 object-contain"
          />
          <h3 className="text-lg sm:text-xl font-bold mb-2">No orders yet.</h3>
          <p className="text-muted-foreground text-center mb-4 sm:mb-6 text-sm sm:text-base px-4">
            Tap 'Book Now' to place your first order.
          </p>
          <Button
            onClick={() => navigate("/booking")}
            className="h-10 sm:h-12 rounded-2xl px-6 sm:px-8 font-semibold text-sm sm:text-base"
          >
            Book Now
          </Button>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
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
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-blue-500 p-1">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default BookingHistory;
