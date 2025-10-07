import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import TimeSlot from '@/models/TimeSlot'

export async function GET() {
  try {
    await dbConnect()
    const timeSlots = await TimeSlot.find({ isActive: true }).sort({ createdAt: 1 })
    return NextResponse.json({ success: true, data: timeSlots })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch time slots' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { time, type } = await request.json()
    
    if (!time || !type) {
      return NextResponse.json({ success: false, error: 'Time and type are required' }, { status: 400 })
    }
    
    const timeSlot = await TimeSlot.create({ time, type })
    return NextResponse.json({ success: true, data: timeSlot }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create time slot' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await TimeSlot.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete time slot' }, { status: 500 })
  }
}