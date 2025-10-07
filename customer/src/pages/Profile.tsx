import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, MapPin, Edit, Trash2, CreditCard, Wallet, Gift, HelpCircle, Mail, Phone as PhoneIcon, Bell, FileText, LogOut, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (location.state?.newAddress) {
      const newAddress = {
        id: Date.now(),
        title: location.state.newAddress.title,
        subtitle: location.state.newAddress.subtitle || "Address",
        isDefault: location.state.newAddress.isDefault || false
      };
      setAddresses(prev => [...prev, newAddress]);
      navigate("/profile", { replace: true });
    } else if (location.state?.editedAddress) {
      const editedAddress = location.state.editedAddress;
      setAddresses(prev => prev.map(addr => 
        addr.id === editedAddress.id 
          ? { ...addr, title: editedAddress.title, subtitle: editedAddress.subtitle, isDefault: editedAddress.isDefault }
          : addr
      ));
      navigate("/profile", { replace: true });
    }
  }, [location.state, navigate]);

  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    phone: "+91 XXXXXXXX",
    email: "example@gmail.com",
    avatar: "L",
    pincode: "Loading...",
    city: "Loading...",
    state: "Loading..."
  });

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  const fetchCustomerProfile = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const customer = data.data;
        setUserProfile({
          name: customer.name || "User",
          phone: customer.mobile || "+91 XXXXXXXX",
          email: customer.email || "Not provided",
          avatar: (customer.name || "User").charAt(0).toUpperCase(),
          pincode: customer.address?.[0]?.pincode || "Not provided",
          city: customer.address?.[0]?.city || "Not provided",
          state: customer.address?.[0]?.state || "Not provided"
        });
        
        // Update addresses from database
        if (customer.address && customer.address.length > 0) {
          const dbAddresses = customer.address.map((addr, index) => ({
            id: index + 1,
            title: addr.street || "Address",
            subtitle: `${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`.replace(/^, |, $/, ''),
            isDefault: addr.isDefault || false
          }));
          setAddresses(dbAddresses);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };



  const paymentOptions = [
    {
      id: 1,
      type: "UPI",
      title: "UPI (Google Pay)",
      icon: "💳"
    },
    {
      id: 2,
      type: "Card",
      title: "Visa ending ••••1234",
      icon: "💳"
    }
  ];

  const walletBalance = "₹5000";

  const supportOptions = [
    { id: 1, title: "FAQ", icon: HelpCircle },
    { id: 2, title: "Mail", icon: Mail },
    { id: 3, title: "Call Support", icon: PhoneIcon }
  ];

  const legalOptions = [
    { id: 1, title: "Privacy Policy" },
    { id: 2, title: "Terms & Conditions" }
  ];

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const handleEditAddress = (addressId) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    navigate("/add-address", { state: { editAddress: addressToEdit } });
  };



  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="bg-gray-50 px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-black">Profile</h1>
        <button>
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold flex-shrink-0">
              {userProfile.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-black truncate">{userProfile.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{userProfile.phone}</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{userProfile.email}</p>
              <p className="text-xs sm:text-sm text-blue-500 truncate">{userProfile.city}, {userProfile.state} - {userProfile.pincode}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/create-profile")}
            className="text-blue-500 font-semibold text-xs sm:text-sm"
          >
            Edit
          </button>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">My Addresses</h2>
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-black text-sm sm:text-base truncate">{address.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-words">{address.subtitle}</p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEditAddress(address.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => navigate("/add-address")}
            className="text-blue-500 font-semibold text-xs sm:text-sm"
          >
            + Add New
          </button>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Payment Options</h2>
          {paymentOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3 flex items-center gap-2 sm:gap-3">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="font-medium text-black text-sm sm:text-base truncate">{option.title}</span>
            </div>
          ))}
          <button className="text-blue-500 font-semibold text-xs sm:text-sm">+ Add Payment</button>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Wallet</h2>
          <button 
            onClick={() => navigate("/wallet")}
            className="w-full bg-white rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors"
          >
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <span className="font-semibold text-black text-sm sm:text-base">Balance: {walletBalance}</span>
          </button>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Refer and Earn</h2>
          <button 
            onClick={() => navigate("/refer-earn")}
            className="w-full bg-white rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <span className="font-medium text-black text-sm sm:text-base">Earn ₹100 for every referral</span>
          </button>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">Support</h2>
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-black text-sm sm:text-base">{option.title}</span>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold mb-3 text-black">App Settings / Legal</h2>
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="font-medium text-black text-sm sm:text-base truncate">Notification</span>
            </div>
            <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} className="flex-shrink-0" />
          </div>
          {legalOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className="font-medium text-black text-sm sm:text-base">{option.title}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full h-10 sm:h-12 rounded-2xl text-red-500 font-semibold hover:bg-red-50 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          Logout
        </button>
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
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-blue-500 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default Profile;