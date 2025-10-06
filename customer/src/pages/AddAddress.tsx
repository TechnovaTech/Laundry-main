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

  const stateData = {
    "Gujarat": { cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"], pincodes: ["380001", "395001", "390001", "360001", "364001"] },
    "Maharashtra": { cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"], pincodes: ["400001", "411001", "440001", "422001", "431001"] },
    "Karnataka": { cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"], pincodes: ["560001", "570001", "580001", "575001", "590001"] },
    "Tamil Nadu": { cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"], pincodes: ["600001", "641001", "625001", "636001", "620001"] },
    "West Bengal": { cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"], pincodes: ["700001", "711101", "713201", "713301", "734001"] },
    "Rajasthan": { cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"], pincodes: ["302001", "342001", "313001", "324001", "334001"] },
    "Uttar Pradesh": { cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"], pincodes: ["226001", "208001", "201001", "282001", "221001"] },
    "Delhi": { cities: ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi"], pincodes: ["110001", "110008", "110016", "110007", "110092"] }
  };

  const states = Object.keys(stateData);
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
    if (selectedState && stateData[selectedState]) {
      setCitySuggestions(stateData[selectedState].cities);
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCityChange = (value) => {
    setAddress({...address, city: value});
    if (value && address.state && stateData[address.state]) {
      const cityIndex = stateData[address.state].cities.findIndex(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      if (cityIndex !== -1) {
        setAddress(prev => ({...prev, pincode: stateData[address.state].pincodes[cityIndex]}));
      }
    }
    setShowCitySuggestions(value.length > 0 && citySuggestions.some(city => 
      city.toLowerCase().includes(value.toLowerCase())
    ));
  };

  const selectCity = (city) => {
    setAddress({...address, city});
    const cityIndex = stateData[address.state].cities.indexOf(city);
    if (cityIndex !== -1) {
      setAddress(prev => ({...prev, city, pincode: stateData[address.state].pincodes[cityIndex]}));
    }
    setShowCitySuggestions(false);
  };

  const handleSubmit = async () => {
    if (address.addressLine1.trim() && address.city.trim() && address.state && address.pincode.trim()) {
      try {
        // Check if pincode is serviceable
        const serviceableResponse = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${address.pincode}`)
        const serviceableData = await serviceableResponse.json()
        
        if (!serviceableData.serviceable) {
          navigate('/not-available')
          return
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
            onFocus={() => address.city && setShowCitySuggestions(true)}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
          />
          {showCitySuggestions && citySuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-32 sm:max-h-40 overflow-y-auto">
              {citySuggestions
                .filter(city => city.toLowerCase().includes(address.city.toLowerCase()))
                .map((city) => (
                <button
                  key={city}
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-3 sm:px-4 py-2 hover:bg-blue-50 text-black text-sm sm:text-base"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <select
            value={address.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black appearance-none bg-white text-sm sm:text-base"
          >
            <option value="" className="text-gray-400">State</option>
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
            className="w-full p-3 sm:p-4 border-2 border-blue-500 rounded-full focus:outline-none focus:border-blue-600 text-black placeholder-gray-400 text-sm sm:text-base"
            maxLength={6}
          />
        </div>

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