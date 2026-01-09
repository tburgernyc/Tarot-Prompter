// app/api/session/[id]/generate-part1/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { compilePrompt } from '@/lib/prompt/compiler';
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

    // Compile prompt with TLP v3.4 + voice pack overrides
    const systemPrompt = compilePrompt({
      tlpPrompt: TLP_MASTER_V3_4.system,
      voiceOverrides: session.voicePackId ? {} : undefined,
    });

    // Create user message
    const userMessage = `
Sign: ${session.mode === 'collective' ? session.sign : session.querentSun}
Topic: ${session.topic}
Length: ${session.length}
Date: ${session.readingDate}

Generate Part 1 of the tarot reading script.
    `.trim();

    // Call OpenAI API with streaming
    // NOTE: This is a stub - in production, integrate with OpenAI streaming
    const mockPart1 = `[COLD OPEN]\n"Welcome, ${session.mode === 'collective' ? session.sign : session.querentName || 'dear one'}. I'm here to illuminate truth and guidance from the veil."\n\n[INTRO]\nToday's reading focuses on ${session.topic}. We'll explore what the cards reveal about your path forward.\n\n[GROUNDING]\nLet me ground us in this moment. Take a breath with me...`;

    // Update session with Part 1
    await db.readingSession.update({
      where: { id: sessionId },
      data: {
        part1Script: mockPart1,
        status: 'part1_ready',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ part1Script: mockPart1 });
  } catch (error) {
    console.error('Error generating Part 1:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
