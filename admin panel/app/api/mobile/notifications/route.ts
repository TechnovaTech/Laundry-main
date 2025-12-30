import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get('audience'); // 'customers' or 'partners'

    if (!audience || !['customers', 'partners'].includes(audience)) {
      return NextResponse.json(
        { success: false, error: 'Valid audience parameter required (customers or partners)' },
        { status: 400 }
      );
    }

    // Fetch notifications for the specific audience or 'Both'
    const notifications = await db.collection('notifications')
      .find({
        status: 'sent',
        $or: [
          { audience: audience === 'customers' ? 'Customers' : 'Partners' },
          { audience: 'Both' }
        ]
      })
      .sort({ sentAt: -1 })
      .limit(50)
      .toArray();

    // Transform notifications for mobile app format
    const mobileNotifications = notifications.map(notification => ({
      id: notification._id.toString(),
      title: notification.title,
      message: notification.message,
      timestamp: notification.sentAt,
      read: false, // Default to unread for new notifications
      type: audience === 'customers' ? 'order' : 'pickup' // Default type based on audience
    }));

    return NextResponse.json({
      success: true,
      data: mobileNotifications
    });
  } catch (error) {
    console.error('Failed to fetch mobile notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}