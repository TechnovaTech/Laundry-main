import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'
import WalletSettings from '@/models/WalletSettings'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    Partner // Ensure Partner model is registered
    Customer // Ensure Customer model is registered
    
    // Try to find by orderId first, then by _id
    let order = await Order.findOne({ orderId: params.id })
      .populate('customerId', 'name mobile email address')
      .populate('partnerId', 'name mobile email')
    
    if (!order) {
      order = await Order.findById(params.id)
        .populate('customerId', 'name mobile email address')
        .populate('partnerId', 'name mobile email')
    }
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: order
    })
    
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch order'
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const updateData = await request.json()
    console.log('PATCH request - Order ID:', params.id)
    console.log('PATCH request - Update data:', updateData)
    
    // Try to find by orderId first, then by _id (without population for cancellation check)
    let currentOrder = await Order.findOne({ orderId: params.id })
    if (!currentOrder) {
      currentOrder = await Order.findById(params.id)
    }
    
    if (!currentOrder) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    console.log('=== CURRENT ORDER STATE ===')
    console.log('Order ID:', currentOrder.orderId)
    console.log('Order _id:', currentOrder._id)
    console.log('Partner ID:', currentOrder.partnerId)
    console.log('Status:', currentOrder.status)
    console.log('Total Amount:', currentOrder.totalAmount)
    console.log('===========================')
    
    // Handle cancellation fee logic
    if (updateData.status === 'cancelled' && currentOrder) {
      let cancellationFee = 0
      
      console.log('\n=== CANCELLATION FEE CALCULATION ===')
      console.log('Order ID:', currentOrder.orderId)
      console.log('Partner ID exists?:', !!currentOrder.partnerId)
      console.log('Partner ID value:', currentOrder.partnerId)
      console.log('Partner ID type:', typeof currentOrder.partnerId)
      console.log('Total Amount:', currentOrder.totalAmount)
      
      // Check if partner is assigned
      if (currentOrder.partnerId) {
        // 20% cancellation fee after pickup assignment
        cancellationFee = Math.round(currentOrder.totalAmount * 0.20)
        console.log('Partner assigned - 20% cancellation fee:', cancellationFee)
      } else {
        console.log('No partner assigned - No cancellation fee')
      }
      
      updateData.cancellationFee = cancellationFee
      updateData.cancelledAt = new Date()
      
      // Deduct from wallet or create due
      if (cancellationFee > 0) {
        console.log('Customer ID from order:', currentOrder.customerId)
        const customer = await Customer.findById(currentOrder.customerId)
        console.log('Customer found:', customer ? 'Yes' : 'No')
        if (customer) {
          console.log('Customer wallet balance:', customer.walletBalance)
          console.log('Customer due amount before:', customer.dueAmount)
          
          if (customer.walletBalance >= cancellationFee) {
            // Deduct from wallet
            console.log('Deducting', cancellationFee, 'from wallet')
            await Customer.findByIdAndUpdate(customer._id, {
              $inc: { walletBalance: -cancellationFee }
            })
            console.log('New wallet balance:', customer.walletBalance - cancellationFee)
            
            // Create wallet transaction
            await fetch(`http://localhost:3000/api/customers/${customer._id}/adjust`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'balance',
                action: 'decrease',
                amount: cancellationFee,
                reason: `Cancellation fee for Order #${currentOrder.orderId}`
              })
            })
          } else {
            // Create due amount
            const remainingDue = cancellationFee - customer.walletBalance
            const deductedFromWallet = customer.walletBalance
            console.log('Insufficient wallet balance')
            console.log('Deducting', deductedFromWallet, 'from wallet')
            console.log('Adding', remainingDue, 'to due amount')
            await Customer.findByIdAndUpdate(customer._id, {
              walletBalance: 0,
              $inc: { dueAmount: remainingDue }
            })
            console.log('New wallet balance: 0')
            console.log('New due amount:', (customer.dueAmount || 0) + remainingDue)
            
            // Create wallet transaction for deducted amount
            if (deductedFromWallet > 0) {
              await fetch(`http://localhost:3000/api/customers/${customer._id}/adjust`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'balance',
                  action: 'decrease',
                  amount: deductedFromWallet,
                  reason: `Cancellation fee (partial) for Order #${currentOrder.orderId}`
                })
              })
            }
          }
        }
      }
      console.log('=== END CANCELLATION FEE CALCULATION ===')
    }
    
    // If status is being updated, add to status history
    if (updateData.status) {
      console.log('Current order status:', currentOrder?.status)
      console.log('New status:', updateData.status)
      if (currentOrder) {
        const newHistoryEntry = {
          status: updateData.status,
          timestamp: new Date(),
          updatedBy: updateData.partnerId || 'system'
        }
        updateData.statusHistory = [
          ...(currentOrder.statusHistory || []),
          newHistoryEntry
        ]
        console.log('Adding to statusHistory:', newHistoryEntry)
        console.log('Full statusHistory:', updateData.statusHistory)
      }
    }
    
    // Credit referral points when FIRST order is delivered
    if (updateData.status === 'delivered' && currentOrder?.status !== 'delivered' && currentOrder?.customerId) {
      const customer = await Customer.findById(currentOrder.customerId)
      
      if (customer && customer.referredBy && customer.totalOrders === 0) {
        const settings = await WalletSettings.findOne()
        
        if (settings) {
          // Credit signup bonus to referred user (Customer B)
          await Customer.findByIdAndUpdate(customer._id, {
            $inc: { walletBalance: settings.signupBonusPoints }
          })
          
          // Credit referral bonus to referrer (Customer A)
          const referrer = await Customer.findOne({ 'referralCodes.code': customer.referredBy })
          if (referrer) {
            await Customer.findByIdAndUpdate(referrer._id, {
              $inc: { walletBalance: settings.referralPoints }
            })
          }
        }
      }
      
      // Update total orders count
      await Customer.findByIdAndUpdate(customer._id, {
        $inc: { totalOrders: 1 }
      })
    }
    
    // Update using the found order's _id
    const order = await Order.findByIdAndUpdate(
      currentOrder._id,
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true, runValidators: false }
    ).populate('partnerId', 'name mobile')
    
    if (!order) {
      console.log('Order not found with ID:', params.id)
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    console.log('Order updated successfully:', order)
    console.log('reachedLocationAt in updated order:', order?.reachedLocationAt)
    console.log('pickedUpAt in updated order:', order?.pickedUpAt)
    
    // Include cancellation fee info in response
    const responseData: any = {
      success: true,
      data: order
    }
    
    if (updateData.status === 'cancelled' && updateData.cancellationFee !== undefined) {
      responseData.cancellationFee = updateData.cancellationFee
      responseData.message = updateData.cancellationFee > 0 
        ? `Order cancelled. Cancellation fee of ₹${updateData.cancellationFee} has been charged.`
        : 'Order cancelled successfully. No cancellation fee charged.'
    }
    
    return NextResponse.json(responseData)
    
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const order = await Order.findByIdAndDelete(params.id)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete order'
    }, { status: 500 })
  }
}