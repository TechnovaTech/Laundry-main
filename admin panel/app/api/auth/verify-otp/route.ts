import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const twilio = require('twilio');

export async function POST(request: Request) {
  try {
    const { phone, code, role } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Phone and code are required' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
    const jwtSecret = process.env.JWT_SECRET;

    if (!accountSid || !authToken || !verifySid || !jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      const token = jwt.sign(
        { phone, role: role || 'customer' },
        jwtSecret,
        { expiresIn: '30d' }
      );

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        phone
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired OTP'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Twilio verify OTP error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to verify OTP',
      details: error.code ? `Error code: ${error.code}` : undefined
    }, { status: 500 });
  }
}
