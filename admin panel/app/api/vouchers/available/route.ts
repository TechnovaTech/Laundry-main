import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import Customer from '@/models/Customer';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID is required' }, { status: 400 });
    }
    
    // Get all active vouchers
    const allVouchers = await Voucher.find({ isActive: true }).sort({ createdAt: -1 });
    
    // Get customer's used vouchers
    const customer = await Customer.findById(customerId);
    const usedVoucherCodes = customer?.usedVouchers?.map((v: any) => v.voucherCode) || [];
    
    // Filter out vouchers that this customer has already used
    const availableVouchers = allVouchers.filter(voucher => 
      !usedVoucherCodes.includes(voucher.code)
    );
    
    return NextResponse.json({ 
      success: true, 
      data: availableVouchers 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    console.error('Error fetching available vouchers:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch available vouchers' 
    }, { status: 500 });
  }
}