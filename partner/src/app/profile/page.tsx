"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partnerData, setPartnerData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    drivingLicenseNumber: "",
    kycStatus: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: ""
  });

  useEffect(() => {
    fetchPartnerData();
  }, []);

  useEffect(() => {
    if (partnerData.address.pincode && !partnerData.address.city) {
      fetchLocationByPincode(partnerData.address.pincode);
    }
  }, [partnerData.address.pincode]);

  const fetchPartnerData = async () => {
    try {
      const partner = localStorage.getItem("partner");
      if (!partner) {
        router.push("/login");
        return;
      }
      const localData = JSON.parse(partner);
      const partnerId = localData._id || localData.id;

      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        setPartnerData({
          name: data.name || "",
          mobile: data.mobile || "",
          email: data.email || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || ""
          },
          vehicleType: data.vehicleType || "",
          vehicleNumber: data.vehicleNumber || "",
          aadharNumber: data.aadharNumber || "",
          drivingLicenseNumber: data.drivingLicenseNumber || "",
          kycStatus: data.kycStatus || "pending",
          accountHolderName: data.bankDetails?.accountHolderName || "",
          accountNumber: data.bankDetails?.accountNumber || "",
          ifscCode: data.bankDetails?.ifscCode || "",
          bankName: data.bankDetails?.bankName || "",
          branch: data.bankDetails?.branch || ""
        });
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationByPincode = async (pincode: string) => {
    if (pincode && pincode.length === 6) {
      try {
        const response = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${pincode}`);
        const result = await response.json();
        if (result.serviceable && result.area) {
          setPartnerData(prev => ({
            ...prev,
            address: {
              street: prev.address.street,
              city: result.area.city,
              state: result.area.state,
              pincode: pincode
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const partner = localStorage.getItem("partner");
      const localData = JSON.parse(partner);
      const partnerId = localData._id || localData.id;

      const response = await fetch(`http://localhost:3000/api/mobile/partners/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: partnerData.name,
          email: partnerData.email,
          address: partnerData.address,
          vehicleType: partnerData.vehicleType,
          vehicleNumber: partnerData.vehicleNumber,
          bankDetails: {
            accountHolderName: partnerData.accountHolderName,
            accountNumber: partnerData.accountNumber,
            ifscCode: partnerData.ifscCode,
            bankName: partnerData.bankName,
            branch: partnerData.branch
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        fetchPartnerData();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("partner");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" suppressHydrationWarning></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24" suppressHydrationWarning>
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <button onClick={() => router.back()} className="mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {partnerData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{partnerData.name}</h1>
            <p className="text-blue-100">{partnerData.mobile}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === "kyc"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            KYC
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === "bank"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Bank
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "personal" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:bg-gray-400"
              >
                {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-800">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.name}
                    onChange={(e) => setPartnerData({...partnerData, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.name || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Mobile Number</label>
                <p className="text-base font-normal text-gray-900">{partnerData.mobile || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={partnerData.email}
                    onChange={(e) => setPartnerData({...partnerData, email: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.email || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Pincode</label>
                <p className="text-base font-normal text-gray-900">{partnerData.address.pincode || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">City</label>
                <p className="text-base font-normal text-gray-900">{partnerData.address.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">State</label>
                <p className="text-base font-normal text-gray-900">{partnerData.address.state || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.address.street}
                    onChange={(e) => setPartnerData({...partnerData, address: {...partnerData.address, street: e.target.value}})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Enter street address"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.address.street || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Vehicle Type</label>
                {isEditing ? (
                  <select
                    value={partnerData.vehicleType}
                    onChange={(e) => setPartnerData({...partnerData, vehicleType: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                  </select>
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.vehicleType || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Vehicle Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.vehicleNumber}
                    onChange={(e) => setPartnerData({...partnerData, vehicleNumber: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.vehicleNumber || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  partnerData.kycStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : partnerData.kycStatus === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {partnerData.kycStatus.toUpperCase()}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-800">Vehicle Type</label>
                <p className="text-base font-normal text-gray-900">{partnerData.vehicleType || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Vehicle Number</label>
                <p className="text-base font-normal text-gray-900">{partnerData.vehicleNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Aadhar Number</label>
                <p className="text-base font-normal text-gray-900">{partnerData.aadharNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Driving License Number</label>
                <p className="text-base font-normal text-gray-900">{partnerData.drivingLicenseNumber || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Bank Account Information</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:bg-gray-400"
              >
                {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-800">Account Holder Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.accountHolderName}
                    onChange={(e) => setPartnerData({...partnerData, accountHolderName: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.accountHolderName || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Account Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.accountNumber}
                    onChange={(e) => setPartnerData({...partnerData, accountNumber: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.accountNumber || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">IFSC Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.ifscCode}
                    onChange={(e) => setPartnerData({...partnerData, ifscCode: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.ifscCode || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Bank Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.bankName}
                    onChange={(e) => setPartnerData({...partnerData, bankName: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.bankName || "N/A"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Branch</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={partnerData.branch}
                    onChange={(e) => setPartnerData({...partnerData, branch: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                ) : (
                  <p className="text-base font-normal text-gray-900">{partnerData.branch || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
