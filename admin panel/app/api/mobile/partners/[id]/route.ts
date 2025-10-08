import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const partner = await Partner.findById(params.id).lean()
    
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch partner' }, { status: 500 })
  }
}
