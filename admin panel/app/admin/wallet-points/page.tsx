'use client'

import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function WalletPointsPage() {
  const customers = [
    { id: '#C1023', name: 'Sagnik Sen', walletBalance: '₹250', pointsBalance: '500 pts', lastTransaction: '16 Sep 2025, 3:45 PM' },
    { id: '#C1024', name: 'Riya Kapoor', walletBalance: '₹1,000', pointsBalance: '1,200 pts', lastTransaction: '15 Sep 2025, 1:30 PM' },
    { id: '#C1025', name: 'Amit Sharma', walletBalance: '₹150', pointsBalance: '300 pts', lastTransaction: '14 Sep 2025, 11:00 AM' }
  ]

  return (
    <ResponsiveLayout activePage="Wallet & Points" title="Wallet & Points Management" searchPlaceholder="Search by Customer ID">
        
        <div style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>₹1,25,000</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Wallet Balance in System</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>5,20,000 pts</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total Points Issued</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>3,80,000 pts</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Redeemed Points</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>850 invites</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Pending Rewards</div>
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

            {customers.map((customer, index) => (
              <div key={index} style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 2fr 2fr', gap: '1rem', borderBottom: index < customers.length - 1 ? '1px solid #f3f4f6' : 'none', fontSize: '0.9rem', alignItems: 'center' }}>
                <div style={{ fontWeight: '500' }}>{customer.id}</div>
                <div>{customer.name}</div>
                <div>{customer.walletBalance}</div>
                <div>{customer.pointsBalance}</div>
                <div>{customer.lastTransaction}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>Adjust Balance</button>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>Adjust Points</button>
                  <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>View History</button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </ResponsiveLayout>
  )
}