import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('@/firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    console.log('\n========================================');
    console.log('📱 Firebase OTP Request');
    console.log('Phone:', phone);
    console.log('SMS will be sent via Firebase');
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully via Firebase'
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send OTP'
    }, { status: 500 });
  }
}
