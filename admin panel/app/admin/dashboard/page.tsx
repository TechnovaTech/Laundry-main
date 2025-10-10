'use client'

import { useEffect, useState } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    activeDeliveries: 0,
    completedOrders: 0,
    revenueToday: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch('http://localhost:3000/api/orders')
      const ordersData = await ordersRes.json()
      
      if (ordersData.success) {
        const orders = ordersData.data
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Calculate stats
        const ordersToday = orders.filter((o: any) => new Date(o.createdAt) >= today).length
        const activeDeliveries = orders.filter((o: any) => 
          ['pending', 'picked_up', 'processing', 'out_for_delivery'].includes(o.status)
        ).length
        const completedOrders = orders.filter((o: any) => o.status === 'delivered').length
        const revenueToday = orders
          .filter((o: any) => new Date(o.createdAt) >= today)
          .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
        
        setStats({
          ordersToday,
          activeDeliveries,
          completedOrders,
          revenueToday
        })
        
        // Get recent activity
        const recent = orders
          .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
          .slice(0, 5)
          .map((o: any) => ({
            text: `Order #${o.orderId} - ${o.status}`,
            time: new Date(o.updatedAt || o.createdAt).toLocaleString()
          }))
        
        setRecentActivity(recent)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout activePage="Dashboard" title="Dashboard" searchPlaceholder="Search...">
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>Loading...</div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout activePage="Dashboard" title="Dashboard" searchPlaceholder="Search...">

        {/* Dashboard Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
            {/* Left Section - Stats Cards, Charts and Action Buttons */}
            <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.ordersToday}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Orders Today</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.activeDeliveries}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Active Deliveries</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.completedOrders}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Completed Orders</div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>₹{stats.revenueToday.toLocaleString()}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Revenue Today</div>
                </div>
              </div>


              {/* Charts Side by Side */}
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Orders Overview Chart */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Orders Overview</h3>
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(45deg, #e5f3ff 0%, #f0f9ff 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 200">
                      <polyline
                        points="50,150 80,120 110,140 140,100 170,80 200,110 230,90 260,70 290,100 320,80 350,90"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                      />
                      <polyline
                        points="50,170 80,160 110,180 140,140 170,120 200,150 230,130 260,110 290,140 320,120 350,130"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Revenue</h3>
                  <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'end',
                    gap: '8px',
                    padding: '1rem 0'
                  }}>
                    {[30, 20, 60, 80, 70, 90, 100].map((height, index) => (
                      <div key={index} style={{
                        flex: 1,
                        height: `${height}%`,
                        backgroundColor: index % 2 === 0 ? '#2563eb' : '#94a3b8',
                        borderRadius: '4px 4px 0 0'
                      }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Manage Orders
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Assign Delivery Partner
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <button style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    Update Pricing
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div style={{ flex: '1', minWidth: '300px', display: 'flex' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{activity.text}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{activity.time}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', color: '#6b7280' }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}