import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '../../../../../models/Order'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry'

async function connectDB() {
  if (mongoose.connections[0].readyState) return
  await mongoose.connect(MONGODB_URI)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const { note } = await request.json()
    
    if (!note?.trim()) {
      return NextResponse.json({ error: 'Note is required' }, { status: 400 })
    }

    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.adminNotes) order.adminNotes = []
    
    order.adminNotes.push({
      _id: new mongoose.Types.ObjectId(),
      note: note.trim(),
      addedBy: 'Admin',
      createdAt: new Date()
    })

    await order.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 })
  }
}