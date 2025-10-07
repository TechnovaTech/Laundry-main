import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

const AddAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editAddress = location.state?.editAddress;
  const isEditMode = !!editAddress;
  
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isPrimary: false
  });
  const [showServiceMessage, setShowServiceMessage] = useState(false);

  useEffect(() => {
    if (editAddress) {
      // Parse the existing address data for editing
      const [city, statePin] = editAddress.subtitle.split(", ");
      const [state, pincode] = statePin.split(" - ");
      
      setAddress({
        addressLine1: editAddress.title,
        addressLine2: "",
        city: city,
        state: state,
        pincode: pincode,
        isPrimary: editAddress.isDefault || false
      });
    }
  }, [editAddress]);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const states = indianStates;
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowCitySuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStateChange = (selectedState) => {
    setAddress({...address, state: selectedState, city: "", pincode: ""});
    setCitySuggestions([]);
  };

  const handleCityChange = (value) => {
    setAddress({...address, city: value});
    setShowCitySuggestions(false);
  };

  const handlePincodeChange = async (value) => {
    setAddress({...address, pincode: value});
    setShowServiceMessage(false);
    
    if (value.length === 6) {
      try {
        const response = await fetch(`http://localhost:3000/api/locations/pincodes?pincode=${value}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setAddress(prev => ({
            ...prev,
            city: data[0].city || '',
            state: data[0].state || ''
          }));
        }
        
        // Check serviceability for display only
        const serviceableResponse = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${value}`);
        const serviceableData = await serviceableResponse.json();
        
        if (!serviceableData.serviceable) {
          setShowServiceMessage(true);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (address.addressLine1.trim() && address.city.trim() && address.state && address.pincode.trim()) {
      try {
        // Check serviceability but don't block saving
        try {
          const serviceableResponse = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${address.pincode}`)
          const serviceableData = await serviceableResponse.json()
          
          if (!serviceableData.serviceable) {
            setShowServiceMessage(true)
          }
        } catch (error) {
          console.log('Service check failed, continuing with save')
        }
        
        // Save address to customer database
        const customerId = localStorage.getItem('customerId');
        if (customerId) {
          const saveResponse = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: [{
                street: address.addressLine1 + (address.addressLine2 ? ', ' + address.addressLine2 : ''),
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                isDefault: address.isPrimary
              }]
            })
          });
          
          const saveResult = await saveResponse.json();
          if (!saveResult.success) {
            console.error('Failed to save address:', saveResult.error);
            alert('Failed to save address');
            return;
          }
        }
        
        const addressData = {
          title: address.addressLine1,
          subtitle: `${address.city}, ${address.state} - ${address.pincode}`,
          isDefault: address.isPrimary
        };
        
        if (isEditMode) {
          navigate("/profile", { state: { editedAddress: { ...addressData, id: editAddress.id } } });
        } else {
          navigate("/profile", { state: { newAddress: addressData } });
        }
      } catch (error) {
        console.error('Error checking serviceable area:', error)
        alert('Failed to verify service area')
      }
    }
  };

  const isFormValid = address.addressLine1.trim() && address.city.trim() && address.state && address.pincode.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 sm:px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate("/profile")} className="text-gray-600 flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black flex-1 text-center">{isEditMode ? 'Edit Address' : 'Add Address'}</h1>
        <div className="w-5 sm:w-6"></div>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 pb-24">
        <div className="relative">
          <input
            type="text"
            placeholder="Address Line 1"
            value={address.addressLine1}
            onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            value={address.addressLine2}
            onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
          />

        </div>

        <div className="relative">
          <select
            value={address.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black appearance-none bg-white text-sm sm:text-base min-h-[48px] sm:min-h-[56px]"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: 'none',
              fontSize: window.innerWidth < 640 ? '16px' : '14px',
              lineHeight: '1.5',
              paddingRight: '40px'
            }}
          >
            <option value="" className="text-gray-400">Select State</option>
            {states.map((state) => (
              <option key={state} value={state} style={{ fontSize: '16px', padding: '8px' }}>{state}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
            maxLength={6}
          />
        </div>
        
        {showServiceMessage && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 sm:p-4 text-center">
            <p className="text-orange-700 text-sm sm:text-base font-medium mb-1">
              🚀 Coming Soon to Your Area!
            </p>
            <p className="text-orange-600 text-xs sm:text-sm">
              We're not here yet to provide service, but we'll save your address for future updates.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 py-3 sm:py-4">
          <button
            onClick={() => setAddress({...address, isPrimary: !address.isPrimary})}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              address.isPrimary ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            }`}
          >
            {address.isPrimary && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />}
          </button>
          <span className="text-black font-medium text-sm sm:text-base">Set as Primary Address</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:p-6 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full py-3 sm:py-4 rounded-full font-semibold text-white text-sm sm:text-base ${
            isFormValid ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
          } transition-colors duration-200`}
        >
          {isEditMode ? 'Update Address' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
};

export default AddAddress;