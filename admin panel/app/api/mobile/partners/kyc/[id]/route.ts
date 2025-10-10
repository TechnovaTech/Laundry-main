import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { action, reason } = await request.json()
    
    const updateData: any = {}
    
    if (action === 'approve') {
      updateData.kycStatus = 'approved'
      updateData.isVerified = true
      updateData.kycRejectionReason = null
    } else if (action === 'reject') {
      updateData.kycStatus = 'rejected'
      updateData.isVerified = false
      updateData.kycRejectionReason = reason
    }
    
    const partner = await Partner.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
    
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error updating KYC status:', error)
    return NextResponse.json({ success: false, error: 'Failed to update KYC status' }, { status: 500 })
  }
}
