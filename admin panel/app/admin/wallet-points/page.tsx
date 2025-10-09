'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function WalletPointsPage() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({
    totalWalletBalance: 0,
    totalPoints: 0,
    totalReferrals: 0
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data)
        
        // Calculate stats
        const totalBalance = data.data.reduce((sum: number, c: any) => sum + (c.walletBalance || 0), 0)
        const totalPts = data.data.reduce((sum: number, c: any) => sum + (c.loyaltyPoints || 0), 0)
        const totalRefs = data.data.reduce((sum: number, c: any) => sum + (c.referralCodes?.filter((r: any) => r.used).length || 0), 0)
        
        setStats({
          totalWalletBalance: totalBalance,
          totalPoints: totalPts,
          totalReferrals: totalRefs
        })
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  return (
    <ResponsiveLayout activePage="Wallet & Points" title="Wallet & Points Management" searchPlaceholder="Search by Customer ID">
        
        <div style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>₹{stats.totalWalletBalance.toLocaleString()}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Wallet Balance in System</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.totalPoints.toLocaleString()} pts</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Points in System</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{customers.length}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Customers</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>{stats.totalReferrals}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Successful Referrals</div>
            </div>
          </div>

          {/* Customer Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 2fr 2fr', gap: '1rem', fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
              <div>CUSTOMER ID</div>
              <div>NAME</div>
              <div>WALLET BALANCE (₹)</div>
              <div>POINTS BALANCE</div>
              <div>LAST TRANSACTION</div>
              <div>ACTIONS</div>
            </div>

            {customers.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No customers found</div>
            ) : customers.map((customer: any, index) => (
              <div key={customer._id} style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 2fr 2fr', gap: '1rem', borderBottom: index < customers.length - 1 ? '1px solid #f3f4f6' : 'none', fontSize: '0.9rem', alignItems: 'center' }}>
                <div style={{ fontWeight: '500' }}>#{customer._id.slice(-6)}</div>
                <div>{customer.name}</div>
                <div>₹{customer.walletBalance || 0}</div>
                <div>{customer.loyaltyPoints || 0} pts</div>
                <div>{customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : 'N/A'}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Adjust Balance</button>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Adjust Points</button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </ResponsiveLayout>
  )
}