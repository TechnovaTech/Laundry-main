import { NextResponse } from 'next/server';

const twilio = require('twilio');

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !verifySid) {
      return NextResponse.json({ success: false, error: 'Twilio credentials not configured' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      status: verification.status
    });
  } catch (error: any) {
    console.error('Twilio send OTP error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status
    });
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send OTP',
      details: error.code ? `Error code: ${error.code}` : undefined
    }, { status: 500 });
  }
}
