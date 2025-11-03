import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/mongodb'
import Order from '../../../../../models/Order'
import Customer from '../../../../../models/Customer'
import WalletTransaction from '../../../../../models/WalletTransaction'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params
    const { refundAmount } = await request.json()

    const order = await Order.findById(id).populate('customerId')
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    if (order.refundProcessed) {
      return NextResponse.json({ success: false, message: 'Refund already processed' }, { status: 400 })
    }

    const customer = await Customer.findById(order.customerId._id)
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 })
    }

    const currentWallet = customer.walletBalance || 0
    const newWallet = currentWallet + refundAmount
    const chargeAmount = order.cancellationFee || order.deliveryFailureFee || 0
    const chargeType = order.cancellationFee > 0 ? 'Cancellation' : 'Delivery Failure'

    customer.walletBalance = newWallet
    if (chargeAmount > 0 && customer.dueAmount >= chargeAmount) {
      customer.dueAmount = Math.max(0, customer.dueAmount - chargeAmount)
    }
    await customer.save()

    await WalletTransaction.create({
      customerId: customer._id,
      type: 'balance',
      action: 'increase',
      amount: refundAmount,
      reason: `Refund for order ${order.orderId} - ${chargeType} (Charge: ₹${chargeAmount})`,
      previousValue: currentWallet,
      newValue: newWallet,
      adjustedBy: 'Admin'
    })

    order.refundProcessed = true
    order.refundAmount = refundAmount
    order.refundedAt = new Date()
    order.refundReason = `${chargeType} fee refund`
    await order.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Refund processed successfully',
      data: { newWallet, refundAmount }
    })
  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json({ success: false, message: 'Failed to process refund' }, { status: 500 })
  }
}
