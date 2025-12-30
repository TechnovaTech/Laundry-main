import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Voucher from '@/models/Voucher';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { customerId, voucherCode, orderId } = await request.json();
    
    if (!customerId || !voucherCode) {
      return NextResponse.json({ 
        success: false, 
        error: 'Customer ID and voucher code are required' 
      }, { status: 400 });
    }
    
    // Verify voucher exists and is active
    const voucher = await Voucher.findOne({ code: voucherCode, isActive: true });
    if (!voucher) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or inactive voucher code' 
      }, { status: 400 });
    }
    
    // Check if customer has already used this voucher
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json({ 
        success: false, 
        error: 'Customer not found' 
      }, { status: 404 });
    }
    
    const alreadyUsed = customer.usedVouchers?.some((v: any) => v.voucherCode === voucherCode);
    if (alreadyUsed) {
      return NextResponse.json({ 
        success: false, 
        error: 'Voucher already used by this customer' 
      }, { status: 400 });
    }
    
    // Mark voucher as used by this customer
    await Customer.findByIdAndUpdate(customerId, {
      $push: {
        usedVouchers: {
          voucherCode: voucherCode,
          usedAt: new Date(),
          orderId: orderId || null
        }
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Voucher marked as used',
      discount: voucher.discount
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    console.error('Error marking voucher as used:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to use voucher' 
    }, { status: 500 });
  }
}