'use client'

import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function RoleManagement() {
  return (
    <ResponsiveLayout activePage="Role Management" title="Role Management" searchPlaceholder="Search...">

        <div style={{ padding: '1.5rem' }}>
          {/* Role Cards */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              flex: 1
            }}>
              <h3 style={{ color: '#2563eb', fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Admin</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>3 Users assigned</p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              flex: 1
            }}>
              <h3 style={{ color: '#2563eb', fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Store Manager</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>5 Users assigned</p>
            </div>
          </div>

          {/* Roles Table */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Roles</h3>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Role Name</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Description</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Assigned Users</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Permissions</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>Admin</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>Full control</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>3 Users - View List</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>View / Edit</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>Edit Role</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>Store Manager</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>Limited store operations only</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>5 Users - View List</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>View / Edit</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#2563eb', cursor: 'pointer' }}>Edit Role</span>
                    <span style={{ color: '#dc2626', cursor: 'pointer', marginLeft: '0.5rem' }}> | Delete Role</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Assign User Button */}
          <div style={{ marginTop: '2rem' }}>
            <button style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}>
              Assign User
            </button>
          </div>

          {/* Empty State */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '3rem',
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem'
          }}>
            <div>
              <img src="/Group.svg" alt="Role Management" style={{ width: '120px', height: '120px' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                No roles assigned yet.
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                Create roles and assign users to manage permissions.
              </p>
            </div>
          </div>
      </div>
    </ResponsiveLayout>
  )
}