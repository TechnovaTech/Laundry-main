"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, []);

  const handleLogin = async () => {
    if (!mobile || mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const phone = `+91${mobile}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      
      localStorage.setItem("partnerMobile", mobile);
      localStorage.setItem("partnerPhone", phone);
      router.push("/verify");
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3" suppressHydrationWarning>
          <Link href="/" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Login</h2>
          <span className="w-6" />
        </div>
      </header>

      <div className="px-4 pt-6 flex flex-col items-center" suppressHydrationWarning>
        <Image src="/scooter.svg" alt="Delivery Partner" width={220} height={140} />
        <p className="mt-4 text-sm text-gray-500">Sign in to your account.</p>
      </div>

      <div className="px-4 mt-10" suppressHydrationWarning>
        <label className="block text-lg font-medium text-black">Please enter your mobile no :</label>
        <div className="mt-3 relative" suppressHydrationWarning>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">👤</span>
          <input
            className="w-full rounded-xl border border-blue-300 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone no"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
          />
        </div>
        <button 
          onClick={handleLogin}
          disabled={loading}
          className="mt-5 w-full text-white rounded-xl py-3 text-base font-semibold"
          style={!loading ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}