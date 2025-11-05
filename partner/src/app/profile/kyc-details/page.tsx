"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from '@/config/api';

export default function KYCDetails() {
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) {
      router.push("/login");
      return;
    }
    fetchPartnerStatus(partnerId);
  }, []);

  const fetchPartnerStatus = async (partnerId) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPartner(data.data);
        }
      } else {
        console.error(`API Error: ${response.status}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Failed to fetch partner:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#e0d4f7', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-semibold">Back</span>
        </button>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              partner?.kycStatus === "approved" ? "bg-green-100 text-green-800" :
              partner?.kycStatus === "rejected" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {partner?.kycStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>
          <div className="p-4 space-y-4">
            {partner?.kycStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">📋 Your KYC is under review. Admin will verify within 24-48 hours.</p>
              </div>
            )}
            
            {partner?.kycStatus === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">✅ Your KYC has been approved! You can now accept orders.</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Type</label>
              <p className="text-base font-normal text-gray-900">{partner?.vehicleType || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Vehicle Number</label>
              <p className="text-base font-normal text-gray-900">{partner?.vehicleNumber || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Aadhar Number</label>
              <p className="text-base font-normal text-gray-900">
                {partner?.aadharNumber ? `****-****-${partner.aadharNumber.slice(-4)}` : "Not provided"}
              </p>
            </div>
            {partner?.aadharImage && (
              <div>
                <label className="text-sm font-semibold text-gray-800">Aadhar Card Image</label>
                <img 
                  src={partner.aadharImage} 
                  alt="Aadhar" 
                  className="mt-2 w-full max-w-md h-48 object-contain rounded-lg border cursor-pointer" 
                  onClick={() => window.open(partner.aadharImage, '_blank')}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-gray-800">Driving License Number</label>
              <p className="text-base font-normal text-gray-900">{partner?.drivingLicenseNumber || "Not provided"}</p>
            </div>
            {partner?.drivingLicenseImage && (
              <div>
                <label className="text-sm font-semibold text-gray-800">Driving License Image</label>
                <img 
                  src={partner.drivingLicenseImage} 
                  alt="License" 
                  className="mt-2 w-full max-w-md h-48 object-contain rounded-lg border cursor-pointer" 
                  onClick={() => window.open(partner.drivingLicenseImage, '_blank')}
                />
              </div>
            )}
            
            {partner?.kycSubmittedAt && (
              <div>
                <label className="text-sm font-semibold text-gray-800">Submitted On</label>
                <p className="text-base font-normal text-gray-900">
                  {new Date(partner.kycSubmittedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
            
            {partner?.kycRejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <label className="text-sm font-semibold text-red-800">❌ Rejection Reason</label>
                <p className="text-sm text-red-600 mt-1">{partner.kycRejectionReason}</p>
                <p className="text-xs text-red-500 mt-2">Please update your documents and resubmit KYC.</p>
              </div>
            )}
            
            {(!partner?.vehicleType || !partner?.aadharNumber || !partner?.drivingLicenseNumber) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">📝 Complete your KYC verification to start accepting orders.</p>
                <button 
                  onClick={() => router.push('/profile/kyc')}
                  className="mt-2 px-4 py-2 text-white rounded-lg text-sm"
                  style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                >
                  Complete KYC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
