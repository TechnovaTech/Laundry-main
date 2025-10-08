"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    vehicleType: "",
    vehicleNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const partnerMobile = localStorage.getItem("partnerMobile");
    if (partnerMobile) {
      setFormData(prev => ({ ...prev, mobile: partnerMobile }));
    }
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/partners/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("partnerId", data.data._id);
        router.push("/pickups");
      } else {
        alert(data.error || "Failed to save profile");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/verify" className="text-2xl leading-none text-black">←</Link>
          <h2 className="text-lg font-semibold text-black">Create Profile</h2>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="text-blue-600 font-semibold disabled:text-gray-400"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Add Profile Photo */}
      <div className="px-4 pt-6 flex flex-col items-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => setProfileImage(e.target?.result);
              reader.readAsDataURL(file);
            }
          }}
          className="hidden" 
          id="profile-photo"
        />
        <label 
          htmlFor="profile-photo" 
          className="size-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="size-28 rounded-full object-cover" />
          ) : (
            <span className="text-3xl text-blue-600">+</span>
          )}
        </label>
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
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Email Address */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">✉️</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        {/* Mobile Number */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">📞</span>
          <input
            className="w-full rounded-xl border-2 border-blue-400 pl-9 pr-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123-456-7890"
            type="tel"
            value={formData.mobile}
            readOnly
          />
        </div>


      </form>



      {/* Save & Continue */}
      <div className="px-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="mt-5 w-full bg-blue-600 text-white rounded-xl py-3 text-base font-semibold disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}