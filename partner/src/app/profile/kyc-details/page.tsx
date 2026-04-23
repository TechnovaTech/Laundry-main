"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from '@/config/api';

export default function KYCDetails() {
  const [loading, setLoading] = useState(true);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);
  const [partner, setPartner] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) {
      router.push("/login");
      return;
    }
    fetchPartnerStatus(partnerId);
  }, []);

  // Poll every 5 seconds when waiting for approval (pending or after resubmit)
  useEffect(() => {
    const shouldPoll =
      partner?.kycStatus === 'pending' || resubmitSuccess;

    if (!shouldPoll) return;

    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/mobile/partners/${partnerId}`);
        const data = await response.json();
        if (data.success && data.data) {
          const status = data.data.kycStatus;
          if (status === 'approved') {
            clearInterval(interval);
            router.push('/pickups');
          } else if (status === 'rejected') {
            clearInterval(interval);
            setPartner(data.data);
            setResubmitSuccess(false);
          }
        }
      } catch (error) {
        // silent — keep polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [partner?.kycStatus, resubmitSuccess, router]);

  const fetchPartnerStatus = async (partnerId: string) => {
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
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Failed to fetch partner:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // One-click resubmit — uses all existing data already on the partner record
  const handleResubmit = async () => {
    const partnerId = localStorage.getItem("partnerId");
    if (!partnerId || !partner) return;

    setResubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/mobile/partners/kyc/${partnerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleType: partner.vehicleType || "",
          vehicleNumber: partner.vehicleNumber || "",
          aadharNumber: partner.aadharNumber || "",
          aadharImage: partner.aadharImage || "",
          drivingLicenseNumber: partner.drivingLicenseNumber || "",
          drivingLicenseImage: partner.drivingLicenseImage || "",
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPartner(data.data);
        setResubmitSuccess(true);
      } else {
        alert(data.error || "Failed to resubmit KYC. Please try again.");
      }
    } catch (error) {
      console.error("Resubmit error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setResubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#e0d4f7', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isRejected = partner?.kycStatus === 'rejected';
  const isPending  = partner?.kycStatus === 'pending';
  const isApproved = partner?.kycStatus === 'approved';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="p-4">

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* Title row */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">KYC Information</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isApproved ? "bg-green-100 text-green-800" :
              isRejected ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {partner?.kycStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>

          <div className="p-4 space-y-5">

            {/* ── PENDING banner ── */}
            {isPending && !resubmitSuccess && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-sm text-yellow-800">
                  📋 Your KYC is under review. Admin will verify within 24–48 hours.
                </p>
              </div>
            )}

            {/* ── RESUBMIT SUCCESS banner ── */}
            {resubmitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-base font-bold text-green-800">KYC Resubmitted!</p>
                </div>
                <p className="text-sm text-green-700">
                  Your KYC has been sent to admin for review. You will be able to accept orders once admin approves. Please wait 24–48 hours.
                </p>
              </div>
            )}

            {/* ── APPROVED banner ── */}
            {isApproved && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-sm text-green-800">
                  ✅ Your KYC has been approved! You can now accept orders.
                </p>
              </div>
            )}

            {/* ── REJECTED banner + rejection reason ── */}
            {isRejected && !resubmitSuccess && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">❌</span>
                  <p className="text-base font-bold text-red-700">KYC Rejected</p>
                </div>
                <p className="text-sm font-semibold text-red-600 mb-1">Reason from Admin:</p>
                <p className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2 font-medium">
                  {partner?.kycRejectionReason || "No reason provided"}
                </p>
                <p className="text-xs text-red-500 mt-2">
                  Review your documents below and tap <strong>Resubmit KYC</strong> to send again.
                </p>
              </div>
            )}

            {/* ── KYC Data Fields ── */}
            <div className="space-y-4">

              {/* Vehicle Type */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vehicle Type</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {partner?.vehicleType || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>

              {/* Vehicle Number */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vehicle Number</p>
                <p className="text-base font-medium text-gray-900 uppercase">
                  {partner?.vehicleNumber || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>

              {/* Aadhar Number */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Aadhar Number</p>
                <p className="text-base font-medium text-gray-900">
                  {partner?.aadharNumber
                    ? `XXXX-XXXX-${partner.aadharNumber.slice(-4)}`
                    : <span className="text-gray-400">Not provided</span>}
                </p>
              </div>

              {/* Aadhar Image */}
              {partner?.aadharImage && (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Aadhar Card Image</p>
                  <img
                    src={partner.aadharImage}
                    alt="Aadhar"
                    className="w-full max-w-sm h-44 object-contain rounded-lg border border-gray-200 cursor-pointer"
                    onClick={() => window.open(partner.aadharImage, '_blank')}
                  />
                  <p className="text-xs text-gray-400 mt-1">Tap image to view full size</p>
                </div>
              )}

              {/* Driving License Number */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Driving License Number</p>
                <p className="text-base font-medium text-gray-900 uppercase">
                  {partner?.drivingLicenseNumber || <span className="text-gray-400">Not provided</span>}
                </p>
              </div>

              {/* Driving License Image */}
              {partner?.drivingLicenseImage && (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Driving License Image</p>
                  <img
                    src={partner.drivingLicenseImage}
                    alt="Driving License"
                    className="w-full max-w-sm h-44 object-contain rounded-lg border border-gray-200 cursor-pointer"
                    onClick={() => window.open(partner.drivingLicenseImage, '_blank')}
                  />
                  <p className="text-xs text-gray-400 mt-1">Tap image to view full size</p>
                </div>
              )}

              {/* Submitted On */}
              {partner?.kycSubmittedAt && (
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Submitted On</p>
                  <p className="text-base font-medium text-gray-900">
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
            </div>

            {/* ── RESUBMIT BUTTON (only when rejected and not yet resubmitted) ── */}
            {isRejected && !resubmitSuccess && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 text-center mb-3">
                  Your existing documents will be resubmitted to admin for review.
                  {"\n"}If you need to change any document, go to{" "}
                  <button
                    onClick={() => router.push('/profile/kyc')}
                    className="underline font-semibold"
                    style={{ color: '#452D9B' }}
                  >
                    Edit KYC
                  </button>{" "}
                  first.
                </p>
                <button
                  onClick={handleResubmit}
                  disabled={resubmitting}
                  className="w-full py-4 rounded-2xl text-white text-base font-bold shadow-lg flex items-center justify-center gap-2"
                  style={
                    resubmitting
                      ? { background: '#9ca3af', cursor: 'not-allowed' }
                      : { background: 'linear-gradient(to right, #452D9B, #07C8D0)' }
                  }
                >
                  {resubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resubmitting...
                    </>
                  ) : (
                    <>
                      🔄 Resubmit KYC
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── Incomplete KYC prompt ── */}
            {(!partner?.vehicleType || !partner?.aadharNumber || !partner?.drivingLicenseNumber) && !isRejected && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-800">📝 Complete your KYC verification to start accepting orders.</p>
                <button
                  onClick={() => router.push('/profile/kyc')}
                  className="mt-2 px-4 py-2 text-white rounded-lg text-sm font-semibold"
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
