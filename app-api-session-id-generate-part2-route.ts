// app/api/session/[id]/generate-part2/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { TLP_MASTER_V3_4 } from '@/lib/prompt/tlp_master_v3_4';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = params.id;

    // Fetch session
    const session = await db.readingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.spreadJson) {
      return NextResponse.json(
        { error: 'Spread must be recorded first' },
        { status: 400 }
      );
    }

    // Generate mock Part 2
    // In production, fetch astrology data and call OpenAI
    const mockPart2 = `[SPREAD WALKTHROUGH]\n${(session.spreadJson as string[])
      .slice(0, 12)
      .map((card, i) => `Position ${i + 1}: ${card}`)
      .join('\n')}\n\n[ACTIONS]\nBased on this spread, here are your key actions...\n\n[OUTRO]\n"May you walk forward with clarity and trust."`;

    const fullScript = `${session.part1Script}\n\n---\n\n${mockPart2}`;

    // Update session
    await db.readingSession.update({
      where: { id: sessionId },
      data: {
        part2Script: mockPart2,
        fullScript: fullScript,
        status: 'complete',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      part2Script: mockPart2,
      fullScript: fullScript,
    });
  } catch (error) {
    console.error('Error generating Part 2:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
