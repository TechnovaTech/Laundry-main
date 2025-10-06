'use client'

import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function DeliveryPartnersPage() {
  const partners = [
    {
      id: '#P1001',
      name: 'Rajesh Kumar',
      mobile: '+91 9876543210',
      totalDeliveries: '320',
      earnings: '₹25,500',
      status: 'active'
    },
    {
      id: '#P1002',
      name: 'Anjali Singh',
      mobile: '+91 9876543211',
      totalDeliveries: '150',
      earnings: '₹12,000',
      status: 'inactive'
    },
    {
      id: '#P1003',
      name: 'Mohammad Ali',
      mobile: '+91 9876543212',
      totalDeliveries: '50',
      earnings: '₹5,000',
      status: 'inactive'
    }
  ]

  return (
    <ResponsiveLayout activePage="Delivery Partners" title="Delivery Partners" searchPlaceholder="Search by Name / Partner ID">
        
        {/* Delivery Partners Content */}
        <div style={{ padding: '1.5rem' }}>
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
            {partners.map((partner, index) => (
              <div
                key={index}
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
                <div style={{ fontWeight: '500' }}>{partner.id}</div>
                <div>{partner.name}</div>
                <div>{partner.mobile}</div>
                <div>{partner.totalDeliveries}</div>
                <div>{partner.earnings}</div>
                <div>
                  <div style={{
                    width: '50px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: partner.status === 'active' ? '#2563eb' : '#d1d5db',
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
                      left: partner.status === 'active' ? '28px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            ))}
          </div>

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
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>1,240</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Today</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>380</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Blocked</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>15</div>
            </div>
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