import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="pb-6">
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Login</h2>
          <span className="w-6" />
        </div>
      </header>

      <div className="px-4 pt-6 flex flex-col items-center">
        <Image src="/scooter.svg" alt="Scooter" width={220} height={140} />
        <p className="mt-4 text-sm text-gray-500">Sign in to your account.</p>
      </div>

      <div className="px-4 mt-10">
        <label className="block text-lg font-medium text-black">Please enter your mobile no :</label>
        <div className="mt-3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">👤</span>
          <input
            className="w-full rounded-xl border border-blue-300 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your  phone no -"
            type="tel"
            defaultValue=""
          />
        </div>
        <Link href="/verify" className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">Login</Link>
      </div>
    </div>
  );
}