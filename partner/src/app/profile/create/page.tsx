import Link from "next/link";

export default function CreateProfile() {
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/verify" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Create Profile</h2>
          <Link href="/pickups" className="text-blue-600 font-semibold">Save</Link>
        </div>
      </header>

      {/* Add Profile Photo */}
      <div className="px-4 pt-6 flex flex-col items-center">
        <div className="size-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <span className="text-3xl text-blue-600">+</span>
        </div>
        <p className="mt-3 text-sm text-gray-600">Add Profile Photo</p>
      </div>

      {/* Form */}
      <form className="px-4 mt-6 flex flex-col gap-4">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">👤</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            type="text"
          />
        </div>

        {/* Email Address */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">✉️</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            type="email"
          />
        </div>

        {/* Mobile Number */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">📞</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123-456-7890"
            type="tel"
          />
        </div>

        {/* Address Line 1 */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">🏠</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address Line 1"
            type="text"
          />
        </div>

        {/* Address Line 2 (Optional) */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">🏠</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address Line 2 (Optional)"
            type="text"
          />
        </div>

        {/* City */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">🏙️</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City"
            type="text"
          />
        </div>

        {/* State (select) */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">🗺️</span>
          <select className="w-full appearance-none rounded-xl border-2 border-blue-400 pl-9 pr-10 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">State</option>
            <option>Gujarat</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
        </div>

        {/* Pincode (select) */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">🏷️</span>
          <select className="w-full appearance-none rounded-xl border-2 border-blue-400 pl-9 pr-10 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Pincode</option>
            <option>380001</option>
            <option>400001</option>
            <option>110001</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
        </div>
      </form>

      {/* Primary Address */}
      <div className="px-4 mt-4">
        <label className="flex items-center gap-2 text-base text-black">
          <input type="checkbox" className="h-4 w-4 accent-blue-600" />
          Set as Primary Address
        </label>
      </div>

      {/* Save & Continue */}
      <div className="px-4">
        <Link href="/pickups" className="mt-5 w-full inline-flex justify-center items-center bg-blue-600 text-white rounded-xl py-3 text-base font-semibold">Save & Continue</Link>
      </div>
    </div>
  );
}