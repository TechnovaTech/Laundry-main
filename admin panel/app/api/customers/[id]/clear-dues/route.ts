import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/mongodb'
import Customer from '../../../../../models/Customer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const customer = await Customer.findById(id)
    if (!customer) {
      return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 })
    }

    customer.dueAmount = 0
    await customer.save()

    return NextResponse.json({ success: true, message: 'Dues cleared successfully' })
  } catch (error) {
    console.error('Clear dues error:', error)
    return NextResponse.json({ success: false, message: 'Failed to clear dues' }, { status: 500 })
  }
}
