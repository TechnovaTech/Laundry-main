import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import WalletSettings from '@/models/WalletSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await WalletSettings.findOne()
    
    if (!settings) {
      settings = await WalletSettings.create({
        pointsPerRupee: 2,
        minRedeemPoints: 100,
        referralPoints: 50,
        signupBonusPoints: 25,
        orderCompletionPoints: 10,
        minOrderPrice: 500
      })
    }
    
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    console.log('Received body:', body)
    
    const settings = await WalletSettings.findOneAndUpdate(
      {},
      {
        $set: {
          pointsPerRupee: body.pointsPerRupee,
          minRedeemPoints: body.minRedeemPoints,
          referralPoints: body.referralPoints,
          signupBonusPoints: body.signupBonusPoints,
          orderCompletionPoints: body.orderCompletionPoints,
          minOrderPrice: body.minOrderPrice,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    )
    
    console.log('Saved settings:', settings.toObject())
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
