import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import otpStore from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { phone, code, role } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Phone and code are required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp) {
      return NextResponse.json({
        success: false,
        error: 'OTP expired or not found. Please request a new OTP.'
      }, { status: 400 });
    }

    if (storedOtp === code) {
      otpStore.delete(phone);
      
      const token = jwt.sign(
        { phone, role: role || 'customer' },
        jwtSecret,
        { expiresIn: '30d' }
      );

      console.log('\n✅ OTP Verified Successfully for:', phone, '\n');

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        phone
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid OTP'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to verify OTP'
    }, { status: 500 });
  }
}
