import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Partner from '@/models/Partner'
import Customer from '@/models/Customer'

export async function GET() {
  try {
    await connectDB()
    
    // Total Orders
    const totalOrders = await Order.countDocuments()
    
    // Total Revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0
    
    // Active Partners
    const activePartners = await Partner.countDocuments()
    
    // Average Delivery Time - calculate from delivered orders
    const deliveredOrders = await Order.find({ 
      status: 'delivered',
      deliveredAt: { $exists: true },
      createdAt: { $exists: true }
    }).select('createdAt deliveredAt')
    
    let avgDeliveryTime = '0 mins'
    if (deliveredOrders.length > 0) {
      const totalMinutes = deliveredOrders.reduce((sum, order) => {
        const diff = new Date(order.deliveredAt).getTime() - new Date(order.createdAt).getTime()
        return sum + (diff / (1000 * 60)) // Convert to minutes
      }, 0)
      const avgMinutes = Math.round(totalMinutes / deliveredOrders.length)
      avgDeliveryTime = `${avgMinutes} mins`
    }
    
    // Orders Trend (last 7 days)
    const ordersTrend = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ])
    
    // Revenue by Day (last 7 days)
    const revenueByDay = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ])
    
    // Partner Performance
    const partnerPerformance = await Order.aggregate([
      { $match: { partnerId: { $exists: true } } },
      {
        $group: {
          _id: '$partnerId',
          deliveries: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'partners',
          localField: '_id',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $sort: { deliveries: -1 } },
      { $limit: 5 }
    ])
    
    // Customer Loyalty Points - real data from customers
    const customers = await Customer.find().select('loyaltyPoints')
    const totalPoints = customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)
    
    // Calculate redeemed points from wallet transactions
    const WalletTransaction = (await import('@/models/WalletTransaction')).default
    const redemptions = await WalletTransaction.aggregate([
      { $match: { type: 'points', action: 'decrease' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const redeemedPoints = redemptions[0]?.total || 0
    const redemptionRate = totalPoints > 0 ? Math.round((redeemedPoints / (totalPoints + redeemedPoints)) * 100) : 0
    
    const loyaltyData = {
      totalPoints,
      redeemedPoints,
      redemptionRate
    }
    
    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        activePartners,
        avgDeliveryTime
      },
      ordersTrend,
      revenueByDay,
      partnerPerformance,
      loyaltyData
    })
  } catch (error) {
    console.error('Error fetching reports data:', error)
    return NextResponse.json({ error: 'Failed to fetch reports data' }, { status: 500 })
  }
}