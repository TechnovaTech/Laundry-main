import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const pincode = searchParams.get('pincode')
  
  // Handle pincode lookup
  if (pincode) {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch location')
      }
      
      const data = await response.json()
      
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
        const office = data[0].PostOffice[0]
        return NextResponse.json([{
          city: office.District,
          state: office.State,
          pincode: office.Pincode
        }])
      }
      
      throw new Error('No data found')
    } catch (error) {
      return NextResponse.json([{ city: '', state: '', pincode }])
    }
  }
  
  // Handle city lookup
  if (!city) {
    return NextResponse.json({ error: 'City or pincode is required' }, { status: 400 })
  }
  
  try {
    const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch pincodes')
    }
    
    const data = await response.json()
    
    if (data[0]?.Status === 'Success' && data[0]?.PostOffice) {
      const pincodes = data[0].PostOffice.map((office: any) => ({
        pincode: office.Pincode,
        area: office.Name
      }))
      return NextResponse.json(pincodes)
    }
    
    throw new Error('No data found')
  } catch (error) {
    const fallbackPincodes = [
      { pincode: '000001', area: `${city} Area 1` },
      { pincode: '000002', area: `${city} Area 2` },
      { pincode: '000003', area: `${city} Area 3` }
    ]
    return NextResponse.json(fallbackPincodes)
  }
}