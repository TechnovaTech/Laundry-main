import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

delete require.cache[require.resolve('@/models/AdminUser')];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    
    const user = await AdminUser.findOne({ email, password });
    
    if (user) {
      return NextResponse.json({ success: true, data: { role: user.role, email: user.email, username: user.username, name: user.fullName } });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}
