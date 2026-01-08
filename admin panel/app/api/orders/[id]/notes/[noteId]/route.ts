import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '../../../../../../models/Order'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry'

async function connectDB() {
  if (mongoose.connections[0].readyState) return
  await mongoose.connect(MONGODB_URI)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, noteId: string }> }) {
  try {
    await connectDB()
    const { id, noteId } = await params
    const { note } = await request.json()
    
    if (!note?.trim()) {
      return NextResponse.json({ error: 'Note is required' }, { status: 400 })
    }

    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const noteIndex = order.adminNotes?.findIndex((n: any) => n._id.toString() === noteId)
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    order.adminNotes[noteIndex].note = note.trim()
    await order.save()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, noteId: string }> }) {
  try {
    await connectDB()
    const { id, noteId } = await params
    
    const order = await Order.findById(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    order.adminNotes = order.adminNotes?.filter((n: any) => n._id.toString() !== noteId) || []
    await order.save()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}