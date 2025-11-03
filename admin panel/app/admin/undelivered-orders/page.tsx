'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function UndeliveredOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showRedeliveryModal, setShowRedeliveryModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [redeliveryData, setRedeliveryData] = useState({
    newAddress: '',
    newTimeSlot: '',
    redeliveryDate: ''
  })
  const [showPendingModal, setShowPendingModal] = useState(false)
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [suspendedOrders, setSuspendedOrders] = useState<any[]>([])

  useEffect(() => {
    fetchUndeliveredOrders()
  }, [])

  const fetchUndeliveredOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        const undelivered = (data.data as any[]).filter((order: any) => 
          (order.status === 'delivery_failed' && !order.orderSuspended) || 
          (order.status === 'delivered_to_hub' && order.returnToHubApproved === true && order.redeliveryScheduled !== true && !order.orderSuspended)
        )
        const pending = (data.data as any[]).filter((order: any) => 
          order.status === 'process_completed' && order.redeliveryScheduled === true
        )
        const suspended = (data.data as any[]).filter((order: any) => 
          order.orderSuspended === true
        )
        setOrders(undelivered)
        setPendingOrders(pending)
        setSuspendedOrders(suspended)
      }
    } catch (error) {
      console.error('Failed to fetch undelivered orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatOrderForDisplay = (order: any) => {
    return {
      id: order.orderId,
      customer: order.customerId?.name || 'Unknown Customer',
      mobile: order.customerId?.mobile || 'N/A',
      items: order.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items',
      price: `₹${order.totalAmount}`,
      reason: (order.redeliveryScheduled ? '[REDELIVERY] ' : '') + (order.deliveryFailureReason || 'Not specified'),
      fee: `₹${order.deliveryFailureFee || 0}`,
      failedAt: order.deliveryFailedAt ? new Date(order.deliveryFailedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + new Date(order.deliveryFailedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
      partner: order.partnerId?.name || 'Not Assigned',
      address: order.deliveryAddress ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` : order.pickupAddress ? `${order.pickupAddress.street}, ${order.pickupAddress.city}` : 'N/A'
    }
  }

  return (
    <ResponsiveLayout activePage="Undelivered Orders" title="Undelivered Orders" searchPlaceholder="Search by Order ID / Customer">
        <div style={{ padding: '1.5rem' }}>
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setShowPendingModal(true)}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>📦</span>
              Pending Settlement Orders ({pendingOrders.length})
            </button>
            <button
              onClick={() => setShowSuspendedModal(true)}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span>⏸️</span>
              Suspended Orders ({suspendedOrders.length})
            </button>
          </div>
          {/* Stats Card */}
          <div style={{
            backgroundColor: '#fee2e2',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '2px solid #ef4444'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626', margin: 0 }}>
                  {orders.length}
                </h3>
                <p style={{ color: '#991b1b', fontSize: '0.9rem', margin: 0 }}>
                  Total Undelivered Orders
                </p>
              </div>
            </div>
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
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr 2fr 1fr 1.5fr 1fr 1.5fr 2fr 1.5fr 1.5fr',
              gap: '1rem',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <div>ORDER ID</div>
              <div>CUSTOMER</div>
              <div>MOBILE</div>
              <div>ITEMS</div>
              <div>PRICE</div>
              <div>FAILURE REASON</div>
              <div>FEE CHARGED</div>
              <div>FAILED AT</div>
              <div>ADDRESS</div>
              <div>PARTNER</div>
              <div>RETURN REQUEST</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading undelivered orders...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No undelivered orders found
              </div>
            ) : orders.map((dbOrder, index) => {
              const order = formatOrderForDisplay(dbOrder)
              return (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr 1fr 2fr 1fr 1.5fr 1fr 1.5fr 2fr 1.5fr 1.5fr',
                  gap: '1rem',
                  borderBottom: index < orders.length - 1 ? '1px solid #f3f4f6' : 'none',
                  fontSize: '0.9rem',
                  alignItems: 'center',
                  backgroundColor: '#fef2f2'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              >
                <div style={{ fontWeight: '500', color: '#dc2626', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.id}</div>
                <div style={{ fontWeight: '500', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.customer}</div>
                <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.mobile}</div>
                <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.items}</div>
                <div style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.price}</div>
                <div style={{ color: '#dc2626', fontWeight: '500', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.reason}</div>
                <div style={{ fontWeight: '600', color: '#dc2626', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.fee}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.failedAt}</div>
                <div style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.address}</div>
                <div style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/orders/${order.id.replace('#', '')}`)}>{order.partner}</div>
                <div onClick={(e) => e.stopPropagation()}>
                  {dbOrder.returnToHubRequested === true && dbOrder.returnToHubApproved !== true ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {dbOrder.redeliveryScheduled ? (
                        <button
                          onClick={async () => {
                            if (confirm('Suspend this order due to multiple delivery failures?')) {
                              const response = await fetch(`/api/orders/${dbOrder._id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  status: 'suspended',
                                  orderSuspended: true,
                                  suspensionReason: 'Multiple delivery failures',
                                  suspendedAt: new Date().toISOString()
                                })
                              });
                              if (response.ok) {
                                alert('Order suspended successfully');
                                fetchUndeliveredOrders();
                              }
                            }
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
                          SUSPEND ORDER
                        </button>
                      ) : null}
                      <button
                        onClick={async () => {
                          const response = await fetch(`/api/orders/${dbOrder._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              returnToHubApproved: true,
                              returnToHubApprovedAt: new Date().toISOString(),
                              status: 'delivered_to_hub',
                              deliveredToHubAt: new Date().toISOString()
                            })
                          });
                          if (response.ok) fetchUndeliveredOrders();
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
                      <button
                        onClick={async () => {
                          const response = await fetch(`/api/orders/${dbOrder._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              returnToHubRequested: false,
                              returnToHubRequestedAt: null
                            })
                          });
                          if (response.ok) fetchUndeliveredOrders();
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
                        DECLINE
                      </button>
                    </div>
                  ) : dbOrder.returnToHubApproved === true && dbOrder.status === 'delivered_to_hub' ? (
                    <button
                      onClick={() => {
                        setSelectedOrder(dbOrder);
                        setRedeliveryData({
                          newAddress: dbOrder.deliveryAddress ? `${dbOrder.deliveryAddress.street}, ${dbOrder.deliveryAddress.city}` : '',
                          newTimeSlot: '',
                          redeliveryDate: ''
                        });
                        setShowRedeliveryModal(true);
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
                      SETUP REDELIVERY
                    </button>
                  ) : (
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>No Request</span>
                  )}
                </div>
              </div>
            )})}
          </div>

          {/* Summary */}
          <div style={{
            marginTop: '1.5rem',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}>
            Showing {orders.length} undelivered order(s)
          </div>
        </div>

        {/* Pending Orders Modal */}
        {showPendingModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowPendingModal(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Pending Settlement Orders</h2>
                <button onClick={() => setShowPendingModal(false)} style={{ fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
              </div>
              {pendingOrders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No pending orders</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pendingOrders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => router.push(`/admin/orders/${order.orderId.replace('#', '')}`)}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1rem', color: '#3b82f6' }}>{order.orderId}</div>
                          <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{order.customerId?.name} • {order.customerId?.mobile}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600', fontSize: '1rem' }}>₹{order.totalAmount}</div>
                          <div style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.25rem' }}>Redelivery Scheduled</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suspended Orders Modal */}
        {showSuspendedModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowSuspendedModal(false)}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Suspended Orders</h2>
                <button onClick={() => setShowSuspendedModal(false)} style={{ fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
              </div>
              {suspendedOrders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No suspended orders</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {suspendedOrders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => router.push(`/admin/orders/${order.orderId.replace('#', '')}`)}
                      style={{
                        padding: '1rem',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#fffbeb',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '1rem', color: '#f59e0b' }}>{order.orderId}</div>
                          <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{order.customerId?.name} • {order.customerId?.mobile}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600', fontSize: '1rem' }}>₹{order.totalAmount}</div>
                          <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '0.25rem' }}>Suspended</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Redelivery Setup Modal */}
        {showRedeliveryModal && selectedOrder && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                Setup Redelivery - Order #{selectedOrder.orderId}
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Failure Reason:</p>
                <p style={{ color: '#dc2626' }}>{selectedOrder.deliveryFailureReason}</p>
              </div>

              {selectedOrder.deliveryFailureReason?.includes('Address') && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Update Delivery Address:</label>
                  <input
                    type="text"
                    value={redeliveryData.newAddress}
                    onChange={(e) => setRedeliveryData({...redeliveryData, newAddress: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Enter new delivery address"
                  />
                </div>
              )}

              {selectedOrder.deliveryFailureReason?.includes('Unavailable') && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Redelivery Date:</label>
                    <input
                      type="date"
                      value={redeliveryData.redeliveryDate}
                      onChange={(e) => setRedeliveryData({...redeliveryData, redeliveryDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Time Slot:</label>
                    <select
                      value={redeliveryData.newTimeSlot}
                      onChange={(e) => setRedeliveryData({...redeliveryData, newTimeSlot: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="">Select time slot</option>
                      <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                      <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setShowRedeliveryModal(false);
                    setSelectedOrder(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
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
                    const updateData: any = {
                      status: 'process_completed',
                      processCompletedAt: new Date().toISOString(),
                      redeliveryScheduled: true
                    };

                    if (redeliveryData.newAddress && selectedOrder.deliveryFailureReason?.includes('Address')) {
                      const [street, ...rest] = redeliveryData.newAddress.split(',');
                      updateData.deliveryAddress = {
                        ...selectedOrder.deliveryAddress,
                        street: street.trim(),
                        city: rest.join(',').trim()
                      };
                    }

                    if (redeliveryData.redeliveryDate && redeliveryData.newTimeSlot) {
                      updateData.deliverySlot = {
                        date: new Date(redeliveryData.redeliveryDate),
                        timeSlot: redeliveryData.newTimeSlot
                      };
                    }

                    const response = await fetch(`/api/orders/${selectedOrder._id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updateData)
                    });

                    if (response.ok) {
                      alert('Redelivery scheduled successfully!');
                      setShowRedeliveryModal(false);
                      setSelectedOrder(null);
                      fetchUndeliveredOrders();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                >
                  Schedule Redelivery
                </button>
              </div>
            </div>
          </div>
        )}
    </ResponsiveLayout>
  )
}
