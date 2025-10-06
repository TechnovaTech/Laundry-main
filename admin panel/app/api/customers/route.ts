import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET() {
  try {
    await dbConnect()
    const customers = await Customer.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const customer = await Customer.create(body)
    return NextResponse.json({ success: true, data: customer }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 })
  }
}