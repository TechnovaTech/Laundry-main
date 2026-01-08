import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongodb'
import Customer from '../../../../models/Customer'
import Order from '../../../../models/Order'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const value = parseInt(searchParams.get('value') || '0')
    
    if (!type || !value) {
      return NextResponse.json({ success: false, message: 'Type and value are required' }, { status: 400 })
    }

    // Get current month start and end dates
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    let highValueCustomers: any[] = []

    if (type === 'orders') {
      // Find customers with minimum orders per month
      const pipeline: any[] = [
        {
          $match: {
            createdAt: { $gte: monthStart, $lte: monthEnd },
            status: { $in: ['delivered', 'processing', 'ready', 'out_for_delivery'] }
          }
        },
        {
          $group: {
            _id: '$customerId',
            monthlyOrders: { $sum: 1 },
            monthlySpend: { $sum: '$totalAmount' }
          }
        },
        {
          $match: {
            monthlyOrders: { $gte: value }
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: '_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$customer'
        },
        {
          $project: {
            _id: '$customer._id',
            name: '$customer.name',
            mobile: '$customer.mobile',
            monthlyOrders: 1,
            monthlySpend: 1
          }
        },
        {
          $sort: { monthlyOrders: -1 }
        }
      ]

      highValueCustomers = await Order.aggregate(pipeline)
    } else if (type === 'spending') {
      // Find customers with minimum spending per month
      const pipeline: any[] = [
        {
          $match: {
            createdAt: { $gte: monthStart, $lte: monthEnd },
            status: { $in: ['delivered', 'processing', 'ready', 'out_for_delivery'] }
          }
        },
        {
          $group: {
            _id: '$customerId',
            monthlyOrders: { $sum: 1 },
            monthlySpend: { $sum: '$totalAmount' }
          }
        },
        {
          $match: {
            monthlySpend: { $gte: value }
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: '_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$customer'
        },
        {
          $project: {
            _id: '$customer._id',
            name: '$customer.name',
            mobile: '$customer.mobile',
            monthlyOrders: 1,
            monthlySpend: 1
          }
        },
        {
          $sort: { monthlySpend: -1 }
        }
      ]

      highValueCustomers = await Order.aggregate(pipeline)
    }

    return NextResponse.json({
      success: true,
      data: highValueCustomers,
      message: `Found ${highValueCustomers.length} high value customers`
    })

  } catch (error) {
    console.error('Error fetching high value customers:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch high value customers' },
      { status: 500 }
    )
  }
}