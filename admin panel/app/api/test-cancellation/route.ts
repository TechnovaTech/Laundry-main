import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID required' })
    }
    
    // Find order
    const order = await Order.findOne({ orderId })
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' })
    }
    
    // Find customer
    const customer = await Customer.findById(order.customerId)
    
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' })
    }
    
    const cancellationFee = order.partnerId ? Math.round(order.totalAmount * 0.20) : 0
    
    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        orderAmount: order.totalAmount,
        partnerId: order.partnerId,
        partnerAssigned: !!order.partnerId,
        cancellationFee,
        customer: {
          id: customer._id,
          name: customer.name,
          walletBalance: customer.walletBalance,
          dueAmount: customer.dueAmount
        },
        calculation: {
          willDeductFromWallet: Math.min(customer.walletBalance, cancellationFee),
          willAddToDue: Math.max(0, cancellationFee - customer.walletBalance)
        }
      }
    })
    
  } catch (error: any) {
    console.error('Test cancellation error:', error)
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
