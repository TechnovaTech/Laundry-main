import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = require('@/firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export async function POST(request: Request) {
  try {
    const { phone, code, role, idToken } = await request.json();

    if (!phone || (!code && !idToken)) {
      return NextResponse.json({ success: false, error: 'Phone and verification required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    if (idToken) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      if (decodedToken.phone_number !== phone) {
        return NextResponse.json({
          success: false,
          error: 'Phone number mismatch'
        }, { status: 400 });
      }
    }

    const token = jwt.sign(
      { phone, role: role || 'customer' },
      jwtSecret,
      { expiresIn: '30d' }
    );

    console.log('\n✅ Firebase OTP Verified Successfully for:', phone, '\n');

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      phone
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to verify OTP'
    }, { status: 500 });
  }
}
