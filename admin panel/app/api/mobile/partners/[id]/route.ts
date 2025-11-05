import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Partner from '@/models/Partner'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const partner = await Partner.findById(id).lean()
    
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch partner' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    )
    
    if (!updatedPartner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedPartner })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to update partner' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    )
    
    if (!updatedPartner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: updatedPartner })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to update partner' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    
    // Check if partner exists
    const partner = await Partner.findById(id)
    if (!partner) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }
    
    // Import Order model dynamically to avoid circular dependencies
    const Order = (await import('@/models/Order')).default
    
    // Check for active orders assigned to this partner
    const activeOrders = await Order.find({ 
      partnerId: id, 
      status: { $nin: ['delivered', 'cancelled'] } 
    }).countDocuments()
    
    if (activeOrders > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete partner. ${activeOrders} active order(s) are still assigned to this partner.` 
      }, { status: 400 })
    }
    
    // Update all completed orders to remove partner reference
    await Order.updateMany(
      { partnerId: id },
      { $unset: { partnerId: 1 } }
    )
    
    // Delete the partner
    const deletedPartner = await Partner.findByIdAndDelete(id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Partner deleted successfully',
      data: { id: deletedPartner._id }
    })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete partner' }, { status: 500 })
  }
}
