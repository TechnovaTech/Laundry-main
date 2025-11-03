import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'
import WalletSettings from '@/models/WalletSettings'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 })
    }

    const customer: any = await Customer.findById(customerId).lean()
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }
    
    // Ensure dueAmount is included
    const customerData = {
      ...customer,
      dueAmount: customer.dueAmount || 0
    }

    return NextResponse.json({ success: true, data: customerData })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Profile creation API called')
    await dbConnect()
    console.log('Database connected')
    
    const body = await request.json()
    console.log('Profile creation data:', body)

    // Check if customer with this mobile or email already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [
        { mobile: body.mobile },
        { email: body.email },
        { mobile: { $regex: /^google_/ } }
      ]
    })
    
    if (existingCustomer) {
      // Update existing customer
      const updatedCustomer = await Customer.findByIdAndUpdate(
        existingCustomer._id,
        { 
          name: body.name,
          email: body.email,
          mobile: body.mobile,
          referredBy: body.referralCode || existingCustomer.referredBy,
          updatedAt: new Date() 
        },
        { new: true }
      )
      console.log('Updated existing customer:', updatedCustomer)
      return NextResponse.json({ success: true, data: { customerId: updatedCustomer._id, ...updatedCustomer.toObject() } })
    } else {
      // Get wallet settings for signup bonus
      let settings = await WalletSettings.findOne()
      if (!settings) {
        settings = await WalletSettings.create({
          pointsPerRupee: 2,
          minRedeemPoints: 100,
          referralPoints: 50,
          signupBonusPoints: 25,
          orderCompletionPoints: 10
        })
      }
      
      // Create new customer with signup bonus
      const customerData: any = {
        name: body.name,
        email: body.email,
        mobile: body.mobile,
        address: [],
        paymentMethods: [],
        walletBalance: 0,
        loyaltyPoints: settings.signupBonusPoints,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Handle referral code if provided
      if (body.referralCode) {
        const referrer = await Customer.findOne({ 'referralCodes.code': body.referralCode, 'referralCodes.used': false })
        if (referrer) {
          customerData.referredBy = body.referralCode
          
          // Mark code as used and award points to referrer
          const codeIndex = referrer.referralCodes.findIndex((c: any) => c.code === body.referralCode && !c.used)
          if (codeIndex !== -1) {
            referrer.referralCodes[codeIndex].used = true
            referrer.referralCodes[codeIndex].usedBy = body.name
            referrer.referralCodes[codeIndex].usedAt = new Date()
            referrer.loyaltyPoints = (referrer.loyaltyPoints || 0) + settings.referralPoints
            await referrer.save()
          }
        }
      }
      
      const customer = new Customer(customerData)
      const savedCustomer = await customer.save()
      console.log('Created new customer:', savedCustomer)
      return NextResponse.json({ success: true, data: { customerId: savedCustomer._id, ...savedCustomer.toObject() } })
    }
  } catch (error: any) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create profile: ' + error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile update API called')
    await dbConnect()
    console.log('Database connected')
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const body = await request.json()
    
    console.log('Customer ID:', customerId)
    console.log('Update data:', body)

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID required' }, { status: 400 })
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { ...body, updatedAt: new Date() },
      { new: true, upsert: true }
    )
    
    console.log('Updated customer:', customer)

    return NextResponse.json({ success: true, data: customer })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile: ' + error.message }, { status: 500 })
  }
}