'use client'

import { useRouter } from 'next/navigation'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function OrdersPage() {
  const router = useRouter()

  const statusFilters = [
    { label: 'All', active: true },
    { label: 'New', active: false },
    { label: 'Picked Up', active: false },
    { label: 'At Hub', active: false },
    { label: 'Out for Delivery', active: false },
    { label: 'Delivered', active: false },
    { label: 'Cancelled', active: false }
  ]

  const orders = [
    {
      id: '#12345',
      customer: 'Sagnik Sen',
      items: '3 Shirts, 1 Bedsheet',
      price: '₹150',
      status: 'Delivered',
      partner: 'Partner #P10',
      time: '9-11 AM'
    },
    {
      id: '#12346',
      customer: 'Anika Sharma',
      items: '2 Jackets',
      price: '₹200',
      status: 'Pending',
      partner: 'Partner #P20',
      time: '1-3 PM'
    },
    {
      id: '#12347',
      customer: 'Rohit Verma',
      items: '5 Towels',
      price: '₹100',
      status: 'Cancelled',
      partner: 'Partner #P15',
      time: '5-7 PM'
    }
  ]

  return (
    <ResponsiveLayout activePage="Orders" title="Orders Management" searchPlaceholder="Search by Order ID / Customer">
        {/* Orders Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            {statusFilters.map((filter, index) => (
              <button
                key={index}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: filter.active ? 'none' : '1px solid #d1d5db',
                  backgroundColor: filter.active ? '#2563eb' : 'white',
                  color: filter.active ? 'white' : '#6b7280',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {filter.label}
              </button>
            ))}
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                marginLeft: '1rem'
              }}
            />
            <select
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option>Partner #P1</option>
            </select>
          </div>

          {/* Orders Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 2fr 1fr 1fr 1.5fr 1.5fr 1.5fr',
              gap: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <div>ORDER ID</div>
              <div>CUSTOMER NAME</div>
              <div>ITEMS</div>
              <div>PRICE</div>
              <div>STATUS</div>
              <div>DELIVERY PARTNER</div>
              <div>PICKUP TIME SLOT</div>
              <div>ACTIONS</div>
            </div>

            {/* Table Rows */}
            {orders.map((order, index) => (
              <div
                key={index}
                onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}
                style={{
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr 2fr 1fr 1fr 1.5fr 1.5fr 1.5fr',
                  gap: '1rem',
                  borderBottom: index < orders.length - 1 ? '1px solid #f3f4f6' : 'none',
                  fontSize: '0.9rem',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '500' }}>{order.id}</div>
                <div>{order.customer}</div>
                <div>{order.items}</div>
                <div>{order.price}</div>
                <div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    backgroundColor: 
                      order.status === 'Delivered' ? '#dcfce7' :
                      order.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                    color: 
                      order.status === 'Delivered' ? '#166534' :
                      order.status === 'Pending' ? '#92400e' : '#dc2626'
                  }}>
                    {order.status}
                  </span>
                </div>
                <div>{order.partner}</div>
                <div>{order.time}</div>
                <div>
                  <button style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    CANCEL ORDER
                  </button>
                </div>
              </div>
            ))}
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