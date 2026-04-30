import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginPersonImg from "@/assets/LOGIN.png";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { Capacitor } from '@capacitor/core';
import { API_URL } from '@/config/api';

const Login = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          credential: credentialResponse.credential,
          role: 'customer'
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('customerId', data.data.customerId);
        localStorage.setItem('authToken', data.token);
        if (data.data.isNewUser) {
          navigate('/create-profile');
        } else {
          navigate('/home');
        }
      } else {
        alert(data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleGoogleLoginMobile = async () => {
    try {
      // Initialize GoogleAuth with correct client IDs
      await GoogleAuth.initialize({
        clientId: '514222866895-c11vn2eb5u15hi6d5ib0eb4d10cdo3oq.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      
      const result = await GoogleAuth.signIn();
      
      if (result?.authentication?.idToken) {
        const response = await fetch(`${API_URL}/api/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            idToken: result.authentication.idToken,
            role: 'customer'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('customerId', data.data.customerId);
          localStorage.setItem('authToken', data.token);
          navigate(data.data.isNewUser ? '/create-profile' : '/home');
        } else {
          alert('Login failed: ' + (data.error || 'Unknown error'));
        }
      } else {
        alert('Authentication failed');
      }
    } catch (error: any) {
      alert('Google Sign-In error: ' + (error.message || 'Something went wrong'));
    }
  };

  const handleAppleSignIn = async (): Promise<void> => {
    try {
      const result = await SignInWithApple.authorize({
        clientId: 'com.acsgroup.urbansteam.customer',
        redirectURI: 'https://urbansteam.in',
        scopes: 'name email',
        state: '',
        nonce: '',
      });

      const identityToken = result?.response?.identityToken;

      if (!identityToken) {
        alert('Authentication failed. Please try again.');
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/apple-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityToken, role: 'customer' }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('customerId', data.data.customerId);
        localStorage.setItem('authToken', data.token);
        navigate(data.data.isNewUser ? '/create-profile' : '/home');
      } else {
        alert(data.error || 'Apple Sign-In failed');
      }
    } catch (error: any) {
      // Silently handle user cancellation — no alert
      const message: string = error?.message || '';
      const code = error?.code;
      if (
        code === 1001 ||
        message.toLowerCase().includes('cancel') ||
        message.toLowerCase().includes('dismiss')
      ) {
        return;
      }
      alert('Apple Sign-In error: ' + (message || 'Something went wrong'));
    }
  };

  const handleLogin = async () => {
    if (mobileNumber.length === 10) {
      try {
        const phone = `+91${mobileNumber}`;
        console.log('Sending OTP to:', phone);
        console.log('API URL:', `${API_URL}/api/auth/send-otp`);
        
        const response = await fetch(`${API_URL}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          localStorage.setItem('userMobile', mobileNumber);
          navigate("/verify-mobile", { state: { mobileNumber } });
        } else {
          alert(data.error || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white px-4 sm:px-6 pb-6 sm:pb-8 overflow-hidden">
      <div className="flex flex-1 flex-col items-center">
        <h1 className="mb-4 sm:mb-6 self-start text-2xl sm:text-3xl font-bold text-black pt-4">
          Please log in to continue →
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
              Please enter your mobile number :
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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          {Capacitor.isNativePlatform() ? (
            <Button
              onClick={handleGoogleLoginMobile}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          ) : (
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert('Google login failed')}
                useOneTap
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="100%"
              />
            </div>
          )}

          {/* Sign in with Apple — iOS native only */}
          {Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' && (
            <Button
              onClick={handleAppleSignIn}
              className="w-full bg-black hover:bg-gray-900 text-white rounded-2xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              {/* Apple logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 134.2 2.6 198.4 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              Sign in with Apple
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;