"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    vehicleType: "",
    vehicleNumber: "",
    aadharNumber: "",
    panNumber: "",
    drivingLicense: "",
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
          address: data.address || "",
          vehicleType: data.vehicleType || "",
          vehicleNumber: data.vehicleNumber || "",
          aadharNumber: data.aadharNumber || "",
          panNumber: data.panNumber || "",
          drivingLicense: data.drivingLicense || "",
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

  const handleLogout = () => {
    localStorage.removeItem("partner");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="text-base font-medium">{partnerData.name || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Mobile Number</label>
                <p className="text-base font-medium">{partnerData.mobile || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-base font-medium">{partnerData.email || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <p className="text-base font-medium">{partnerData.address || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Vehicle Type</label>
                <p className="text-base font-medium">{partnerData.vehicleType || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Vehicle Number</label>
                <p className="text-base font-medium">{partnerData.vehicleNumber || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">KYC Information</h2>
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
                <label className="text-sm text-gray-600">Aadhar Number</label>
                <p className="text-base font-medium">{partnerData.aadharNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">PAN Number</label>
                <p className="text-base font-medium">{partnerData.panNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Driving License</label>
                <p className="text-base font-medium">{partnerData.drivingLicense || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Bank Account Information</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Account Holder Name</label>
                <p className="text-base font-medium">{partnerData.accountHolderName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Account Number</label>
                <p className="text-base font-medium">{partnerData.accountNumber || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">IFSC Code</label>
                <p className="text-base font-medium">{partnerData.ifscCode || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Bank Name</label>
                <p className="text-base font-medium">{partnerData.bankName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Branch</label>
                <p className="text-base font-medium">{partnerData.branch || "N/A"}</p>
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
