import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Hub from '@/models/Hub'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    
    const hub = await Hub.findById(id)
    
    if (!hub) {
      return NextResponse.json({
        success: false,
        message: 'Hub not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: hub
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch hub'
    }, { status: 500 })
  }
}
