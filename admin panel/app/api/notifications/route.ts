import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const notifications = await db.collection('notifications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { title, message, audience, status, sentAt, createdAt } = body;

    if (!title || !message || !audience) {
      return NextResponse.json(
        { success: false, error: 'Title, message, and audience are required' },
        { status: 400 }
      );
    }

    const notification = {
      title,
      message,
      audience,
      status: status || 'draft',
      sentAt: sentAt || null,
      createdAt: createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('notifications').insertOne(notification);

    // If notification is being sent, trigger real-time notifications
    if (status === 'sent') {
      console.log(`Sending notification to ${audience}:`, { title, message });
    }

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...notification }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}