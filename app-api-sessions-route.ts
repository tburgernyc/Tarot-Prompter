// app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getEnv } from '@/lib/env';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const env = getEnv();
    const { authenticated, actorId } = await isAuthenticated(
      env.APP_COOKIE_SECRET,
      env.APP_COOKIE_TTL_DAYS
    );

    if (!authenticated || !actorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.readingSession.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('[sessions] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = getEnv();
    const { authenticated, actorId } = await isAuthenticated(
      env.APP_COOKIE_SECRET,
      env.APP_COOKIE_TTL_DAYS
    );

    if (!authenticated || !actorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sign, topic, length, readingDate, timezone, mode, querentName, querentSun, querentRising } = body;

    const session = await prisma.readingSession.create({
      data: {
        actorId,
        sign,
        topic,
        length,
        readingDate: new Date(readingDate),
        timezone: timezone || 'America/New_York',
        mode: mode || 'collective',
        querentName,
        querentSun,
        querentRising,
        status: 'setup',
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('[sessions POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
