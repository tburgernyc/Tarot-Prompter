// app/api/check-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getEnv } from '@/lib/env';

export async function GET(request: NextRequest) {
  try {
    const env = getEnv();
    const { authenticated, actorId } = await isAuthenticated(
      env.APP_COOKIE_SECRET,
      env.APP_COOKIE_TTL_DAYS
    );

    if (!authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, actorId });
  } catch (error) {
    console.error('[check-auth] Error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
