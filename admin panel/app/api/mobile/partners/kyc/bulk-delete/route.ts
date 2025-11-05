import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    const { ids } = await request.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid partner IDs' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    const result = await Partner.deleteMany({ _id: { $in: ids } })
    
    return NextResponse.json(
      { success: true, deletedCount: result.deletedCount },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error deleting partners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete partners' },
      { status: 500, headers: corsHeaders }
    )
  }
}
