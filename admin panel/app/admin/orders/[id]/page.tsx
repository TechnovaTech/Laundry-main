'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

export default function OrderDetails() {
  const params = useParams()
  const orderId = params.id
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResponsiveLayout activePage="Orders" title={`Order #${orderId}`} searchPlaceholder="Search...">

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading order details...
            </div>
          ) : !order ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Order not found
            </div>
          ) : (
          <div>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Update Status
            </button>
            <button style={{
              backgroundColor: 'white',
              color: '#2563eb',
              border: '2px solid #2563eb',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Cancel Order
            </button>
          </div>

          {/* Customer Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Customer Info</h3>
                <div style={{ color: '#374151', lineHeight: '1.6' }}>
                  <div><strong>Name:</strong> {order?.customerId?.name || 'N/A'}</div>
                  <div><strong>Mobile:</strong> {order?.customerId?.mobile || 'N/A'}</div>
                  <div><strong>Address:</strong> {order?.pickupAddress ? `${order.pickupAddress.street}, ${order.pickupAddress.city}, ${order.pickupAddress.state} - ${order.pickupAddress.pincode}` : 'N/A'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#2563eb', cursor: 'pointer', fontSize: '0.9rem' }}>View Customer Profile</span>
                <span style={{ color: '#2563eb', fontSize: '1.2rem', cursor: 'pointer' }}>📞</span>
              </div>
            </div>
          </div>

          {/* Items in Order */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Items in Order</h3>
            {order?.items?.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{item.quantity} {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            )) || <div>No items found</div>}
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#2563eb' }}>
              <span>Total: ₹{order?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Assigned Partner */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Assigned Partner</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Partner Name:</strong> {order?.partnerId?.name || 'Not Assigned'} {order?.partnerId?._id ? `(#${order.partnerId._id.slice(-4)})` : ''}
                </div>
              </div>
              <span style={{ color: order?.partnerId ? '#10b981' : '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                {order?.partnerId ? 'Assigned' : 'Not Assigned'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Reassign Partner
              </button>
              <button style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                View Partner Profile
              </button>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Order Status Timeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div><strong>Order Placed</strong></div>
              <div style={{ color: '#6b7280' }}>15 Sep, 8:00 AM</div>
              <div><strong>Picked Up</strong></div>
              <div style={{ color: '#6b7280' }}>15 Sep, 11:00 AM</div>
              <div><strong>Reached Hub</strong></div>
              <div style={{ color: '#6b7280' }}>15 Sep, 2:00 PM</div>
              <div><strong>Out for Delivery</strong></div>
              <div style={{ color: '#6b7280' }}>16 Sep, 10:00 AM</div>
              <div><strong>Delivered</strong></div>
              <div style={{ color: '#6b7280' }}>16 Sep, 5:20 PM</div>
            </div>
          </div>

          {/* Notes & Issues */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Notes & Issues</h3>
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>Note log</div>
            <textarea
              placeholder="Add a note..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
                marginBottom: '1rem',
                fontFamily: 'inherit'
              }}
            />
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}>
              Add Note
            </button>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Download Invoice (PDF)
            </button>
            <button style={{
              backgroundColor: 'white',
              color: '#2563eb',
              border: '2px solid #2563eb',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Print Slip
            </button>
          </div>
          </div>
          )}
        </div>
    </ResponsiveLayout>
  )
}