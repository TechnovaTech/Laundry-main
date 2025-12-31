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
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    fetchReportsData()
  }, [fromDate, toDate])

  const fetchReportsData = async () => {
    try {
      let url = '/api/reports'
      if (fromDate || toDate) {
        const params = new URLSearchParams()
        if (fromDate) params.append('fromDate', fromDate)
        if (toDate) params.append('toDate', toDate)
        url += `?${params.toString()}`
      }
      const response = await fetch(url)
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
      return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <div>Loading trend data...</div>
        </div>
      )
    }
    
    const maxOrders = Math.max(...data.ordersTrend.map(d => d.count))
    const points = data.ordersTrend.map((d, i) => {
      const x = 40 + (i * (320 / (data.ordersTrend.length - 1)))
      const y = 160 - (d.count / maxOrders) * 120
      return `${x},${y}`
    }).join(' ')
    
    return (
      <div style={{ position: 'relative', height: '200px' }}>
        <svg width="100%" height="200" viewBox="0 0 400 200" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '8px' }}>
          <defs>
            <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <polyline points={`40,160 ${points} ${360},160`} fill="url(#orderGradient)" stroke="none"/>
          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
          {data.ordersTrend.map((d, i) => {
            const x = 40 + (i * (320 / (data.ordersTrend.length - 1)))
            const y = 160 - (d.count / maxOrders) * 120
            return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2"/>
          })}
        </svg>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
          📈 {data.ordersTrend.length} days
        </div>
      </div>
    )
  }

  const renderRevenueByDay = () => {
    if (loading || !data.revenueByDay.length) {
      return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div>Loading revenue data...</div>
        </div>
      )
    }
    
    const maxRevenue = Math.max(...data.revenueByDay.map(d => d.revenue))
    
    return (
      <div style={{ position: 'relative', height: '200px' }}>
        <svg width="100%" height="200" viewBox="0 0 400 200" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '8px' }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          {data.revenueByDay.map((d, i) => {
            const height = (d.revenue / maxRevenue) * 140
            const x = 40 + (i * (320 / data.revenueByDay.length))
            const width = Math.max(20, 320 / data.revenueByDay.length - 5)
            return (
              <rect key={i} x={x} y={160 - height} width={width} height={height} fill="url(#revenueGradient)" rx="2"/>
            )
          })}
        </svg>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
          💵 ₹{data.revenueByDay.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
        </div>
      </div>
    )
  }

  const renderPartnerPerformance = () => {
    if (loading || !data.partnerPerformance.length) {
      return (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚚</div>
          <div>Loading partner data...</div>
        </div>
      )
    }
    
    const maxDeliveries = Math.max(...data.partnerPerformance.map(p => p.deliveries))
    
    return (
      <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%)', borderRadius: '8px', padding: '20px' }}>
        <svg width="100%" height="160" viewBox="0 0 400 160">
          <defs>
            <linearGradient id="partnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          {data.partnerPerformance.slice(0, 6).map((partner, i) => {
            const width = (partner.deliveries / maxDeliveries) * 300
            const y = 10 + (i * 25)
            return (
              <g key={i}>
                <rect x="80" y={y} width={width} height="18" fill="url(#partnerGradient)" rx="9"/>
                <text x="5" y={y + 13} fontSize="11" fill="#6b7280" fontWeight="500">
                  {partner.partner?.[0]?.name?.substring(0, 10) || `Partner ${i + 1}`}
                </text>
                <text x={85 + width} y={y + 13} fontSize="10" fill="#8b5cf6" fontWeight="600">
                  {partner.deliveries}
                </text>
              </g>
            )
          })}
        </svg>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
          🏆 Top {data.partnerPerformance.length}
        </div>
      </div>
    )
  }

  const renderLoyaltyPoints = () => {
    const redemptionRate = data.loyaltyData.redemptionRate || 0
    const segments = [
      { label: 'Redeemed', value: redemptionRate, color: '#3b82f6' },
      { label: 'Available', value: 100 - redemptionRate, color: '#e5e7eb' }
    ]
    
    return (
      <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', borderRadius: '8px', padding: '20px' }}>
        <svg width="100%" height="160" viewBox="0 0 400 160">
          <defs>
            <linearGradient id="loyaltyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          <circle cx="200" cy="80" r="60" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
          <circle 
            cx="200" 
            cy="80" 
            r="60" 
            fill="none" 
            stroke="url(#loyaltyGradient)" 
            strokeWidth="12"
            strokeDasharray={`${(redemptionRate / 100) * 377} 377`}
            strokeLinecap="round"
            transform="rotate(-90 200 80)"
          />
          <text x="200" y="75" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#f59e0b">
            {redemptionRate}%
          </text>
          <text x="200" y="95" textAnchor="middle" fontSize="12" fill="#6b7280">
            Redeemed
          </text>
        </svg>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
          🎯 Loyalty Rate
        </div>
      </div>
    )
  }
  return (
    <ResponsiveLayout activePage="Reports" title="Reports & Analytics">
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '0.9rem'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>To:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '0.9rem'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => window.print()}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📄 Export PDF
          </button>
          <button 
            onClick={() => {
              const csvData = `Date,Orders,Revenue\n${data.ordersTrend.map(d => `${d.date},${d.count},${d.revenue || 0}`).join('\n')}`
              const blob = new Blob([csvData], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'reports.csv'
              a.click()
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📊 Export CSV
          </button>
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
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>📈 Orders Trend</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>Real-time</div>
              </div>
              {renderOrdersTrend()}
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>💰 Revenue by Day</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>Live</div>
              </div>
              {renderRevenueByDay()}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>🚚 Partner Performance</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>Updated</div>
              </div>
              {renderPartnerPerformance()}
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>🎯 Customer Loyalty & Points</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '12px' }}>Active</div>
              </div>
              {renderLoyaltyPoints()}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
              📊 Real-time analytics • Auto-refresh every 30 seconds
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}