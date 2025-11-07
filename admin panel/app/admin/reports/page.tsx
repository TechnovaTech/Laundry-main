'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function ReportsPage() {
  const [data, setData] = useState<{
    stats: { totalOrders: number; totalRevenue: number; activePartners: number; avgDeliveryTime: string };
    ordersTrend: any[];
    revenueByDay: any[];
    partnerPerformance: any[];
    loyaltyData: { redemptionRate: number };
  }>({
    stats: { totalOrders: 0, totalRevenue: 0, activePartners: 0, avgDeliveryTime: '0 mins' },
    ordersTrend: [],
    revenueByDay: [],
    partnerPerformance: [],
    loyaltyData: { redemptionRate: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      const response = await fetch('/api/reports')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderOrdersTrend = () => {
    if (loading || !data.ordersTrend.length) {
      return <div style={{ padding: '80px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
    }
    
    const maxOrders = Math.max(...data.ordersTrend.map(d => d.count))
    const points = data.ordersTrend.map((d, i) => {
      const x = 30 + (i * 50)
      const y = 180 - (d.count / maxOrders) * 140
      return `${x},${y}`
    }).join(' ')
    
    return (
      <svg width="100%" height="200" viewBox="0 0 400 200">
        <line x1="30" y1="180" x2="370" y2="180" stroke="#000" strokeWidth="2"/>
        <line x1="30" y1="20" x2="30" y2="180" stroke="#000" strokeWidth="2"/>
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="3"/>
      </svg>
    )
  }

  const renderRevenueByDay = () => {
    if (loading || !data.revenueByDay.length) {
      return <div style={{ padding: '80px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
    }
    
    const maxRevenue = Math.max(...data.revenueByDay.map(d => d.revenue))
    
    return (
      <svg width="100%" height="200" viewBox="0 0 400 200">
        <line x1="30" y1="180" x2="370" y2="180" stroke="#000" strokeWidth="1"/>
        {data.revenueByDay.map((d, i) => {
          const height = (d.revenue / maxRevenue) * 140
          const x = 40 + (i * 45)
          return (
            <rect key={i} x={x} y={180 - height} width="25" height={height} fill="#2563eb"/>
          )
        })}
      </svg>
    )
  }

  const renderPartnerPerformance = () => {
    if (loading || !data.partnerPerformance.length) {
      return <div style={{ padding: '80px', textAlign: 'center', color: '#6b7280' }}>No partner data</div>
    }
    
    const maxDeliveries = Math.max(...data.partnerPerformance.map(p => p.deliveries))
    
    return (
      <svg width="100%" height="200" viewBox="0 0 400 200">
        <line x1="30" y1="20" x2="30" y2="180" stroke="#000" strokeWidth="1"/>
        {data.partnerPerformance.map((partner, i) => {
          const width = (partner.deliveries / maxDeliveries) * 300
          const y = 20 + (i * 25)
          return (
            <rect key={i} x="30" y={y} width={width} height="15" fill="#2563eb"/>
          )
        })}
      </svg>
    )
  }
  return (
    <ResponsiveLayout activePage="Reports" title="Reports & Analytics">
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none' }}>
            <option>Today</option>
          </select>
          <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>Download PDF/CSV</button>
        </div>
      </div>
        
        <div style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{loading ? '...' : data.stats.totalOrders.toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Revenue</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{loading ? '...' : `₹${data.stats.totalRevenue.toLocaleString()}`}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Partners</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{loading ? '...' : data.stats.activePartners.toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Delivery Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{loading ? '...' : data.stats.avgDeliveryTime}</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Orders Trend</h3>
              {renderOrdersTrend()}
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Revenue by Day</h3>
              {renderRevenueByDay()}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Partner Performance</h3>
              {renderPartnerPerformance()}
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {loading ? 'Loading...' : 
                  data.partnerPerformance.length > 0 
                    ? `Top Performing Partner → ${data.partnerPerformance[0].partner?.[0]?.name || 'Partner'} (${data.partnerPerformance[0].deliveries} deliveries)`
                    : 'No partner data available'
                }
              </div>
            </div>
          </div>

          {/* Charts Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Customer Loyalty & Points</h3>
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <line x1="30" y1="180" x2="370" y2="180" stroke="#000" strokeWidth="1"/>
                <rect x="40" y="140" width="25" height="40" fill="#2563eb"/>
                <rect x="40" y="120" width="25" height="20" fill="#9ca3af"/>
                <rect x="80" y="130" width="25" height="50" fill="#2563eb"/>
                <rect x="80" y="110" width="25" height="20" fill="#9ca3af"/>
                <rect x="120" y="80" width="25" height="100" fill="#2563eb"/>
                <rect x="120" y="60" width="25" height="20" fill="#9ca3af"/>
                <rect x="160" y="40" width="25" height="140" fill="#2563eb"/>
                <rect x="160" y="20" width="25" height="20" fill="#9ca3af"/>
                <rect x="200" y="90" width="25" height="90" fill="#2563eb"/>
                <rect x="200" y="70" width="25" height="20" fill="#9ca3af"/>
                <rect x="240" y="50" width="25" height="130" fill="#2563eb"/>
                <rect x="240" y="30" width="25" height="20" fill="#9ca3af"/>
                <rect x="280" y="30" width="25" height="150" fill="#2563eb"/>
                <rect x="280" y="10" width="25" height="20" fill="#9ca3af"/>
              </svg>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{loading ? 'Loading...' : `${data.loyaltyData.redemptionRate}% of points redeemed`}</div>
            </div>
          </div>

          {/* Export Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Export PDF</button>
            <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Export CSV</button>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'right', color: '#6b7280', fontSize: '0.9rem' }}>
            Updated: 16 Sep, 10:45 AM
          </div>
      </div>
    </ResponsiveLayout>
  )
}