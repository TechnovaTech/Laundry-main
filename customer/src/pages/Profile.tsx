import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, MapPin, Edit, Trash2, CreditCard, Wallet, Gift, HelpCircle, Mail, Phone as PhoneIcon, Bell, FileText, LogOut, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);
  const [newPayment, setNewPayment] = useState({ 
    type: 'Cash', 
    upiId: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });

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
        
        // Update payment options from database
        if (customer.paymentMethods && customer.paymentMethods.length > 0) {
          console.log('Loaded payment methods:', customer.paymentMethods);
          setPaymentOptions(customer.paymentMethods);
        } else {
          console.log('No payment methods found in database');
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };





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

  const handleAddPayment = async () => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        console.error('No customer ID found');
        return;
      }
      
      let paymentMethod: any = {
        type: newPayment.type,
        addedAt: new Date().toISOString()
      };
      
      // Validate and add type-specific fields
      if (newPayment.type === 'Cash') {
        paymentMethod.details = 'Cash on Delivery';
      } else if (newPayment.type === 'UPI') {
        if (!newPayment.upiId.trim()) {
          console.error('UPI ID is required');
          return;
        }
        paymentMethod.upiId = newPayment.upiId;
      } else if (newPayment.type === 'Card') {
        if (!newPayment.cardNumber.trim() || !newPayment.cardHolder.trim() || !newPayment.cvv.trim()) {
          console.error('Card details are incomplete');
          return;
        }
        paymentMethod.cardNumber = newPayment.cardNumber;
        paymentMethod.cardHolder = newPayment.cardHolder;
        paymentMethod.expiryDate = newPayment.expiryDate;
        paymentMethod.cvv = newPayment.cvv;
      } else if (newPayment.type === 'Bank Transfer') {
        if (!newPayment.accountNumber.trim() || !newPayment.ifscCode.trim()) {
          console.error('Bank details are incomplete');
          return;
        }
        paymentMethod.accountNumber = newPayment.accountNumber;
        paymentMethod.ifscCode = newPayment.ifscCode;
        paymentMethod.bankName = newPayment.bankName;
      }
      
      let updatedPayments;
      if (editingPaymentIndex !== null) {
        updatedPayments = [...paymentOptions];
        updatedPayments[editingPaymentIndex] = paymentMethod;
      } else {
        updatedPayments = [...paymentOptions, paymentMethod];
      }
      
      console.log('Sending payment data:', { paymentMethods: updatedPayments });
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethods: updatedPayments })
      });
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (response.ok) {
        setPaymentOptions(updatedPayments);
        setNewPayment({ type: 'Cash', upiId: '', cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', accountNumber: '', ifscCode: '', bankName: '' });
        setEditingPaymentIndex(null);
        setShowPaymentModal(false);
        console.log('Payment method saved successfully');
        // Refresh profile data to confirm save
        setTimeout(() => {
          fetchCustomerProfile();
        }, 500);
      } else {
        console.error('Failed to save payment method:', result);
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleEditPayment = (index: number) => {
    const payment = paymentOptions[index];
    setNewPayment({
      type: payment.type,
      upiId: payment.upiId || '',
      cardNumber: payment.cardNumber || '',
      cardHolder: payment.cardHolder || '',
      expiryDate: payment.expiryDate || '',
      cvv: payment.cvv || '',
      accountNumber: payment.accountNumber || '',
      ifscCode: payment.ifscCode || '',
      bankName: payment.bankName || ''
    });
    setEditingPaymentIndex(index);
    setShowPaymentModal(true);
  };

  const handleDeletePayment = async (index) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const updatedPayments = paymentOptions.filter((_, i) => i !== index);
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethods: updatedPayments })
      });
      
      if (response.ok) {
        setPaymentOptions(updatedPayments);
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const handleSetPrimaryPayment = async (index) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const updatedPayments = paymentOptions.map((payment, i) => ({
        ...payment,
        isPrimary: i === index
      }));
      
      const response = await fetch(`http://localhost:3000/api/mobile/profile?customerId=${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethods: updatedPayments })
      });
      
      if (response.ok) {
        setPaymentOptions(updatedPayments);
      }
    } catch (error) {
      console.error('Failed to set primary payment method:', error);
    }
  };

  const hasAllPaymentTypes = () => {
    const existingTypes = paymentOptions.map(option => option.type);
    const allTypes = ['Cash', 'UPI', 'Card', 'Bank Transfer'];
    return allTypes.every(type => existingTypes.includes(type));
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
          {paymentOptions.map((option, index) => (
            <div key={index} className={`bg-white rounded-2xl p-3 sm:p-4 shadow-lg mb-3 flex items-center justify-between gap-2 sm:gap-3 ${option.isPrimary ? 'border-2 border-blue-500' : ''}`}>
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-black text-sm sm:text-base">{option.type}</p>
                    {option.isPrimary && <span className="text-blue-500 text-xs font-medium">Primary</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {option.type === 'Cash' && 'Cash on Delivery'}
                    {option.type === 'UPI' && option.upiId}
                    {option.type === 'Card' && `${option.cardHolder} - ****${option.cardNumber?.slice(-4)}`}
                    {option.type === 'Bank Transfer' && `${option.bankName} - ****${option.accountNumber?.slice(-4)}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                {!option.isPrimary && (
                  <button 
                    onClick={() => handleSetPrimaryPayment(index)}
                    className="text-gray-400 hover:text-green-500 transition-colors p-1"
                    title="Set as Primary"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button 
                  onClick={() => handleEditPayment(index)}
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                  onClick={() => handleDeletePayment(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
          {!hasAllPaymentTypes() && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="text-blue-500 font-semibold text-xs sm:text-sm"
            >
              + Add Payment
            </button>
          )}
          {hasAllPaymentTypes() && (
            <p className="text-gray-500 text-xs sm:text-sm">All payment methods added</p>
          )}
        </div>

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0" onClick={() => setShowPaymentModal(false)}>
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">{editingPaymentIndex !== null ? 'Edit' : 'Add'} Payment Method</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Payment Type</label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                    className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    style={{ fontSize: '16px' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                {newPayment.type === 'Cash' && (
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <p className="text-xs sm:text-sm text-blue-700">💵 Pay with cash when your order is delivered</p>
                  </div>
                )}
                
                {newPayment.type === 'UPI' && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">UPI ID</label>
                    <input
                      type="text"
                      placeholder="example@upi"
                      value={newPayment.upiId}
                      onChange={(e) => setNewPayment({ ...newPayment, upiId: e.target.value })}
                      className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                )}
                
                {newPayment.type === 'Card' && (
                  <>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={newPayment.cardNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        style={{ fontSize: '16px' }}
                        maxLength={16}
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Card Holder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={newPayment.cardHolder}
                        onChange={(e) => setNewPayment({ ...newPayment, cardHolder: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={newPayment.expiryDate}
                          onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                          className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          style={{ fontSize: '16px' }}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={newPayment.cvv}
                          onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })}
                          className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          style={{ fontSize: '16px' }}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {newPayment.type === 'Bank Transfer' && (
                  <>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Account Number</label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        value={newPayment.accountNumber}
                        onChange={(e) => setNewPayment({ ...newPayment, accountNumber: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">IFSC Code</label>
                      <input
                        type="text"
                        placeholder="ABCD0123456"
                        value={newPayment.ifscCode}
                        onChange={(e) => setNewPayment({ ...newPayment, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        style={{ fontSize: '16px' }}
                        maxLength={11}
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 block">Bank Name</label>
                      <input
                        type="text"
                        placeholder="Bank Name"
                        value={newPayment.bankName}
                        onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                        className="w-full p-2.5 sm:p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setNewPayment({ type: 'Cash', upiId: '', cardNumber: '', cardHolder: '', expiryDate: '', cvv: '', accountNumber: '', ifscCode: '', bankName: '' });
                      setEditingPaymentIndex(null);
                    }}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-gray-600 border border-gray-300 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 text-sm sm:text-base"
                  >
                    {editingPaymentIndex !== null ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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