'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../../components/ResponsiveLayout'

export default function OrderDetails() {
  const params = useParams()
  const orderId = params.id
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundCalculation, setRefundCalculation] = useState<any>(null)

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
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {(order?.status === 'cancelled' || order?.status === 'delivery_failed') && !order?.refunded && (
              <button 
                onClick={async () => {
                  try {
                    const customerRes = await fetch(`/api/customers/${order.customerId._id}`);
                    const customerData = await customerRes.json();
                    
                    if (customerData.success) {
                      const customer = customerData.data;
                      const orderAmount = order.totalAmount || 0;
                      const chargeAmount = order.cancellationFee || order.deliveryFailureFee || 0;
                      const currentDue = customer.dueAmount || 0;
                      const currentWallet = customer.walletBalance || 0;
                      
                      let refundAmount = orderAmount;
                      let newDue = currentDue;
                      let dueCleared = 0;
                      
                      if (currentDue > 0) {
                        dueCleared = Math.min(currentDue, chargeAmount);
                        newDue = currentDue - dueCleared;
                        refundAmount = orderAmount - (chargeAmount - dueCleared);
                      }
                      
                      const newWallet = currentWallet + refundAmount;
                      
                      setRefundCalculation({
                        customer,
                        orderAmount,
                        chargeAmount,
                        currentDue,
                        currentWallet,
                        dueCleared,
                        newDue,
                        refundAmount,
                        newWallet
                      });
                      setShowRefundModal(true);
                    }
                  } catch (error) {
                    alert('Failed to calculate refund. Please try again.');
                  }
                }}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                💰 Confirm Refund
              </button>
            )}
            {order?.refunded && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ✓ Refunded ₹{order.refundAmount || order.totalAmount}
              </div>
            )}
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to cancel this order?')) {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'cancelled' })
                  });
                  if (response.ok) window.location.reload();
                }
              }}
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel Order
            </button>
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to DELETE this order? This action cannot be undone.')) {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    alert('Order deleted successfully');
                    window.location.href = '/admin/orders';
                  }
                }
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Delete Order
            </button>
            <button 
              onClick={() => window.location.href = `tel:${order?.customerId?.mobile}`}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📞 Call Customer
            </button>
            <button 
              onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${order?.customerId?.email}`, '_blank')}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ✉️ Email Customer
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/${order?.customerId?.mobile?.replace(/[^0-9]/g, '')}`, '_blank')}
              style={{
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              💬 WhatsApp Customer
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

          {/* Payment Information */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Payment Information</h3>
            <div style={{ color: '#374151', lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Payment Method:</strong>
                <span>{order?.paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Payment Status:</strong>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  backgroundColor: order?.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                  color: order?.paymentStatus === 'paid' ? '#166534' : '#92400e'
                }}>
                  {order?.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                </span>
              </div>
              {order?.razorpayPaymentId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>Payment ID:</strong>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{order.razorpayPaymentId}</span>
                </div>
              )}
              {order?.razorpayOrderId && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Order ID:</strong>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{order.razorpayOrderId}</span>
                </div>
              )}
            </div>
            
            {/* Customer Payment Methods */}
            {order?.customerId?.paymentMethods && order.customerId.paymentMethods.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#6b7280' }}>Customer's Saved Payment Methods</h4>
                {order.customerId.paymentMethods.map((pm: any, index: number) => (
                  <div key={index} style={{ 
                    padding: '0.75rem', 
                    backgroundColor: pm.isPrimary ? '#eff6ff' : '#f9fafb', 
                    borderRadius: '8px', 
                    marginBottom: '0.5rem',
                    border: pm.isPrimary ? '1px solid #2563eb' : '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                          {pm.type} {pm.isPrimary && <span style={{ color: '#2563eb', fontSize: '0.8rem' }}>(Primary)</span>}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {pm.type === 'UPI' && pm.upiId && `UPI: ${pm.upiId}`}
                          {pm.type === 'Card' && pm.cardNumber && `Card: ****${pm.cardNumber.slice(-4)} | ${pm.cardHolder}`}
                          {pm.type === 'Bank Transfer' && pm.accountNumber && `${pm.bankName} - ****${pm.accountNumber.slice(-4)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                {order?.partnerId?.mobile && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Mobile:</strong> {order.partnerId.mobile}
                  </div>
                )}
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
              {order?.partnerId && (
                <button 
                  onClick={() => window.location.href = `/admin/delivery-partners/${order.partnerId._id}`}
                  style={{
                    backgroundColor: 'white',
                    color: '#2563eb',
                    border: '2px solid #2563eb',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  View Partner Profile
                </button>
              )}
            </div>
          </div>

          {/* Hub Delivery Approval */}
          {order?.status === 'delivered_to_hub' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Hub Delivery Approval</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Order has been delivered to hub. Please approve or cancel.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={async () => {
                    const response = await fetch(`/api/orders/${order._id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        status: 'ready',
                        hubApprovedAt: new Date().toISOString()
                      })
                    });
                    if (response.ok) window.location.reload();
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to cancel this order?')) {
                      const response = await fetch(`/api/orders/${order._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'cancelled' })
                      });
                      if (response.ok) window.location.reload();
                    }
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  ✗ Cancel Order
                </button>
              </div>
            </div>
          )}

          {/* Ready to Process */}
          {order?.status === 'ready' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Ready to Process</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Order is ready. Click below to start processing.</p>
              <button
                onClick={async () => {
                  const response = await fetch(`/api/orders/${order._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'processing' })
                  });
                  if (response.ok) window.location.reload();
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Start Processing
              </button>
            </div>
          )}

          {/* Delivery Failure */}
          {order?.status === 'delivery_failed' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '2px solid #ef4444'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#ef4444' }}>⚠ Delivery Failed</h3>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <p style={{ color: '#374151' }}><strong>Reason:</strong> {order.deliveryFailureReason || 'Not specified'}</p>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Failed on: {order.deliveryFailedAt ? new Date(order.deliveryFailedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveryFailedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
              </p>
            </div>
          )}

          {/* Reported Issue */}
          {order?.issue && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '2px solid #ef4444'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#ef4444' }}>⚠ Reported Issue</h3>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <p style={{ color: '#374151' }}>{order.issue}</p>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Reported on: {order.issueReportedAt ? new Date(order.issueReportedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.issueReportedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
              </p>
            </div>
          )}

          {/* Pickup Photos */}
          {order?.pickupPhotos && order.pickupPhotos.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Pickup Photos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {order.pickupPhotos.map((photo: string, index: number) => (
                  <img 
                    key={index} 
                    src={photo} 
                    alt={`Pickup ${index + 1}`} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => window.open(photo, '_blank')}
                  />
                ))}
              </div>
              {order?.pickupNotes && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  <strong>Partner Notes:</strong> {order.pickupNotes}
                </div>
              )}
            </div>
          )}

          {/* Order Status Timeline */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Order Status Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontWeight: '600' }}>Order Placed</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Reached Location</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.reachedLocationAt ? new Date(order.reachedLocationAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.reachedLocationAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Picked Up</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.pickedUpAt ? new Date(order.pickedUpAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.pickedUpAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Delivered to Hub</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.deliveredToHubAt ? new Date(order.deliveredToHubAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredToHubAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Processing</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.hubApprovedAt ? new Date(order.hubApprovedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.hubApprovedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Ironing</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.ironingAt ? new Date(order.ironingAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.ironingAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Process Completed</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.processCompletedAt ? new Date(order.processCompletedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.processCompletedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{order?.redeliveryScheduled ? 'Out for Redelivery' : 'Out for Delivery'}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.redeliveryScheduled && order?.outForRedeliveryAt ? new Date(order.outForRedeliveryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.outForRedeliveryAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : order?.outForDeliveryAt ? new Date(order.outForDeliveryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.outForDeliveryAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{order?.redeliveryScheduled && order?.status === 'delivered' ? 'Redelivered Successfully' : 'Delivered'}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {order?.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveredAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Pending'}
                </div>
              </div>
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
            <button 
              onClick={async () => {
                const jsPDF = (await import('jspdf')).default;
                const doc = new jsPDF('p', 'mm', 'a4');
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                let hubAddress = {
                  name: 'Urban Steam',
                  address: '#7/4B, 1st Cross, 5th Main Road,',
                  address2: 'Manjunatha Layout, R T Nagar Post, near',
                  address3: 'Mamtha School, Bengaluru - 560032',
                  email: 'support@urbansteam.in',
                  gst: '29ACLFAA519M1ZW'
                };
                
                if (order.assignedHub) {
                  try {
                    const response = await fetch(`/api/hubs/${order.assignedHub}`);
                    const data = await response.json();
                    if (data.success && data.data) {
                      const hub = data.data;
                      hubAddress = {
                        name: hub.name || 'Urban Steam',
                        address: hub.address || hubAddress.address,
                        address2: hub.address2 || hubAddress.address2,
                        address3: hub.city ? `${hub.city} - ${hub.pincode}` : hubAddress.address3,
                        email: hub.email || hubAddress.email,
                        gst: hub.gstNumber || hubAddress.gst
                      };
                    }
                  } catch (error) {
                    console.log('Using default hub address');
                  }
                }
                
                doc.setFillColor(245, 245, 245);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
                doc.setFillColor(255, 255, 255);
                doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'F');
                
                doc.addImage('/assets/ACS LOGO.png', 'PNG', 15, 15, 35, 15);
                doc.addImage('/assets/LOGO MARK GRADIENT.png', 'PNG', pageWidth - 55, 15, 40, 15);
                doc.setTextColor(0, 0, 0);
                
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.rect(15, 35, pageWidth - 30, 25);
                
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text('ORIGINAL FOR RECIPIENT', 17, 41);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('TAX INVOICE', 17, 51);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 100, 100);
                doc.text(`#${order.orderId || 'N/A'}`, 17, 57);
                doc.setTextColor(0, 0, 0);
                
                const sectionY = 65;
                const sectionHeight = 45;
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.rect(15, sectionY, 50, sectionHeight);
                doc.rect(70, sectionY, 65, sectionHeight);
                doc.rect(140, sectionY, pageWidth - 155, sectionHeight);
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Issued', 17, sectionY + 7);
                doc.setFont('helvetica', 'normal');
                doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 13);
                doc.setFont('helvetica', 'bold');
                doc.text('Due', 17, sectionY + 23);
                doc.setFont('helvetica', 'normal');
                doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 29);
                
                doc.setFont('helvetica', 'bold');
                doc.text('Billed to', 72, sectionY + 7);
                doc.setFont('helvetica', 'normal');
                doc.text(order.customerId?.name || 'Customer Name', 72, sectionY + 13);
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(8);
                const address = doc.splitTextToSize(order.pickupAddress?.street || 'Customer address', 60);
                doc.text(address, 72, sectionY + 18);
                doc.text(`${order.pickupAddress?.city || 'City'}, ${order.pickupAddress?.state || 'Country'} - ${order.pickupAddress?.pincode || '000000'}`, 72, sectionY + 23);
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(9);
                doc.text('Contact Number', 72, sectionY + 33);
                doc.text('Order Id', 72, sectionY + 38);
                
                doc.setFont('helvetica', 'bold');
                doc.text('From', 142, sectionY + 7);
                doc.setFont('helvetica', 'normal');
                doc.text(hubAddress.name, 142, sectionY + 13);
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(8);
                doc.text('Address', 142, sectionY + 18);
                const hubAddr = doc.splitTextToSize(`${hubAddress.address} ${hubAddress.address2} ${hubAddress.address3}`, 55);
                doc.text(hubAddr, 142, sectionY + 22);
                doc.setFontSize(9);
                doc.text(`Email Id :${hubAddress.email}`, 142, sectionY + 34);
                doc.text(`GST No: ${hubAddress.gst}`, 142, sectionY + 39);
                doc.setTextColor(0, 0, 0);
                
                let yPos = 115;
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.setFillColor(240, 240, 240);
                doc.rect(15, yPos, pageWidth - 30, 8, 'FD');
                yPos += 6;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Service', 17, yPos);
                doc.text('Qty', 130, yPos);
                doc.text('Rate', 155, yPos);
                doc.text('Total', 180, yPos);
                
                yPos += 8;
                doc.setFont('helvetica', 'normal');
                let subtotal = 0;
                
                if (order.items && order.items.length > 0) {
                  order.items.forEach((item: any) => {
                    const itemTotal = (item.quantity || 0) * (item.price || 0);
                    subtotal += itemTotal;
                    doc.setFont('helvetica', 'bold');
                    doc.text(item.name || 'Service name', 17, yPos);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(8);
                    doc.text(item.description || 'Description', 17, yPos + 4);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(9);
                    doc.text(String(item.quantity || 0), 130, yPos);
                    doc.text(`Rs${(item.price || 0).toFixed(2)}`, 155, yPos);
                    doc.text(`Rs${itemTotal.toFixed(2)}`, 180, yPos);
                    yPos += 12;
                  });
                }
                
                if (order.cancellationFee && order.cancellationFee > 0) {
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(220, 38, 38);
                  doc.text('Cancellation fees Applied', 17, yPos);
                  doc.setFont('helvetica', 'normal');
                  doc.setTextColor(100, 100, 100);
                  doc.setFontSize(8);
                  doc.text(order.cancellationReason || 'Cancellation charge', 17, yPos + 4);
                  doc.setTextColor(0, 0, 0);
                  doc.setFontSize(9);
                  doc.text(`Rs${order.cancellationFee.toFixed(2)}`, 180, yPos);
                  subtotal += order.cancellationFee;
                  yPos += 12;
                }
                
                yPos += 15;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text('Subtotal', 140, yPos);
                doc.text(`Rs${subtotal.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
                yPos += 7;
                doc.text('Tax (0%)', 140, yPos);
                doc.text('Rs0.00', pageWidth - 20, yPos, { align: 'right' });
                yPos += 7;
                const discountPercent = order.discount || 0;
                doc.text('Discount/Coupon code', 140, yPos);
                doc.text(`${discountPercent}%`, pageWidth - 20, yPos, { align: 'right' });
                yPos += 7;
                yPos += 5;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text('Total', 140, yPos);
                doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
                yPos += 10;
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 200);
                doc.text('Amount due', 140, yPos);
                doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                
                yPos += 20;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text('Thank you for choosing Urban Steam', 20, yPos);
                doc.setFontSize(7);
                doc.setTextColor(100, 100, 100);
                doc.text('Incase of any issues contact support@urbansteam.in within 24 hours of delivery', 20, yPos + 5);
                
                doc.save(`Invoice-${order.orderId || 'order'}.pdf`);
              }}
              style={{
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

          {/* Refund Modal */}
          {showRefundModal && refundCalculation && (
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }} onClick={() => setShowRefundModal(false)}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#10b981' }}>💰 Refund Confirmation</h2>
                
                {/* Order Details */}
                <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Order Details</h3>
                  <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Order ID:</span>
                      <strong>#{order.orderId}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Customer:</span>
                      <strong>{refundCalculation.customer.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <span>Items:</span>
                      <span>{order.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#2563eb' }}>
                      <span>Order Amount:</span>
                      <span>₹{refundCalculation.orderAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Charges */}
                {refundCalculation.chargeAmount > 0 && (
                  <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#dc2626' }}>Charges Applied</h3>
                    <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{order.status === 'cancelled' ? 'Cancellation Fee' : 'Delivery Failure Fee'}:</span>
                        <strong style={{ color: '#dc2626' }}>₹{refundCalculation.chargeAmount}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wallet & Due Status */}
                <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#2563eb' }}>Current Wallet Status</h3>
                  <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Current Wallet Balance:</span>
                      <strong>₹{refundCalculation.currentWallet}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Current Due Amount:</span>
                      <strong style={{ color: refundCalculation.currentDue > 0 ? '#dc2626' : '#10b981' }}>₹{refundCalculation.currentDue}</strong>
                    </div>
                  </div>
                </div>

                {/* Refund Calculation */}
                <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '2px solid #10b981' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#166534' }}>Refund Breakdown</h3>
                  <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8' }}>
                    {refundCalculation.dueCleared > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                        <span>✓ Due Cleared:</span>
                        <strong>₹{refundCalculation.dueCleared}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', color: '#166534', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #86efac' }}>
                      <span>Amount to Credit:</span>
                      <span>₹{refundCalculation.refundAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span>New Wallet Balance:</span>
                      <strong style={{ color: '#10b981' }}>₹{refundCalculation.newWallet}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>New Due Amount:</span>
                      <strong style={{ color: refundCalculation.newDue > 0 ? '#dc2626' : '#10b981' }}>₹{refundCalculation.newDue}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setShowRefundModal(false)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: 'white'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const updateRes = await fetch(`/api/customers/${order.customerId._id}/adjust`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            walletBalance: refundCalculation.newWallet,
                            dueAmount: refundCalculation.newDue,
                            reason: `Refund for order #${order.orderId}`,
                            action: 'refund'
                          })
                        });
                        
                        await fetch(`/api/orders/${order._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            refunded: true,
                            refundedAt: new Date().toISOString(),
                            refundAmount: refundCalculation.refundAmount
                          })
                        });
                        
                        if (updateRes.ok) {
                          alert(`Refund successful! ₹${refundCalculation.refundAmount} credited to wallet.`);
                          window.location.reload();
                        }
                      } catch (error) {
                        alert('Refund failed. Please try again.');
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: '#10b981',
                      color: 'white'
                    }}
                  >
                    ✓ Confirm Refund
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </ResponsiveLayout>
  )
}