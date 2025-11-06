'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center text-center">
        <Image 
          src="/get-started-icon.png" 
          alt="Urban Steam Captain" 
          width={320}
          height={320}
          className="w-64 h-64 sm:w-80 sm:h-80 mb-4 sm:mb-6 object-contain"
        />
        
        <h1 
          className="text-3xl sm:text-4xl font-bold mb-2" 
          style={{ 
            background: 'linear-gradient(to right, #452D9B, #07C8D0)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text' 
          }}
        >
          Urban Steam Captain
        </h1>
        
        <p 
          className="text-base sm:text-lg font-normal mb-6 sm:mb-8 leading-relaxed" 
          style={{ 
            background: 'linear-gradient(to right, #452D9B, #07C8D0)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text' 
          }}
        >
          Reimagining ironing for the modern India
        </p>
        
        <button 
          onClick={() => router.push('/check-availability')}
          className="w-full bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white py-4 sm:py-6 rounded-xl text-sm sm:text-base font-medium shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
