import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail, Phone, Plus, X } from "lucide-react";
import { API_URL } from '@/config/api';

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customerId;
  const mobileNumber = location.state?.mobileNumber;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    referralCode: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId')
    
    if (!customerId && !storedCustomerId) {
      navigate('/login')
      return
    }
    
    const actualCustomerId = customerId || storedCustomerId
    
    // Fetch existing customer data from database
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/mobile/profile?customerId=${actualCustomerId}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          const customer = data.data
          setFormData({
            fullName: customer.name || '',
            email: customer.email || '',
            phone: customer.mobile?.startsWith('google_') ? '' : customer.mobile || '',
            referralCode: ''
          })
          if (customer.profileImage) {
            setProfileImage(customer.profileImage)
          }
        }
      } catch (error) {
        console.log('No existing customer data found')
      }
    }
    
    if (actualCustomerId) {
      fetchCustomerData()
    }
  }, [customerId, mobileNumber, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mobile/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          mobile: formData.phone,
          profileImage: profileImage || undefined,
          referralCode: formData.referralCode || undefined
        })
      })
      const data = await response.json()
      
      if (data.success) {
        const actualCustomerId = data.data?.customerId || customerId || localStorage.getItem('customerId')
        localStorage.setItem('customerId', actualCustomerId)
        localStorage.setItem('userName', formData.fullName)
        window.dispatchEvent(new Event('userNameChanged'))
        navigate("/home")
      } else {
        console.error('Profile save failed:', data.error)
        alert('Failed to save profile: ' + data.error)
      }
    } catch (error) {
      console.error('Profile save failed:', error)
      alert('Failed to save profile')
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white flex items-center border-b px-4 sm:px-6 py-4 z-10">
        <button onClick={() => navigate(-1)} className="mr-3 sm:mr-4 flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black">Create Profile</h1>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="profile-image"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" strokeWidth={3} />
              )}
            </label>
          </div>
          <p className="mt-2 sm:mt-3 text-gray-600 text-xs sm:text-sm">Add Profile Photo</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              inputMode="numeric"
              className="pl-10 sm:pl-12 h-10 sm:h-12 rounded-xl border-2 border-blue-500 text-sm sm:text-base"
            />
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={(e) => handleInputChange('referralCode', e.target.value.toUpperCase())}
              className="h-10 sm:h-12 rounded-xl border-2 border-gray-300 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
            I agree with all{' '}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-blue-500 underline hover:text-blue-600"
            >
              terms and conditions
            </button>
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!formData.fullName || !formData.email || !formData.phone || !agreedToTerms}
          className="w-full h-10 sm:h-12 rounded-xl text-white text-sm sm:text-base font-semibold mt-4 disabled:cursor-not-allowed"
          style={!formData.fullName || !formData.email || !formData.phone || !agreedToTerms ? { background: '#9ca3af' } : { background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
        >
          Save & Continue
        </Button>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold">Terms and Conditions</h2>
              <button onClick={() => setShowTermsModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6 text-xs sm:text-sm space-y-4">
              <section>
                <h3 className="font-bold mb-2">1. Acceptance of Terms</h3>
                <p>Welcome to Urban Steam, a unit of ACS Group. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Urban Steam ("we," "us," or "our") governing your use of the Urban Steam mobile application (the "App") and our steam ironing, pickup, and delivery services (collectively, the "Services"). By creating an account, accessing the App, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use our Services.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">2. Service Description</h3>
                <p>Urban Steam provides on-demand steam ironing services. Our Services include the pickup of your garments from your specified location, processing them at our facility, and delivering them back to you. The specific services available are listed within the App.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">3. User Accounts and Orders</h3>
                <p>a) To use our Services, you must register for an account and provide accurate, current, and complete information.</p>
                <p>b) You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <p>c) All orders for Services must be placed exclusively through the App.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">4. Pricing and Payments</h3>
                <p>a) All prices for our Services are listed in Indian Rupees (Rs.) within the App and are subject to change without prior notice.</p>
                <p>b) Prices are inclusive of all applicable taxes, including Goods and Services Tax (GST).</p>
                <p>c) Payments must be made in full at the time of placing an order through our designated payment gateway, Razorpay, or other methods specified in the App.</p>
                <p>d) We do not store your complete payment card details. All payment transactions are processed securely by our third-party payment processors.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">5. Garment Care and Processing</h3>
                <p>a) Urban Steam will exercise professional care and diligence in the processing of all garments.</p>
                <p>b) We are not responsible for any damage resulting from inherent weaknesses, defects, or colour loss in materials that were not apparent prior to processing.</p>
                <p>c) We follow the care labels on each garment. In the absence of a care label, we will process the garment using our professional judgment.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">6. Limitation of Liability for Damaged or Lost Items</h3>
                <p>a) In the rare event of damage or loss of an item that is directly attributable to our handling, you must notify our customer support team in writing within twenty-four (24) hours of delivery.</p>
                <p>b) Our total liability for any single damaged or lost item is limited to a maximum of ten (10) times the charge for processing that specific item, as indicated on your invoice.</p>
                <p>c) We are not liable for any loss of or damage to personal belongings (such as cash, jewellery, accessories, or other valuables) left in the garments. You agree to check all pockets and garments for such items before handing them over for pickup.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">7. User Responsibilities</h3>
                <p>You agree to:</p>
                <p>a) Inspect all garments for personal belongings before pickup.</p>
                <p>b) Not submit any hazardous, dangerous, or illegal materials with your garments.</p>
                <p>c) Provide accurate and complete address and contact information.</p>
                <p>d) Ensure that you or an authorized representative is available at the specified address during the scheduled pickup and delivery time slots.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">8. Pickup and Delivery</h3>
                <p>a) All pickups and deliveries must be scheduled through the App.</p>
                <p>b) The time slots provided are estimates. We are not liable for delays caused by traffic, weather, or other unforeseen circumstances, but we will make reasonable efforts to keep you informed.</p>
                <p>c) A failed pickup or delivery attempt due to your unavailability may result in order cancellation or an additional rescheduling fee.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">9. Cancellation and Refund Policy</h3>
                <p>a) Cancellation: You may cancel an order free of charge at any time before our delivery partner has been dispatched for pickup via the App. If the rider has already been dispatched, a cancellation fee may apply.</p>
                <p>b) Refunds:</p>
                <p className="ml-4">i. No refunds will be provided for services that have been successfully completed and delivered.</p>
                <p className="ml-4">ii. For service complaints (e.g., quality issues), you must contact our support within 24 hours of delivery. We will investigate and, at our sole discretion, may offer to re-process the item or provide a credit to your account.</p>
                <p className="ml-4">iii. Compensation for damaged or lost items is governed by Section 6 of these Terms.</p>
                <p className="ml-4">iv. Any approved refunds will be processed to the original payment method within 5-7 business days.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">10. General Limitation of Liability</h3>
                <p>To the maximum extent permitted by applicable law, ACS Group and Urban Steam, its affiliates, and their respective officers, directors, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or use, arising out of or in any way connected with your use of the App or Services.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">11. Governing Law and Jurisdiction</h3>
                <p>These Terms shall be governed by and construed in accordance with the laws of India. Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">12. Compliance with Consumer Protection Law</h3>
                <p>These Terms are intended to define the relationship between Urban Steam and our Users. However, nothing in these Terms shall be construed to limit or waive any rights, remedies, or protections that a User is granted as a consumer under the mandatory provisions of the Consumer Protection Act, 2019, and any rules made thereunder, or any other applicable consumer law. In the event of any conflict or inconsistency between a provision in these Terms and a mandatory provision of the Consumer Protection Act, 2019, the provisions of the Act shall prevail to the extent of such conflict.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">13. Severability</h3>
                <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court or competent authority under the Consumer Protection Act, 2019 or any other law, the validity, legality, and enforceability of the remaining provisions will not in any way be affected or impaired. Such a provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">14. Contact Information</h3>
                <p>For any questions, support, or to report an issue regarding these Terms or our Services, please contact us at:</p>
                <p className="mt-2">Support Email: <a href="mailto:support@urbansteam.in" className="text-blue-500 underline">support@urbansteam.in</a></p>
              </section>
            </div>
            <div className="p-4 border-t">
              <Button
                onClick={() => setShowTermsModal(false)}
                className="w-full h-10 sm:h-12 rounded-xl text-white"
                style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;