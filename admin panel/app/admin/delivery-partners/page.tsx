'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

interface Partner {
  _id: string
  name: string
  mobile: string
  totalDeliveries: number
  totalEarnings: number
  isActive: boolean
  isVerified: boolean
  createdAt: string
}

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    blockedPartners: 0
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/mobile/partners')
      const data = await response.json()
      if (data.success) {
        setPartners(data.data)
        calculateStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (partnerData: Partner[]) => {
    const total = partnerData.length
    const active = partnerData.filter(p => p.isActive).length
    const blocked = partnerData.filter(p => !p.isActive).length
    setStats({ totalPartners: total, activePartners: active, blockedPartners: blocked })
  }

  return (
    <ResponsiveLayout activePage="Delivery Partners" title="Delivery Partners" searchPlaceholder="Search by Name / Partner ID">
        
        {/* Delivery Partners Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Partners</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.totalPartners}</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Today</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.activePartners}</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Blocked</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.blockedPartners}</div>
            </div>
          </div>

          {/* Filter Section */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <select
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '120px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>All</option>
            </select>
            <select
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            >
              <option>Most Deliveries</option>
              <option>Least Deliveries</option>
              <option>Highest Earnings</option>
            </select>
          </div>

          {/* Partners Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            {/* Table Header */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1.5fr 1fr 2fr',
              gap: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#6b7280',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>Partner ID</div>
              <div>Name</div>
              <div>Mobile</div>
              <div>Total Deliveries</div>
              <div>Earnings</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading partners...
              </div>
            ) : partners.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No partners found
              </div>
            ) : (
              partners.map((partner, index) => (
                <div
                  key={partner._id}
                  style={{
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1.5fr 1fr 2fr',
                    gap: '1rem',
                    borderBottom: index < partners.length - 1 ? '1px solid #f3f4f6' : 'none',
                    fontSize: '0.9rem',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>#{partner._id.slice(-6)}</div>
                  <div>{partner.name || 'Partner'}</div>
                  <div>{partner.mobile}</div>
                  <div>{partner.totalDeliveries}</div>
                  <div>₹{partner.totalEarnings}</div>
                <div>
                  <div style={{
                    width: '50px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: partner.isActive ? '#2563eb' : '#d1d5db',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: partner.isActive ? '28px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => window.location.href = `/admin/delivery-partners/${partner._id}`}
                    style={{
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textDecoration: 'underline'
                  }}>
                    View Profile
                  </button>
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textDecoration: 'underline'
                  }}>
                    Block
                  </button>
                </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem'
          }}>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Showing 1-20 of 540 orders
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Prev
              </button>
              <button style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Next
              </button>
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}