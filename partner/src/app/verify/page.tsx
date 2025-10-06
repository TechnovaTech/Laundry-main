"use client";
import Link from "next/link";
import { useState } from "react";

export default function Verify() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const nextEmptyIndex = otp.findIndex((d) => d === "");

  const addDigit = (d: string) => {
    setOtp((prev) => {
      const idx = prev.findIndex((x) => x === "");
      if (idx === -1) return prev; // full
      const copy = [...prev];
      copy[idx] = d;
      return copy;
    });
  };

  const backspace = () => {
    setOtp((prev) => {
      const idx = prev.findLastIndex((x) => x !== "");
      if (idx < 0) return prev;
      const copy = [...prev];
      copy[idx] = "";
      return copy;
    });
  };

  return (
    <div className="pb-6">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/login" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Verify Mobile</h2>
          <span className="w-6" />
        </div>
      </header>

      <div className="px-4 pt-6">
        <p className="text-center text-gray-500">We’ve sent an OTP to</p>
        <p className="mt-1 text-center text-black font-semibold">+91 XXXXXXXX</p>
        <p className="mt-1 text-center text-blue-600">Change number</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          {otp.map((val, i) => (
            <div
              key={i}
              className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center text-lg font-medium ${
                i === nextEmptyIndex ? "border-blue-600" : "border-gray-300"
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-gray-500">Didn’t get OTP?</p>
        <p className="text-center text-blue-600">Resend in 30s</p>

        <Link href="/profile/create" className="mt-4 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">Verify & Continue</Link>
      </div>

      {/* Keypad */}
      <div className="mt-6 px-4">
        <div className="grid grid-cols-5 gap-4">
          {["1","2","3","4","5"].map((n) => (
            <button key={n} className="rounded-xl bg-gray-100 text-black py-3 text-base font-semibold" onClick={() => addDigit(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {["6","7","8","9","0"].map((n) => (
            <button key={n} className="rounded-xl bg-gray-100 text-black py-3 text-base font-semibold" onClick={() => addDigit(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center">
          <button className="rounded-xl bg-gray-200 text-black py-4 px-8 text-base font-semibold" onClick={backspace}>
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}