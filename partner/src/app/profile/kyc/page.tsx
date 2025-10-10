"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KYCVerification() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    drivingLicenseNumber: "",
    aadharImage: "",
    drivingLicenseImage: ""
  });
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const partner = localStorage.getItem("partner");
    if (!partner) {
      router.push("/login");
      return;
    }
    const data = JSON.parse(partner);
    const partnerId = data._id || data.id;
    fetchPartnerStatus(partnerId);
  }, []);

  const fetchPartnerStatus = async (partnerId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const data = await response.json();
      if (data.success) {
        const updatedPartner = data.data;
        setPartner(updatedPartner);
        localStorage.setItem("partner", JSON.stringify(updatedPartner));
        if (updatedPartner.kycStatus === 'approved') {
          router.push("/pickups");
        }
      }
    } catch (error) {
      console.error("Failed to fetch partner:", error);
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.vehicleType || !formData.vehicleNumber || !formData.aadharNumber || !formData.drivingLicenseNumber || !formData.aadharImage || !formData.drivingLicenseImage) {
      alert("Please fill all fields and upload images");
      return;
    }

    setLoading(true);
    try {
      const partnerStr = localStorage.getItem("partner");
      const partnerData = JSON.parse(partnerStr);
      const partnerId = partnerData._id || partnerData.id;
      console.log("Submitting KYC for partner:", partnerId);
      
      const response = await fetch(`http://localhost:3000/api/mobile/partners/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, ...formData })
      });

      const result = await response.json();
      console.log("KYC Response:", result);
      
      if (result.success) {
        alert("KYC submitted successfully! Waiting for admin approval.");
        await fetchPartnerStatus(partnerId);
      } else {
        console.error("KYC Error:", result.error);
        alert(result.error || "Failed to submit KYC");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (partner?.kycStatus === 'pending' && partner?.kycSubmittedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">KYC Under Review</h2>
          <p className="text-gray-600">Your documents are being verified by admin.</p>
        </div>
      </div>
    );
  }

  if (partner?.kycStatus === 'rejected') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">KYC Rejected</h2>
          <p className="text-gray-600 mb-2">Please reupload legal documentation</p>
          {partner.kycRejectionReason && (
            <p className="text-sm text-red-500 mt-2">Reason: {partner.kycRejectionReason}</p>
          )}
        </div>
        <button
          onClick={() => setPartner(prev => ({ ...prev, kycStatus: null }))}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Resubmit Documents
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24" suppressHydrationWarning>
      <header className="sticky top-0 bg-white shadow-sm">
        <div className="flex items-center justify-center px-4 py-3" suppressHydrationWarning>
          <h2 className="text-lg font-semibold text-black">KYC Verification</h2>
        </div>
      </header>

      <div className="px-4 pt-6" suppressHydrationWarning>
        <p className="text-center text-gray-600 mb-6">Please upload your documents for verification</p>

        <div className="flex flex-col gap-4" suppressHydrationWarning>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.vehicleType}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
            >
              <option value="">Select Vehicle Type</option>
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
            <input
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Vehicle Number"
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Number</label>
            <input
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Aadhar Number"
              type="text"
              value={formData.aadharNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('aadharImage', e.target.files?.[0])}
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-2 text-base text-black"
            />
            {formData.aadharImage && (
              <img src={formData.aadharImage} alt="Aadhar" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Number</label>
            <input
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-3 text-base text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter License Number"
              type="text"
              value={formData.drivingLicenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, drivingLicenseNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('drivingLicenseImage', e.target.files?.[0])}
              className="w-full rounded-xl border-2 border-blue-400 px-3 py-2 text-base text-black"
            />
            {formData.drivingLicenseImage && (
              <img src={formData.drivingLicenseImage} alt="License" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white rounded-xl py-3 text-base font-semibold disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
