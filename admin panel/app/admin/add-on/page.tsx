'use client'

import { useState, useEffect } from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export default function AddOnPage() {
  const [activeSection, setActiveSection] = useState('Pincode')
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [pincodes, setPincodes] = useState([])
  const [serviceableAreas, setServiceableAreas] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPincode, setSelectedPincode] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [vouchers, setVouchers] = useState([])
  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [slogan, setSlogan] = useState('')

  useEffect(() => {
    fetchStates()
    fetchServiceableAreas()
    fetchVouchers()
  }, [])

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/locations/states')
      const data = await response.json()
      setStates(data)
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchCities = async (stateCode: string) => {
    try {
      const response = await fetch(`/api/locations/cities?state=${stateCode}`)
      const data = await response.json()
      setCities(data)
      setPincodes([])
      setSelectedCity('')
      setSelectedPincode('')
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchPincodes = async (city: string) => {
    try {
      const response = await fetch(`/api/locations/pincodes?city=${city}`)
      const data = await response.json()
      setPincodes(data)
      setSelectedPincode('')
    } catch (error) {
      console.error('Error fetching pincodes:', error)
    }
  }

  const fetchServiceableAreas = async () => {
    try {
      const response = await fetch('/api/serviceable-areas')
      const data = await response.json()
      setServiceableAreas(data)
    } catch (error) {
      console.error('Error fetching serviceable areas:', error)
    }
  }

  const handleStateChange = (e: any) => {
    const stateCode = e.target.value
    setSelectedState(stateCode)
    setCities([])
    setPincodes([])
    setSelectedCity('')
    setSelectedPincode('')
    setSelectedArea('')
    if (stateCode) {
      fetchCities(stateCode)
    }
  }

  const handleCityChange = (e: any) => {
    const city = e.target.value
    setSelectedCity(city)
    setPincodes([])
    setSelectedPincode('')
    setSelectedArea('')
    if (city) {
      fetchPincodes(city)
    }
  }

  const handlePincodeChange = (e: any) => {
    if (e.target.value) {
      const pincodeData = JSON.parse(e.target.value)
      setSelectedPincode(pincodeData.pincode)
      setSelectedArea(pincodeData.area)
    } else {
      setSelectedPincode('')
      setSelectedArea('')
    }
  }

  const addServiceableArea = async () => {
    if (!selectedState || !selectedCity || !selectedPincode) return
    
    try {
      const response = await fetch('/api/serviceable-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          city: selectedCity,
          pincode: selectedPincode,
          area: selectedArea
        })
      })
      
      if (response.ok) {
        fetchServiceableAreas()
        setSelectedState('')
        setSelectedCity('')
        setSelectedPincode('')
        setSelectedArea('')
        setCities([])
        setPincodes([])
      }
    } catch (error) {
      console.error('Error adding serviceable area:', error)
    }
  }

  const removeServiceableArea = async (id: string) => {
    try {
      const response = await fetch(`/api/serviceable-areas?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchServiceableAreas()
      }
    } catch (error) {
      console.error('Error removing serviceable area:', error)
    }
  }

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/vouchers')
      const data = await response.json()
      if (data.success) {
        setVouchers(data.data)
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    }
  }

  const addVoucher = async () => {
    if (!voucherCode || !discount || !slogan) {
      console.log('Missing fields:', { voucherCode, discount, slogan })
      return
    }
    
    console.log('Sending voucher data:', { code: voucherCode, discount: Number(discount), slogan })
    
    try {
      const response = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, discount: Number(discount), slogan })
      })
      
      const result = await response.json()
      console.log('API response:', result)
      
      if (response.ok) {
        setVoucherCode('')
        setDiscount('')
        setSlogan('')
        fetchVouchers()
      } else {
        console.error('API error:', result)
      }
    } catch (error) {
      console.error('Error adding voucher:', error)
    }
  }

  const removeVoucher = async (id: string) => {
    try {
      const response = await fetch(`/api/vouchers?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchVouchers()
      }
    } catch (error) {
      console.error('Error removing voucher:', error)
    }
  }

  return (
    <ResponsiveLayout activePage="Add-On" title="Add-On Management">
      <div style={{ padding: '1.5rem' }}>
        {/* Header Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveSection('Pincode')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Pincode' ? '#2563eb' : 'white', 
              color: activeSection === 'Pincode' ? 'white' : '#2563eb', 
              border: activeSection === 'Pincode' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Pincode
          </button>
          <button 
            onClick={() => setActiveSection('Voucher')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: activeSection === 'Voucher' ? '#2563eb' : 'white', 
              color: activeSection === 'Voucher' ? 'white' : '#2563eb', 
              border: activeSection === 'Voucher' ? 'none' : '1px solid #2563eb', 
              borderRadius: '8px', 
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Voucher
          </button>
        </div>

        {/* Pincode Management Section */}
        {activeSection === 'Pincode' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Pincode Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <select 
              value={selectedState} 
              onChange={handleStateChange}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="">Select State</option>
              {states.map((state: any) => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedCity} 
              onChange={handleCityChange}
              disabled={!selectedState}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="">Select City</option>
              {cities.map((city: string) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select 
              value={selectedPincode ? JSON.stringify({pincode: selectedPincode, area: selectedArea}) : ''} 
              onChange={handlePincodeChange}
              disabled={!selectedCity}
              style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="">Select Pincode</option>
              {pincodes.map((pincode: any) => (
                <option key={pincode.pincode} value={JSON.stringify(pincode)}>
                  {pincode.pincode} - {pincode.area}
                </option>
              ))}
            </select>
            
            <button 
              onClick={addServiceableArea}
              disabled={!selectedPincode}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: selectedPincode ? '#2563eb' : '#9ca3af', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                cursor: selectedPincode ? 'pointer' : 'not-allowed'
              }}
            >
              Add Area
            </button>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem' }}>
            {serviceableAreas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No serviceable areas added yet</p>
            ) : (
              serviceableAreas.map((area: any) => (
                <div key={area._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {area.pincode} - {area.area}, {area.city}, {area.state}
                  </span>
                  <button 
                    onClick={() => removeServiceableArea(area._id)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        )}

        {/* Voucher Management Section */}
        {activeSection === 'Voucher' && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Voucher Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Voucher Code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
            <input 
              type="number" 
              placeholder="Discount %"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '12px', outline: 'none', fontSize: '0.9rem' }}
            />
            <button 
              onClick={addVoucher}
              disabled={!voucherCode || !discount || !slogan}
              style={{ 
                padding: '0.75rem', 
                backgroundColor: voucherCode && discount && slogan ? '#2563eb' : '#9ca3af', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                cursor: voucherCode && discount && slogan ? 'pointer' : 'not-allowed'
              }}
            >
              Add Voucher
            </button>
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.5rem' }}>
            {vouchers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No vouchers created yet</p>
            ) : (
              vouchers.map((voucher: any) => (
                <div key={voucher._id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {voucher.code} - {voucher.discount}% off - {voucher.slogan}
                  </span>
                  <button 
                    onClick={() => removeVoucher(voucher._id)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}