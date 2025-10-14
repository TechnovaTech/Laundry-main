import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginPersonImg from "@/assets/LOGIN.png";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");

  const handleLogin = async () => {
    if (mobileNumber.length === 10) {
      try {
        const response = await fetch('http://localhost:3000/api/mobile/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: mobileNumber })
        })
        const data = await response.json()
        if (data.success) {
          localStorage.setItem('userMobile', mobileNumber)
          navigate("/verify-mobile", { 
            state: { 
              mobileNumber, 
              otp: data.data.otp, 
              customerId: data.data.customerId,
              isExistingUser: data.data.isExistingUser,
              customer: data.data.customer
            } 
          })
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
      <div className="flex flex-1 flex-col items-center">
        <h1 className="mb-4 sm:mb-6 self-start text-2xl sm:text-3xl font-bold text-black">
          Let's log into your<br />account →
        </h1>
        
        <div className="mb-4 sm:mb-6 w-full max-w-xs sm:max-w-sm">
          <img 
            src={loginPersonImg}
            alt="Login" 
            className="w-full h-64 sm:h-80 object-contain"
          />
        </div>
        
        <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
          <div>
            <label className="mb-2 block text-left text-base sm:text-lg text-black font-medium">
              Please enter your mobile no :
            </label>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
              className="rounded-xl border-2 border-blue-500 py-3 sm:py-4 text-sm sm:text-base"
              maxLength={10}
              inputMode="tel"
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            disabled={mobileNumber.length !== 10}
            className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;