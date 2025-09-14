import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_CONFIG } from '../../_config/auth';

export async function POST(request: NextRequest) {
  try {
    const { keyphrase } = await request.json();

    if (keyphrase === AUTH_CONFIG.SECRET_KEYPHRASE) {
      // Set authentication cookie
      const cookieStore = await cookies();
      cookieStore.set('authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * AUTH_CONFIG.SESSION_DURATION_DAYS,
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid keyphrase' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  // Logout endpoint
  const cookieStore = await cookies();
  cookieStore.delete('authenticated');
  
  return NextResponse.json({ success: true });
}
