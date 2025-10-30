import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { customerId, dueAmount } = await request.json()
    
    if (!customerId) {
      return NextResponse.json({ success: false, message: 'Customer ID required' })
    }
    
    const customer = await Customer.findById(customerId)
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' })
    }
    
    customer.dueAmount = dueAmount || 0
    await customer.save()
    
    return NextResponse.json({
      success: true,
      message: 'Due amount set successfully',
      data: {
        customerId: customer._id,
        name: customer.name,
        walletBalance: customer.walletBalance,
        dueAmount: customer.dueAmount
      }
    })
    
  } catch (error: any) {
    console.error('Set due error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
