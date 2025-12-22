"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from '@/config/api';

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profileImage: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    pincodes: [""],
    vehicleType: "",
    vehicleNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPartnerData = async () => {
      const partnerId = localStorage.getItem("partnerId");
      if (!partnerId) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/mobile/partners?partnerId=${partnerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const partner = data.data;
          const isGoogleUser = partner.mobile?.startsWith('google_');
          setFormData({
            name: partner.name || "",
            email: partner.email || "",
            mobile: isGoogleUser ? "" : (partner.mobile || ""),
            profileImage: partner.profileImage || "",
            address: partner.address || {
              street: "",
              city: "",
              state: "",
              pincode: ""
            },
            pincodes: partner.pincodes && partner.pincodes.length > 0 ? partner.pincodes : [""],
            vehicleType: partner.vehicleType || "",
            vehicleNumber: partner.vehicleNumber || ""
          });
          if (partner.profileImage) {
            setProfileImage(partner.profileImage);
          }
        }
      } catch (error) {
        console.error("Failed to fetch partner data:", error);
      }
    };

    fetchPartnerData();
  }, [router]);

  const addPincode = () => {
    setFormData(prev => ({
      ...prev,
      pincodes: [...prev.pincodes, ""]
    }));
  };

  const removePincode = (index: number) => {
    if (formData.pincodes.length > 1) {
      setFormData(prev => ({
        ...prev,
        pincodes: prev.pincodes.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePincode = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({
      ...prev,
      pincodes: prev.pincodes.map((pincode, i) => i === index ? numericValue : pincode)
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Please fill required fields");
      return;
    }

    const validPincodes = formData.pincodes.filter(p => p.trim() && p.length === 6);
    if (validPincodes.length === 0) {
      alert("Please add at least one valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const partnerId = localStorage.getItem("partnerId");
      const response = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pincodes: formData.pincodes.filter(p => p.trim() && p.length === 6)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        router.push("/profile/kyc");
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
            className="font-semibold disabled:text-gray-400"
            style={{ color: '#452D9B' }}
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
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                setProfileImage(base64);
                setFormData(prev => ({ ...prev, profileImage: base64 || "" }));
              };
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
            <span className="text-3xl" style={{ color: '#452D9B' }}>+</span>
          )}
        </label>
        <p className="mt-3 text-sm text-gray-600">Add Profile Photo</p>
      </div>

      {/* Form */}
      <form className="px-4 mt-6 flex flex-col gap-4">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>👤</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Email Address */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>✉️</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        {/* Mobile Number */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>📞</span>
          <input
            className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-base text-black outline-none"
            style={{ borderColor: '#b8a7d9' }}
            onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
            onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
            placeholder="123-456-7890"
            type="tel"
            maxLength={10}
            value={formData.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, mobile: value }));
            }}
          />
        </div>

        {/* Service Pincodes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Service Areas (Pincodes)</label>
            <button
              type="button"
              onClick={addPincode}
              className="text-sm font-medium px-3 py-1 rounded-lg"
              style={{ color: '#452D9B', backgroundColor: '#f3f0ff' }}
            >
              + Add Pincode
            </button>
          </div>
          
          {formData.pincodes.map((pincode, index) => (
            <div key={index} className="relative flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#452D9B' }}>📍</span>
                <input
                  className="w-full rounded-xl border-2 pl-9 pr-3 py-3 text-sm text-black outline-none"
                  style={{ borderColor: '#b8a7d9' }}
                  onFocus={(e) => { e.target.style.borderColor = '#452D9B'; e.target.style.boxShadow = '0 0 0 2px #452D9B'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#b8a7d9'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Enter 6-digit pincode"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => updatePincode(index, e.target.value)}
                />
              </div>
              {formData.pincodes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePincode(index)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold hover:bg-red-200 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-1">Add all pincodes where you can provide delivery services</p>
        </div>
      </form>



      {/* Save & Continue */}
      <div className="px-4">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="mt-5 w-full text-white rounded-xl py-3 text-base font-semibold"
          style={!loading ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af' }}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}