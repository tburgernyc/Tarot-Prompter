import { z } from 'zod';
import { TLP_MASTER_PROMPT_V3_4, voicePackSchema, DEFAULT_VOICE_PACK } from './tlp_master_v3_4';

// ============================================================================
// PROMPT COMPILER
// Composes system/developer/user messages for Part 1 and Part 2 generation
// ============================================================================

export interface CompileContext {
  phase: 'part1' | 'part2';
  sign: string;
  topic: string;
  mode: 'collective' | 'querent';
  querentName?: string;
  querentSun?: string;
  querentRising?: string;
  length: 'short' | 'medium' | 'deep';
  timezone: string;
  readingDate: string;
  voicePackOverrides?: z.infer<typeof voicePackSchema>;
  // For part2 only:
  spreadCards?: Record<string, string[]>;
  astrologyData?: Record<string, unknown>;
}

export function compileSystemMessage(context: CompileContext): string {
  return `You are an expert tarot script writer for the YouTube channel Tarot Light Path with Tim B.
You generate conversational, on-camera tarot reading scripts that feel human, grounded, and trustworthy.
All output must be spoken script text only—no stage directions, no meta commentary, no formatting notes.
Adhere strictly to the Tarot Light Path v3.4 master prompt guidelines.`;
}

export function compileDeveloperMessage(context: CompileContext): string {
  const voicePack = context.voicePackOverrides || DEFAULT_VOICE_PACK;

  let msg = `
## TAROT LIGHT PATH — MASTER PROMPT v3.4

${TLP_MASTER_PROMPT_V3_4}

## VOICE PACK (Resolved)

Cadence:
- Use contractions: ${voicePack.cadence?.contractions ?? true}
- Reset line frequency: ${voicePack.cadence?.resetLinesFrequency ?? 'medium'}
- Rhetorical question frequency: ${voicePack.cadence?.rhetoricalQuestionsFrequency ?? 'medium'}

Tone Knobs:
- Warmth: ${voicePack.tone?.warmth ?? 7}/10
- Directness: ${voicePack.tone?.directness ?? 8}/10
- Intensity: ${voicePack.tone?.intensity ?? 6}/10
- Humor: ${voicePack.tone?.humor ?? 2}/5
- Mystical target: ${voicePack.tone?.mysticRatioTarget ?? 0.27} (practical-leaning enforced)

Language:
- Preferred phrases: ${voicePack.language?.preferredPhrases?.join(', ') || 'Default'}
- Banned phrases: ${voicePack.language?.bannedPhrases?.join(', ') || 'None'}
- Avoid symmetry: true

CTA Style:
- Like/Subscribe style: ${voicePack.cta?.likeSubscribeStyle ?? 'standard'}
- Comment prompt style: ${voicePack.cta?.commentPromptStyle ?? 'reflective'}

Output:
- Verbosity bias: ${voicePack.output?.verbosityBias ?? 'balanced'}

Safety Locks:
- Hard rules enforced: true
- No citations in script: true

## READING PARAMETERS

Phase: ${context.phase}
Sign: ${context.sign}
Topic: ${context.topic}
Mode: ${context.mode}
${context.querentName ? `Querent Name: ${context.querentName}` : ''}
${context.querentSun ? `Querent Sun: ${context.querentSun}` : ''}
${context.querentRising ? `Querent Rising: ${context.querentRising}` : ''}
Length: ${context.length}
Date: ${context.readingDate}
Timezone: ${context.timezone}
`;

  if (context.phase === 'part2' && context.spreadCards) {
    msg += `

## SPREAD CARDS (User-provided, already validated)

${JSON.stringify(context.spreadCards, null, 2)}
`;
  }

  if (context.phase === 'part2' && context.astrologyData) {
    msg += `

## VERIFIED ASTROLOGY (DO NOT CITE IN SCRIPT)

${JSON.stringify(context.astrologyData, null, 2)}

Integrate this astrology naturally into the spread walkthrough and timing cues. Never cite sources in the spoken script.
`;
  }

  return msg;
}

export function compileUserMessage(context: CompileContext): string {
  if (context.phase === 'part1') {
    return `Generate the Part 1 script (Cold Open Hook + Intro + Grounding) for a ${context.mode} tarot reading.

Sign: ${context.sign}
Topic: ${context.topic}
Length: ${context.length}
Date: ${context.readingDate}
Timezone: ${context.timezone}

Do not generate the spread walkthrough. Stop after the grounding section, with a natural transition that prompts the user to speak the 12 cards + bottom card.

CRITICAL: Comply with all hard rules from TLP v3.4. Include "Tarot Light Path with Tim B." and the catchphrase "Illuminating truth and guidance from the veil." in the intro.
`;
  }

  if (context.phase === 'part2') {
    return `Generate the Part 2 script (Spread Walkthrough + Astrology + Actions + Closing/Outro) for a ${context.mode} tarot reading.

You have already generated the Part 1 script. Now generate Part 2 based on the validated spread cards and verified astrology.

Sign: ${context.sign}
Topic: ${context.topic}
Length: ${context.length}
Date: ${context.readingDate}
Timezone: ${context.timezone}

CRITICAL:
- Follow the Anchor + Clarifiers structure exactly.
- Weave astrology naturally; never cite sources.
- Embed 3–7 actions naturally (not a list dump); include one boundary script.
- Use exactly ONE realism line from the pool; do not repeat or stack.
- Mention each card name at least once naturally within its section.
- Handle reversals naturally (blockage, delay, distortion, internalization, lesson).
- Repeat the catchphrase "Illuminating truth and guidance from the veil." in the outro.
- Match the length target (short≈350, medium≈1500, deep≈3000 words ±7%).
`;
  }

  return '';
}

// ============================================================================
// WORD COUNT TARGETS & BUDGET HELPERS
// ============================================================================

export const WORD_COUNT_TARGETS: Record<string, { target: number; tolerance: number }> = {
  short: { target: 350, tolerance: 0.07 },
  medium: { target: 1500, tolerance: 0.07 },
  deep: { target: 3000, tolerance: 0.07 },
};

export function getWordCountRange(length: 'short' | 'medium' | 'deep') {
  const { target, tolerance } = WORD_COUNT_TARGETS[length];
  const min = Math.floor(target * (1 - tolerance));
  const max = Math.ceil(target * (1 + tolerance));
  return { min, max, target };
}
