import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'
import WalletSettings from '@/models/WalletSettings'
import OrderCharges from '@/models/OrderCharges'
import WalletTransaction from '@/models/WalletTransaction'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    Partner // Ensure Partner model is registered
    Customer // Ensure Customer model is registered
    
    // Try to find by orderId first, then by _id
    let order = await Order.findOne({ orderId: id })
      .populate('customerId', 'name mobile email address')
      .populate('partnerId', 'name mobile email')
      .populate('hub', 'name address address2 city pincode phone email gstNumber')
    
    if (!order) {
      order = await Order.findById(id)
        .populate('customerId', 'name mobile email address')
        .populate('partnerId', 'name mobile email')
        .populate('hub', 'name address address2 city pincode phone email gstNumber')
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const updateData = await request.json()
    console.log('PATCH request - Order ID:', id)
    console.log('PATCH request - Update data:', JSON.stringify(updateData, null, 2))
    
    // Try to find by orderId first, then by _id (without population for cancellation check)
    let currentOrder = await Order.findOne({ orderId: id })
    if (!currentOrder) {
      currentOrder = await Order.findById(id)
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
        // Fetch cancellation percentage from OrderCharges
        const orderCharges = await OrderCharges.findOne()
        const cancellationPercentage = orderCharges?.cancellationPercentage || 20
        console.log('Cancellation percentage from DB:', cancellationPercentage)
        
        cancellationFee = Math.round(currentOrder.totalAmount * (cancellationPercentage / 100))
        console.log(`Partner assigned - ${cancellationPercentage}% cancellation fee:`, cancellationFee)
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
          // Ensure dueAmount field exists
          if (customer.dueAmount === undefined || customer.dueAmount === null) {
            customer.dueAmount = 0
          }
          console.log('Customer wallet balance:', customer.walletBalance)
          console.log('Customer due amount before:', customer.dueAmount)
          
          const previousBalance = customer.walletBalance
          
          if (customer.walletBalance >= cancellationFee) {
            // Deduct from wallet
            console.log('Deducting', cancellationFee, 'from wallet')
            customer.walletBalance -= cancellationFee
            await customer.save()
            console.log('New wallet balance:', customer.walletBalance)
            
            // Create wallet transaction history
            await WalletTransaction.create({
              customerId: customer._id,
              type: 'balance',
              action: 'decrease',
              amount: cancellationFee,
              reason: `Cancellation fee for Order #${currentOrder.orderId}`,
              previousValue: previousBalance,
              newValue: customer.walletBalance,
              adjustedBy: 'System'
            })
          } else {
            // Create due amount
            const remainingDue = cancellationFee - customer.walletBalance
            const deductedFromWallet = customer.walletBalance
            const newDueAmount = (customer.dueAmount || 0) + remainingDue
            console.log('Insufficient wallet balance')
            console.log('Deducting', deductedFromWallet, 'from wallet')
            console.log('Adding', remainingDue, 'to due amount')
            console.log('Current due amount:', customer.dueAmount || 0)
            console.log('New due amount will be:', newDueAmount)
            
            customer.walletBalance = 0
            customer.dueAmount = newDueAmount
            await customer.save()
            console.log('Saved customer with wallet: 0, due:', newDueAmount)
            
            // Create wallet transaction history
            await WalletTransaction.create({
              customerId: customer._id,
              type: 'balance',
              action: 'decrease',
              amount: cancellationFee,
              reason: deductedFromWallet > 0 
                ? `Cancellation fee (partial) for Order #${currentOrder.orderId} - ₹${deductedFromWallet} from wallet, ₹${remainingDue} added to due`
                : `Cancellation fee for Order #${currentOrder.orderId} - Full amount ₹${cancellationFee} added to due (insufficient wallet balance)`,
              previousValue: previousBalance,
              newValue: 0,
              adjustedBy: 'System'
            })
          }
        }
      }
      console.log('=== END CANCELLATION FEE CALCULATION ===')
    }
    
    // Handle delivery failure fee logic
    if (updateData.status === 'delivery_failed' && currentOrder) {
      const deliveryFee = updateData.deliveryFailureFee || 150
      
      console.log('=== DELIVERY FAILURE FEE CALCULATION ===')
      console.log('Order ID:', currentOrder.orderId)
      console.log('Delivery failure fee:', deliveryFee)
      console.log('Failure reason:', updateData.deliveryFailureReason)
      
      updateData.deliveryFailedAt = new Date()
      
      // Deduct from wallet or create due
      const customer = await Customer.findById(currentOrder.customerId)
      if (customer) {
        // Ensure dueAmount field exists
        if (customer.dueAmount === undefined || customer.dueAmount === null) {
          customer.dueAmount = 0
        }
        
        console.log('Customer wallet balance:', customer.walletBalance)
        console.log('Customer due amount before:', customer.dueAmount)
        
        const previousBalance = customer.walletBalance
        
        if (customer.walletBalance >= deliveryFee) {
          // Deduct from wallet
          customer.walletBalance -= deliveryFee
          await customer.save()
          console.log('Deducted', deliveryFee, 'from wallet')
          
          // Create wallet transaction history
          await WalletTransaction.create({
            customerId: customer._id,
            type: 'balance',
            action: 'decrease',
            amount: deliveryFee,
            reason: `Delivery failure fee for Order #${currentOrder.orderId} - ${updateData.deliveryFailureReason}`,
            previousValue: previousBalance,
            newValue: customer.walletBalance,
            adjustedBy: 'System'
          })
        } else {
          // Create due amount
          const remainingDue = deliveryFee - customer.walletBalance
          const deductedFromWallet = customer.walletBalance
          const newDueAmount = (customer.dueAmount || 0) + remainingDue
          
          customer.walletBalance = 0
          customer.dueAmount = newDueAmount
          await customer.save()
          
          console.log('Deducted', deductedFromWallet, 'from wallet')
          console.log('Added', remainingDue, 'to due amount')
          console.log('New due amount:', newDueAmount)
          
          // Create wallet transaction history
          await WalletTransaction.create({
            customerId: customer._id,
            type: 'balance',
            action: 'decrease',
            amount: deliveryFee,
            reason: deductedFromWallet > 0
              ? `Delivery failure fee (partial) for Order #${currentOrder.orderId} - ${updateData.deliveryFailureReason} - ₹${deductedFromWallet} from wallet, ₹${remainingDue} added to due`
              : `Delivery failure fee for Order #${currentOrder.orderId} - ${updateData.deliveryFailureReason} - Full amount ₹${deliveryFee} added to due (insufficient wallet balance)`,
            previousValue: previousBalance,
            newValue: 0,
            adjustedBy: 'System'
          })
        }
      }
      console.log('=== END DELIVERY FAILURE FEE CALCULATION ===')
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
    
    // Award order completion points when order is delivered
    if (updateData.status === 'delivered' && currentOrder?.status !== 'delivered' && currentOrder?.customerId) {
      const customer = await Customer.findById(currentOrder.customerId)
      const settings = await WalletSettings.findOne()
      
      if (customer && settings) {
        // Award order completion points (loyalty points, not wallet balance)
        await Customer.findByIdAndUpdate(customer._id, {
          $inc: { 
            loyaltyPoints: settings.orderCompletionPoints,
            totalOrders: 1
          }
        })
        console.log(`Awarded ${settings.orderCompletionPoints} loyalty points to customer ${customer._id} for order completion`)
      }
    }
    
    // Update using the found order's _id
    const order = await Order.findByIdAndUpdate(
      currentOrder._id,
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true, runValidators: false }
    ).populate('partnerId', 'name mobile')
    
    if (!order) {
      console.log('Order not found with ID:', id)
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    
    const order = await Order.findByIdAndDelete(id)
    
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