import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { mobile, name, email, address } = await request.json()

    let partner = await Partner.findOne({ mobile })
    
    if (!partner) {
      partner = await Partner.create({
        mobile,
        name: name || '',
        email: email || '',
        address: address || {},
        isActive: true,
        isVerified: false
      })
    } else {
      partner = await Partner.findByIdAndUpdate(
        partner._id,
        { name, email, address, updatedAt: new Date() },
        { new: true }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        partnerId: partner._id,
        partner
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save partner' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (!partnerId) {
      return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 })
    }

    const partner = await Partner.findById(partnerId)
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch partner' }, { status: 500 })
  }
}