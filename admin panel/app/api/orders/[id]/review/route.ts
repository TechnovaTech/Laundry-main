import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Order from '@/models/Order'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const { customerId, rating, comment } = await request.json()
    
    console.log('Creating review for order:', id, { customerId, rating, comment })
    
    // Check if order exists
    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { 
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ orderId: id })
    if (existingReview) {
      return NextResponse.json({ error: 'Review already exists for this order' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }
    
    // Create review
    const review = new Review({
      orderId: id,
      customerId,
      rating: Number(rating),
      comment,
      status: 'pending'
    })
    
    const savedReview = await review.save()
    console.log('Review saved successfully:', savedReview)
    
    // Update order with review reference
    await Order.findByIdAndUpdate(id, { reviewId: savedReview._id })
    
    return NextResponse.json(savedReview, { 
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review', details: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}