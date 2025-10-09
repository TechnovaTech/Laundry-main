'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const statusFilters = [
    { label: 'All', active: true },
    { label: 'New', active: false },
    { label: 'Picked Up', active: false },
    { label: 'At Hub', active: false },
    { label: 'Out for Delivery', active: false },
    { label: 'Delivered', active: false },
    { label: 'Cancelled', active: false }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatOrderForDisplay = (order: any) => {
    return {
      id: order.orderId,
      customer: order.customerId?.name || 'Unknown Customer',
      items: order.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items',
      price: `₹${order.totalAmount}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      partner: order.partnerId?.name || 'Not Assigned',
      time: order.pickupSlot?.timeSlot || 'Not Scheduled'
    }
  }

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
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No orders found
              </div>
            ) : orders.map((dbOrder, index) => {
              const order = formatOrderForDisplay(dbOrder)
              return (
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
                <div onClick={(e) => e.stopPropagation()}>
                  {dbOrder.status === 'delivered_to_hub' ? (
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/orders/${dbOrder._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            status: 'ready',
                            hubApprovedAt: new Date().toISOString()
                          })
                        });
                        if (response.ok) fetchOrders();
                      }}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      APPROVE
                    </button>
                  ) : dbOrder.status === 'ready' ? (
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/orders/${dbOrder._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'processing' })
                        });
                        if (response.ok) fetchOrders();
                      }}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      IN PROGRESS
                    </button>
                  ) : dbOrder.status === 'processing' ? (
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/orders/${dbOrder._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            status: 'ironing',
                            ironingAt: new Date().toISOString()
                          })
                        });
                        if (response.ok) fetchOrders();
                      }}
                      style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      IRONING
                    </button>
                  ) : dbOrder.status === 'ironing' ? (
                    <button
                      onClick={async () => {
                        const response = await fetch(`/api/orders/${dbOrder._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            status: 'process_completed',
                            processCompletedAt: new Date().toISOString()
                          })
                        });
                        if (response.ok) fetchOrders();
                      }}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      COMPLETED
                    </button>
                  ) : dbOrder.status === 'process_completed' ? (
                    <span style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      COMPLETED
                    </span>
                  ) : (
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          const response = await fetch(`/api/orders/${dbOrder._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'cancelled' })
                          });
                          if (response.ok) fetchOrders();
                        }
                      }}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      CANCEL ORDER
                    </button>
                  )}
                </div>
              </div>
            )})}
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