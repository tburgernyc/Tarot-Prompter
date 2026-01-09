// app/api/unlock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import { setAuthCookie, verifyPassword } from '@/lib/auth';
import { nanoid } from 'nanoid';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Simple in-memory rate limiter (for demo; use Redis in production)
const attemptTracker = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const env = getEnv();

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Check rate limit
    const tracker = attemptTracker.get(ip);
    if (tracker) {
      if (tracker.count >= MAX_ATTEMPTS) {
        if (now - tracker.lastAttempt < LOCKOUT_DURATION) {
          return NextResponse.json(
            { error: 'Too many attempts. Try again later.' },
            { status: 429 }
          );
        } else {
          attemptTracker.delete(ip);
        }
      }
    }

    // Verify password
    if (!verifyPassword(password, env.APP_PASSWORD)) {
      const newCount = (tracker?.count || 0) + 1;
      attemptTracker.set(ip, { count: newCount, lastAttempt: now });

      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Clear tracker on success
    attemptTracker.delete(ip);

    // Set auth cookie
    const actorId = nanoid();
    await setAuthCookie(env.APP_COOKIE_SECRET, env.APP_COOKIE_TTL_DAYS, actorId);

    return NextResponse.json({ success: true, actorId });
  } catch (error) {
    console.error('[unlock] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
