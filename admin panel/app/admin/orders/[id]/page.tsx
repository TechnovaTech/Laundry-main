'use client'

import { useParams } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'

export default function OrderDetails() {
  const params = useParams()
  const orderId = params.id

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Sidebar activePage="Orders" />
      <div style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <Header title={`Order #${orderId}`} searchPlaceholder="Search..." />

        <div style={{ padding: '1.5rem' }}>
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
                  <div><strong>Name:</strong> John Doe</div>
                  <div><strong>Mobile:</strong> 9876543210</div>
                  <div><strong>Address:</strong> 123, Elm Street, NY</div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>3 Shirts</span>
              <span>₹90</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>1 Bedsheet</span>
              <span>₹60</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#2563eb' }}>
              <span>Total: ₹150</span>
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
                  <strong>Partner Name:</strong> Rajesh Kumar (#P10)
                </div>
              </div>
              <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '500' }}>Online</span>
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
      </div>
    </div>
  )
}