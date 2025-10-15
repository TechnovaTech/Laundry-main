import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginPersonImg from "@/assets/LOGIN.png";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");

  const handleLogin = async () => {
    if (mobileNumber.length === 10) {
      try {
        const phone = `+91${mobileNumber}`;
        
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
          });
        }
        
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
        (window as any).confirmationResult = confirmationResult;
        
        localStorage.setItem('userMobile', mobileNumber);
        localStorage.setItem('userPhone', phone);
        navigate("/verify-mobile", { state: { mobileNumber } });
      } catch (error: any) {
        console.error('Login failed:', error);
        alert(error.message || 'Failed to send OTP. Please try again.');
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
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;