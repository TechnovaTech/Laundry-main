'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)


  return (
    <ResponsiveLayout activePage="Settings" title="Settings">
        
        <div style={{ padding: '1.5rem' }}>
          {/* Admin Profile Settings */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Admin Profile Settings</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Name" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
              <input type="email" placeholder="Email" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
              <input type="tel" placeholder="Mobile" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '1.5rem' }}>📷</div>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>Upload/Change Photo</button>
            </div>
            
            <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Save Changes</button>
          </div>

          {/* System Configuration */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>System Configuration</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <select style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }}>
                <option>₹</option>
              </select>
              <select style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }}>
                <option>Select Timezone</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Serviceable Cities" style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#2563eb', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px', transition: 'all 0.2s' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Auto-assign Delivery Partner</span>
              </div>
            </div>
            
            <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Update Settings</button>
          </div>

          {/* Security Settings */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Security Settings</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input type="password" placeholder="Old Password" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
              <input type="password" placeholder="New Password" style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#2563eb', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px', transition: 'all 0.2s' }}></div>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Enable 2FA</span>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>Session Management</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Session 1 - Active</span>
                <button style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>Revoke</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.9rem' }}>Session 2 - Active</span>
                <button style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>Revoke</button>
              </div>
            </div>
          </div>



          {/* Notification Preferences */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Notification Preferences</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#2563eb', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px', transition: 'all 0.2s' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>New Order Alerts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#2563eb', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px', transition: 'all 0.2s' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Partner KYC Approvals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#2563eb', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: '2px', transition: 'all 0.2s' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>System Errors</span>
              </div>
            </div>
            
            <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Save</button>
          </div>

          {/* Danger Zone */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #fecaca' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Danger Zone</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => setShowResetModal(true)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Reset System Data</button>
              <button onClick={() => setShowDeleteModal(true)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Delete Admin Account</button>
            </div>
          </div>
      </div>

      {/* Reset System Data Modal */}
        {showResetModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ef4444', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Are you sure you want to reset the system data?</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowResetModal(false)} style={{ padding: '0.5rem 1.5rem', backgroundColor: 'white', color: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                <button style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#ef4444', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Are you sure you want to delete the admin account?</h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteModal(false)} style={{ padding: '0.5rem 1.5rem', backgroundColor: 'white', color: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                <button style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Confirm</button>
              </div>
            </div>
          </div>
        )}
    </ResponsiveLayout>
  )
}