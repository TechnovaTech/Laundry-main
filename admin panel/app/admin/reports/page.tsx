'use client'

import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function ReportsPage() {
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
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>12,540</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Revenue</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>₹18,50,000</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Partners</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>1,240</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Delivery Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>38 mins</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Orders Trend</h3>
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <line x1="30" y1="180" x2="370" y2="180" stroke="#000" strokeWidth="2"/>
                <line x1="30" y1="20" x2="30" y2="180" stroke="#000" strokeWidth="2"/>
                <polyline points="30,160 70,140 110,120 150,100 190,110 230,90 270,80 310,60 350,50 390,40" fill="none" stroke="#2563eb" strokeWidth="3"/>
                <polyline points="30,170 70,150 110,135 150,115 190,125 230,105 270,95 310,75 350,65 390,55" fill="none" stroke="#9ca3af" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Revenue by Day</h3>
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <line x1="30" y1="180" x2="370" y2="180" stroke="#000" strokeWidth="1"/>
                <rect x="40" y="120" width="25" height="60" fill="#2563eb"/>
                <rect x="40" y="110" width="25" height="10" fill="#9ca3af"/>
                <rect x="80" y="100" width="25" height="80" fill="#2563eb"/>
                <rect x="80" y="90" width="25" height="10" fill="#9ca3af"/>
                <rect x="120" y="40" width="25" height="140" fill="#2563eb"/>
                <rect x="120" y="35" width="25" height="5" fill="#9ca3af"/>
                <rect x="160" y="80" width="25" height="100" fill="#2563eb"/>
                <rect x="160" y="70" width="25" height="10" fill="#9ca3af"/>
                <rect x="200" y="30" width="25" height="150" fill="#2563eb"/>
                <rect x="200" y="25" width="25" height="5" fill="#9ca3af"/>
                <rect x="240" y="90" width="25" height="90" fill="#2563eb"/>
                <rect x="240" y="80" width="25" height="10" fill="#9ca3af"/>
                <rect x="280" y="50" width="25" height="130" fill="#2563eb"/>
                <rect x="280" y="45" width="25" height="5" fill="#9ca3af"/>
              </svg>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Partner Performance</h3>
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <line x1="30" y1="20" x2="30" y2="180" stroke="#000" strokeWidth="1"/>
                <rect x="30" y="20" width="250" height="15" fill="#9ca3af"/>
                <rect x="30" y="20" width="320" height="15" fill="#2563eb"/>
                <rect x="30" y="45" width="200" height="15" fill="#9ca3af"/>
                <rect x="30" y="45" width="250" height="15" fill="#2563eb"/>
                <rect x="30" y="70" width="220" height="15" fill="#9ca3af"/>
                <rect x="30" y="70" width="300" height="15" fill="#2563eb"/>
                <rect x="30" y="95" width="100" height="15" fill="#9ca3af"/>
                <rect x="30" y="95" width="80" height="15" fill="#2563eb"/>
                <rect x="30" y="120" width="150" height="15" fill="#9ca3af"/>
                <rect x="30" y="120" width="200" height="15" fill="#2563eb"/>
              </svg>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Top Performing Partner → Partner #P204 (320 deliveries)</div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Top Order Locations</h3>
              <svg width="100%" height="200" viewBox="0 0 400 200">
                <rect width="400" height="200" fill="#f8fafc"/>
                <path d="M50,30 L350,30 L350,170 L50,170 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
                <path d="M60,50 Q120,40 180,45 Q240,50 300,55 Q330,60 340,80 Q345,120 320,140 Q280,155 220,150 Q160,145 100,140 Q70,135 60,120 Q55,100 60,80 Q58,65 60,50" fill="#dcfce7"/>
                <path d="M80,70 Q140,65 200,70 Q260,75 300,80 Q320,85 325,100 Q330,120 310,130 Q270,140 210,135 Q150,130 90,125 Q75,120 80,105 Q78,88 80,70" fill="#a7f3d0"/>
                <path d="M120,90 Q180,88 240,92 Q280,95 300,100 Q310,105 308,115 Q305,125 285,128 Q245,132 185,130 Q125,128 120,118 Q118,108 120,98 Q119,94 120,90" fill="#6ee7b7"/>
                <path d="M100,120 Q200,115 280,125 Q320,130 340,140 Q350,150 330,160 Q290,165 200,160 Q110,155 80,145 Q60,135 70,125 Q85,120 100,120" fill="#7dd3fc"/>
                <path d="M150,140 Q220,138 280,142 Q310,145 320,155 Q325,165 305,168 Q265,172 195,170 Q125,168 100,160 Q80,152 90,145 Q120,140 150,140" fill="#60a5fa"/>
                <rect x="70" y="60" width="8" height="6" fill="#fbbf24"/>
                <rect x="120" y="80" width="6" height="4" fill="#fbbf24"/>
                <rect x="180" y="70" width="10" height="8" fill="#fbbf24"/>
                <rect x="240" y="90" width="7" height="5" fill="#fbbf24"/>
                <rect x="290" y="85" width="9" height="7" fill="#fbbf24"/>
                <rect x="160" y="110" width="8" height="6" fill="#fbbf24"/>
                <rect x="220" y="120" width="6" height="4" fill="#fbbf24"/>
                <rect x="280" y="115" width="10" height="8" fill="#fbbf24"/>
                <circle cx="90" cy="75" r="2" fill="#3b82f6"/>
                <circle cx="140" cy="85" r="2" fill="#3b82f6"/>
                <circle cx="200" cy="95" r="3" fill="#3b82f6"/>
                <circle cx="260" cy="100" r="2" fill="#3b82f6"/>
                <circle cx="310" cy="105" r="2" fill="#3b82f6"/>
                <circle cx="170" cy="125" r="2" fill="#3b82f6"/>
                <circle cx="230" cy="135" r="3" fill="#3b82f6"/>
                <circle cx="290" cy="130" r="2" fill="#3b82f6"/>
              </svg>
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
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>65% of points redeemed</div>
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