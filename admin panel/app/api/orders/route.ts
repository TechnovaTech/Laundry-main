import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const orderData = await request.json()
    
    // Generate unique 5-character alphanumeric order ID
    const orderId = Math.random().toString(36).substr(2, 5).toUpperCase()
    
    const newOrder = new Order({
      orderId,
      customerId: orderData.customerId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      pickupAddress: orderData.pickupAddress,
      deliveryAddress: orderData.deliveryAddress || orderData.pickupAddress,
      pickupSlot: {
        date: orderData.pickupDate || new Date(),
        timeSlot: orderData.pickupSlot
      },
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      specialInstructions: orderData.specialInstructions || '',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    const savedOrder = await newOrder.save()
    
    return NextResponse.json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create order'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    
    let query = {}
    if (customerId) {
      query = { customerId }
    }
    
    const orders = await Order.find(query)
      .populate('customerId', 'name mobile email')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: orders
    })
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch orders'
    }, { status: 500 })
  }
}