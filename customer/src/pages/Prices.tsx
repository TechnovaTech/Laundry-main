import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Shirt, Bed, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import group11Image from "@/assets/Group (11).png";

const Prices = () => {
  const navigate = useNavigate();

  const serviceItems = [
    { icon: Shirt, name: "Shirt", description: "Cotton casual wear" },
    { icon: Shirt, name: "Trousers", description: "Formal wear" },
    { icon: Bed, name: "Bedsheet", description: "King size" },
    { icon: Shirt, name: "Jacket", description: "Winter wear" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="bg-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black flex-1 text-center mx-4">Prices</h1>
        <button className="flex-shrink-0">
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {serviceItems.map((item) => (
            <div key={item.name} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
              <item.icon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mb-2 sm:mb-3" />
              <h3 className="font-bold text-sm sm:text-lg mb-1 text-black">{item.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Men's Wear</h2>
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-lg">
          <img 
            src={group11Image}
            alt="Pricing" 
            className="w-32 h-24 sm:w-48 sm:h-32 mb-3 sm:mb-4 object-contain"
          />
          <p className="text-center text-xs sm:text-sm text-gray-600 mb-1">
            Pricing will be updated soon. Please check back later.
          </p>
          <p className="text-center text-xs text-gray-500">
            *All services include steam ironing as standard.
          </p>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-blue-500 p-1">
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

export default Prices;
