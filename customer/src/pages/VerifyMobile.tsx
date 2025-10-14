import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const VerifyMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber || "XXXXXXXXX";
  const customerId = location.state?.customerId;
  const expectedOtp = location.state?.otp;
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleNumberPad = (num: string) => {
    const emptyIndex = otp.findIndex(digit => digit === "");
    if (emptyIndex !== -1) {
      const newOtp = [...otp];
      newOtp[emptyIndex] = num;
      setOtp(newOtp);
    }
  };

  const handleDelete = () => {
    const lastFilledIndex = otp.map((d, i) => d ? i : -1).filter(i => i !== -1).pop();
    if (lastFilledIndex !== undefined) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
    }
  };

  const handleVerify = () => {
    if (otp.every(digit => digit !== "")) {
      const enteredOtp = otp.join('')
      if (enteredOtp === expectedOtp) {
        const isExistingUser = location.state?.isExistingUser
        const customer = location.state?.customer
        
        localStorage.setItem('customerId', customerId)
        localStorage.setItem('userName', customer.name)
        localStorage.setItem('customerMobile', mobileNumber)
        window.dispatchEvent(new Event('userNameChanged'))
        
        if (isExistingUser) {
          navigate("/home")
        } else {
          navigate("/create-profile", { state: { customerId, mobileNumber } })
        }
      } else {
        alert('Invalid OTP')
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-3 sm:gap-4 border-b px-4 sm:px-6 py-4">
        <button onClick={() => navigate(-1)} className="text-black flex-shrink-0">
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black">Verify Mobile</h1>
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 text-center">
          <p className="mb-2 text-gray-600 text-sm sm:text-base">
            We've sent an OTP to
          </p>
          <p className="mb-2 text-base sm:text-lg font-bold text-black">
            +91 {mobileNumber}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="font-semibold text-blue-500 hover:underline text-sm sm:text-base"
          >
            Change number
          </button>
        </div>
        
        <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <div
              key={index}
              className="flex h-12 w-10 sm:h-14 sm:w-12 items-center justify-center rounded-xl border-2 border-blue-500 bg-white text-xl sm:text-2xl font-semibold text-black"
            >
              {digit}
            </div>
          ))}
        </div>
        
        <div className="mb-6 sm:mb-8 text-center text-xs sm:text-sm">
          <p className="text-gray-600">Didn't get OTP?</p>
          {resendTimer > 0 ? (
            <p className="text-blue-500">Resend in {resendTimer}s</p>
          ) : (
            <button className="font-semibold text-blue-500 hover:underline">
              Resend OTP
            </button>
          )}
        </div>
        
        <Button 
          onClick={handleVerify}
          disabled={otp.some(digit => digit === "")}
          className="mb-6 sm:mb-8 w-full max-w-sm sm:max-w-md bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          Verify & Continue
        </Button>
        
        <div className="w-full max-w-xs sm:max-w-sm space-y-2 sm:space-y-3">
          {/* First row: 1-5 */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {["1", "2", "3", "4", "5"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberPad(num)}
                className="flex h-12 sm:h-16 items-center justify-center rounded-xl bg-gray-200 text-lg sm:text-xl font-semibold text-black hover:bg-gray-300 transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
          
          {/* Second row: 6-0 */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {["6", "7", "8", "9", "0"].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberPad(num)}
                className="flex h-12 sm:h-16 items-center justify-center rounded-xl bg-gray-200 text-lg sm:text-xl font-semibold text-black hover:bg-gray-300 transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
          
          {/* Third row: Delete button centered */}
          <div className="flex justify-center">
            <button
              onClick={handleDelete}
              className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMobile;