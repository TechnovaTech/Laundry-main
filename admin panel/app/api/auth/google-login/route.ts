import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Partner from '@/models/Partner';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { credential, idToken, role } = await request.json();

    let ticket;
    if (credential) {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } else if (idToken) {
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } else {
      return NextResponse.json({ success: false, error: 'No credential provided' }, { status: 400 });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    await dbConnect();

    if (role === 'customer') {
      let customer = await Customer.findOne({ email });

      if (!customer) {
        customer = await Customer.create({
          name,
          email,
          googleId,
          profileImage: picture,
          mobile: `google_${googleId}`,
          address: [],
          paymentMethods: [],
          walletBalance: 0,
          loyaltyPoints: 0,
        });
      }

      const token = jwt.sign(
        { customerId: customer._id, email: customer.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      const isNewUser = !customer.address || customer.address.length === 0;

      return NextResponse.json({
        success: true,
        data: {
          customerId: customer._id,
          name: customer.name,
          email: customer.email,
          isNewUser,
        },
        token,
      });
    } else if (role === 'partner') {
      let partner = await Partner.findOne({ email });

      if (!partner) {
        partner = await Partner.create({
          name,
          email,
          googleId,
          profileImage: picture,
          mobile: `google_${googleId}`,
          kycStatus: 'pending',
          isActive: true,
        });
      }

      const token = jwt.sign(
        { partnerId: partner._id, email: partner.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      return NextResponse.json({
        success: true,
        data: {
          partnerId: partner._id,
          _id: partner._id,
          name: partner.name,
          email: partner.email,
          kycStatus: partner.kycStatus,
        },
        token,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ success: false, error: 'Google login failed' }, { status: 500 });
  }
}
