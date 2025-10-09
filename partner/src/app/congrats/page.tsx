"use client";
import { useRouter } from "next/navigation";

export default function Congrats() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
      <p className="text-center text-gray-600 mb-8">
        We are available in your area.<br />Let's get you started!
      </p>
      
      <button 
        onClick={() => router.push("/login")}
        className="w-full max-w-md bg-blue-600 text-white rounded-xl py-4 text-lg font-semibold"
      >
        Continue to Login
      </button>
    </div>
  );
}
