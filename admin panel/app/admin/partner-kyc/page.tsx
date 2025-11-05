'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface Partner {
  _id: string
  name: string
  mobile: string
  aadharNumber?: string
  drivingLicenseNumber?: string
  aadharImage?: string
  drivingLicenseImage?: string
  kycStatus: 'pending' | 'approved' | 'rejected'
  kycSubmittedAt?: string
  kycRejectionReason?: string
}

export default function PartnerKYCPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectPartnerId, setRejectPartnerId] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/mobile/partners/kyc')
      const data = await response.json()
      if (data.success) {
        setPartners(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (partnerId: string) => {
    try {
      const response = await fetch(`/api/mobile/partners/kyc/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      })
      if (response.ok) {
        setToast({ show: true, message: 'KYC approved successfully!', type: 'success' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
        fetchPartners()
      } else {
        setToast({ show: true, message: 'Failed to approve KYC', type: 'error' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
      }
    } catch (error) {
      console.error('Failed to approve:', error)
      setToast({ show: true, message: 'Failed to approve KYC', type: 'error' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
    }
  }

  const handleReject = async (reason: string) => {
    try {
      const response = await fetch(`/api/mobile/partners/kyc/${rejectPartnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason })
      })
      if (response.ok) {
        setToast({ show: true, message: 'KYC rejected successfully!', type: 'success' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
        setShowRejectModal(false)
        fetchPartners()
      } else {
        setToast({ show: true, message: 'Failed to reject KYC', type: 'error' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
      }
    } catch (error) {
      console.error('Failed to reject:', error)
      setToast({ show: true, message: 'Failed to reject KYC', type: 'error' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
    }
  }

  const handleDelete = async () => {
    if (selectedPartners.length === 0) return
    if (!confirm(`Delete ${selectedPartners.length} partner(s) from database?`)) return
    
    try {
      const response = await fetch('/api/mobile/partners/kyc/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPartners })
      })
      if (response.ok) {
        setToast({ show: true, message: `${selectedPartners.length} partner(s) deleted successfully!`, type: 'success' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
        setSelectedPartners([])
        fetchPartners()
      } else {
        setToast({ show: true, message: 'Failed to delete partners', type: 'error' })
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      setToast({ show: true, message: 'Failed to delete partners', type: 'error' })
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedPartners(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedPartners.length === filteredPartners.length) {
      setSelectedPartners([])
    } else {
      setSelectedPartners(filteredPartners.map(p => p._id))
    }
  }

  const filteredPartners = partners.filter(p => 
    filter === 'all' ? true : p.kycStatus === filter
  )

  return (
    <ResponsiveLayout activePage="Partner KYC" title="Partner KYC Verification">
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: filter === status ? '#2563eb' : 'white',
                  color: filter === status ? 'white' : '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
          {selectedPartners.length > 0 && (
            <button
              onClick={handleDelete}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Delete Selected ({selectedPartners.length})
            </button>
          )}
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1rem',
            display: 'grid',
            gridTemplateColumns: '50px 1fr 1.5fr 1.5fr 1.5fr 1fr 2fr',
            gap: '1rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#6b7280',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div>
              <input
                type="checkbox"
                checked={selectedPartners.length === filteredPartners.length && filteredPartners.length > 0}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
            </div>
            <div>Partner ID</div>
            <div>Name</div>
            <div>Mobile</div>
            <div>Submitted Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
          ) : filteredPartners.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No partners found</div>
          ) : (
            filteredPartners.map((partner, index) => (
              <div
                key={partner._id}
                style={{
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 1.5fr 1.5fr 1.5fr 1fr 2fr',
                  gap: '1rem',
                  borderBottom: index < filteredPartners.length - 1 ? '1px solid #f3f4f6' : 'none',
                  fontSize: '0.9rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedPartners.includes(partner._id)}
                    onChange={() => toggleSelect(partner._id)}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </div>
                <div>#{partner._id.slice(-6)}</div>
                <div>{partner.name}</div>
                <div>{partner.mobile}</div>
                <div>{partner.kycSubmittedAt ? new Date(partner.kycSubmittedAt).toLocaleDateString() : '-'}</div>
                <div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: 
                      partner.kycStatus === 'approved' ? '#dcfce7' :
                      partner.kycStatus === 'rejected' ? '#fee2e2' : '#fef3c7',
                    color:
                      partner.kycStatus === 'approved' ? '#16a34a' :
                      partner.kycStatus === 'rejected' ? '#dc2626' : '#ca8a04'
                  }}>
                    {partner.kycStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => window.location.href = `/admin/partner-kyc/${partner._id}`}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                  {partner.kycStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(partner._id)}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setRejectPartnerId(partner._id)
                          setShowRejectModal(true)
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showRejectModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Reject KYC</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleReject(formData.get('reason') as string)
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Rejection Reason</label>
                  <textarea name="reason" required rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowRejectModal(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ show: false, message: '', type: '' })} style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0 0.25rem'
            }}>×</button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}
