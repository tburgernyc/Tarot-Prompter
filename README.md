# Tarot Light Path Script Generator

**Production-ready Next.js 16 app for generating YouTube tarot reading scripts in real-time.**

## Overview

**Antigravity IDE** is a semi-live script generator designed for Tim B. / Tarot Light Path. It captures your live card readings and generates polished YouTube scripts using the **Tarot Light Path v3.4 master prompt** with verified astrology integration.

### Workflow

1. **Phase 1: Setup & Part 1 Generation**
   - Input: sign, date, topic, reading length, timezone
   - Output: Cold open hook + intro + grounding script
   - Ready to film

2. **Phase 2: Live Card Capture**
   - Press "Record" → Read 12 cards + bottom card aloud
   - App transcribes using OpenAI audio API
   - Validates card names (fuzzy matching against Rider-Waite deck)
   - Flag for manual review if uncertain

3. **Phase 3: Part 2 & Full Script**
   - Fetch verified astrology (moon phase, transits, aspects) via web search
   - Generate Part 2: spread walkthrough + woven astrology + actions + outro
   - Combine Part 1 + Part 2 into complete, ready-to-read script
   - Stream output for real-time display
   - Export .txt / markdown for teleprompter

## Features

- ✅ **TLP v3.4 Master Prompt** embedded as canonical spec
- ✅ **Voice Pack System** for style customization (cadence, tone, intensity, etc.) without weakening hard rules
- ✅ **Verified Astrology** via web search; cached by date/timezone; never cited in script
- ✅ **Real-time Streaming** script generation with React hooks
- ✅ **Audio Transcription** via OpenAI (gpt-4o-mini-transcribe)
- ✅ **Spread Validation** with fuzzy card name matching
- ✅ **Cost Tracking** per session; enforced budget limits
- ✅ **Session Management** with history, duplication, and version control
- ✅ **Teleprompter View** with speed + font controls
- ✅ **Export Options** (.txt, markdown)
- ✅ **HTTP-Only Cookie Auth** with password gate (no login infrastructure)
- ✅ **Rate Limiting** on unlock and API routes
- ✅ **Strict TypeScript** & Zod validation everywhere
- ✅ **Vercel Ready** with built-in postgres integration

## Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Runtime** | Node.js 20.11.1 |
| **Database** | Vercel Postgres + Prisma 7.2.0 |
| **LLM** | OpenAI (gpt-5.2-pro, gpt-4o-mini) |
| **Styling** | Tailwind CSS 4.1.18 |
| **Validation** | Zod 4.3.5 |
| **Deployment** | Vercel (serverless) |

## Quick Start

### Local Development

```bash
# 1. Clone & install
git clone <repo>
cd antigravity-tarot-script-gen
nvm use 20.11.1
npm install

# 2. Set up .env.local (see below)
cp .env.example .env.local
# Edit with your OpenAI key, database URL, password, secret

# 3. Database
npx prisma migrate dev --name init

# 4. Run
npm run dev
```

Open http://localhost:3000/unlock → Enter `APP_PASSWORD` → Create readings.

### Environment Variables (Required)

```env
# Secrets
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
APP_PASSWORD=<min-32-chars>
APP_COOKIE_SECRET=<min-32-chars>

# Optional (defaults provided)
APP_COOKIE_TTL_DAYS=14
OPENAI_MODEL_PRIMARY=gpt-5.2-pro
OPENAI_MODEL_FAST=gpt-4o-mini
LOG_LEVEL=info
MOCK_OPENAI=false
MAX_COST_USD_PER_SESSION=2.50
WEB_SEARCH_CACHE_TTL_HOURS=24
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deploy to Vercel

```bash
git push
# Vercel auto-deploys on main
# Then set environment variables in Vercel dashboard
# And run: vercel env pull && npx prisma migrate deploy
```

## Routes & Features

### App Routes

| Route | Purpose |
|-------|---------|
| `/unlock` | Password gate |
| `/` | Dashboard (session list + create new) |
| `/new` | Session wizard (sign, date, topic, length) |
| `/session/[id]` | Guided flow (Part 1 → record → Part 2 → export) |
| `/teleprompter/[id]` | Reading script with speed/font controls |
| `/voice-packs` | Create/edit/manage voice packs |
| `/settings` | Models, reasoning, costs, cache status |

### API Routes

All endpoints require valid authentication cookie; return 401 if unauthorized.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/unlock` | POST | Authenticate with password |
| `/api/session/create` | POST | Create new reading session |
| `/api/session/[id]` | GET | Fetch session details |
| `/api/session/[id]/generate-part1` | POST | Stream Part 1 script (with reasoning) |
| `/api/session/[id]/transcribe-spread` | POST | Transcribe audio → validate cards |
| `/api/session/[id]/parse-spread` | POST | Parse spread JSON from raw text |
| `/api/session/[id]/fetch-astrology` | POST | Web search + cache astrology data |
| `/api/session/[id]/generate-part2` | POST | Stream Part 2 (spread + actions + outro) |
| `/api/session/[id]/regenerate-part2` | POST | Regenerate Part 2; reuse cached astrology |
| `/api/voice-packs` | GET/POST/PATCH/DELETE | CRUD voice packs |

## Key Files

```
antigravity-tarot-script-gen/
├── lib/
│   ├── auth.ts                     # HTTP-only cookie + password
│   ├── openai.ts                   # OpenAI client + streaming
│   ├── env.ts                      # Typed env validation
│   ├── cost.ts                     # Usage + budget tracking
│   ├── logger.ts                   # Structured logging
│   ├── prompt/
│   │   ├── tlp_master_v3_4.ts      # TLP v3.4 (canonical)
│   │   ├── voicePacks.ts           # Voice pack schema
│   │   ├── compiler.ts             # System/dev/user message composition
│   │   └── validators.ts           # Post-gen quality checks
│   └── spread/
│       ├── parser.ts               # Card name normalization
│       ├── astrology.ts            # Web search + caching
│       └── normalizer.ts           # Rider-Waite alias handling
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── unlock/page.tsx             # Password gate
│   ├── session/[id]/page.tsx       # Main workflow
│   ├── teleprompter/[id]/page.tsx  # Reading view
│   ├── voice-packs/page.tsx        # Voice pack UI
│   ├── settings/page.tsx           # App settings
│   └── api/
│       ├── unlock/route.ts         # POST unlock
│       └── session/[id]/
│           ├── generate-part1/route.ts
│           ├── transcribe-spread/route.ts
│           ├── parse-spread/route.ts
│           ├── fetch-astrology/route.ts
│           ├── generate-part2/route.ts
│           └── regenerate-part2/route.ts
├── components/
│   ├── StreamingText.tsx           # Real-time script display
│   ├── AudioRecorder.tsx           # Mic capture + upload
│   ├── SpreadValidator.tsx         # Manual card confirmation
│   ├── ScriptExporter.tsx          # Download .txt / markdown
│   └── ui/                         # Headless components
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── migrations/
└── package.json                    # Pinned versions + scripts
```

## Tarot Light Path v3.4 Master Prompt

The app embeds the **TLP v3.4 master prompt verbatim** in `/lib/prompt/tlp_master_v3_4.ts`. This is the canonical behavioral spec for all script generation. It includes:

- **Hard rules** (no "this card means", catchphrase placement, realism line rule, etc.)
- **Voice + delivery engine** (contractions, behavior language, practical-leaning 60-75%)
- **Verified astrology** (moon phase, transits, retrograde status, major aspects)
- **Reading modes** (collective vs specific querent)
- **Hook phrase library** (20 customizable opening lines)
- **Spread walkthrough structure** (Anchor + Clarifiers, exact section order)
- **Actions + boundary scripts** (3-7 embedded actions, one realism line)
- **Closing synthesis + outro** (recap, timing cue, comment prompt, catchphrase)

Voice Packs allow **style adjustments** (cadence, tone, intensity, humor) but **never override hard rules**.

## Voice Pack System

**Voice Packs** are optional JSON configurations that customize script generation without editing the master prompt.

### Voice Pack Schema (Zod)

```typescript
{
  cadence: {
    contractions: boolean,
    resetLinesFrequency: 'low' | 'medium' | 'high',
    rhetoricalQuestionsFrequency: 'low' | 'medium' | 'high',
  },
  tone: {
    warmth: 0-10,
    directness: 0-10,
    intensity: 0-10,
    humor: 0-5,
    mysticRatioTarget: 0.25-0.30,  // practical-leaning enforced
  },
  language: {
    bannedPhrases: string[],
    preferredPhrases: string[],
    avoidSymmetryCue: true,  // always true
  },
  cta: {
    likeSubscribeStyle: 'soft' | 'standard' | 'firm',
    commentPromptStyle: 'reflective' | 'direct' | 'community',
  },
  output: {
    verbosityBias: 'tight' | 'balanced' | 'expansive',
  },
  safetyLocks: {
    enforceHardRules: true,     // immutable
    noCitationsInScript: true,  // immutable
  },
}
```

### Example Voice Packs

You can create packs like:

- **TLP Default** (7/10 warmth, 8/10 directness, balanced verbosity)
- **More Direct** (6/10 warmth, 9/10 directness, tight verbosity)
- **More Mystical** (9/10 warmth, 6/10 directness, expansive verbosity)
- **NYC Grounded** (8/10 warmth, 9/10 directness, tight verbosity, high reset-line frequency)

All packs enforce hard rules (catchphrase, realism line, no "this card means", etc.).

## Cost Control

- **Per-session budget** enforced via `MAX_COST_USD_PER_SESSION` (default: $2.50)
- **Usage tracking** stored in `ReadingSession.usageJson`
- **Streaming generation** allows cancellation mid-stream if budget exceeded
- **Astrology cache** (24h default) reduces repeat calls

## QA Checklist

- [ ] Unlock with password works
- [ ] Create session with sign + date + topic
- [ ] Generate Part 1 (cold open + intro + grounding)
- [ ] Record audio (12 cards + bottom card)
- [ ] Transcription appears
- [ ] Card validation (manual if needed)
- [ ] Astrology fetch (moon phase + transits)
- [ ] Generate Part 2 (spread + actions + outro)
- [ ] Full script combines both parts
- [ ] Export to .txt and markdown
- [ ] Teleprompter view (speed + font controls)
- [ ] Regenerate Part 2 (preserves cached astrology)
- [ ] Cost display + budget enforcement
- [ ] Session list + search works
- [ ] Voice Packs CRUD works
- [ ] Settings page loads

## Smoke Test (Mock Mode)

```bash
MOCK_OPENAI=true npm run dev
```

Runs end-to-end without OpenAI calls; uses deterministic sample outputs.

## Security

- **Password gate** → HTTP-only signed cookies (HMAC-SHA256)
- **Constant-time comparison** for password & cookie verification
- **Rate limiting** on `/api/unlock` (3 attempts per 15 min, exponential backoff)
- **Audio upload limit** 20MB
- **Zod validation** on all inputs
- **Cost enforcement** prevents runaway spend
- **No PII** stored; only first names for querent readings

## Performance

- **Streaming responses** for real-time script display
- **Astrology caching** by (date, timezone) for 24 hours
- **Prisma connection pooling** via Vercel Postgres
- **Database indexes** on `actorId`, `status`, `createdAt`
- **Session-level cost tracking** with early budget exit

## Troubleshooting

### "DATABASE_URL not found"
Ensure `.env.local` is in root; restart dev server.

### "Prisma migration fails"
```bash
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev --name init
```

### "OPENAI_API_KEY rate limit"
Check OpenAI account balance. Implement stricter rate limiting on API routes.

### "Audio transcription returns garbage"
Ensure audio file is clear, mono/stereo, < 20MB, valid WAV/MP3/M4A.

## Deployment Notes

1. **GitHub + Vercel** connection is fastest
2. **Vercel Postgres** setup (auto-linked in Vercel dashboard)
3. **Environment variables** copied from `.env.local` to Vercel project
4. **Post-deploy migration** via:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```
5. **Optional:** Add Sentry / Datadog for observability

## Next Steps After Launch

1. Gather usage metrics → refine Part 2 generation
2. User feedback → adjust hook library, tone, actions
3. Create 5 curated Voice Packs (Direct, Mystical, Tight, Expansive, etc.)
4. Archive audio files to S3 for long-term storage
5. A/B test hook styles, astrology integration depth, action phrasing

## License

Proprietary. Built for Tarot Light Path / Tim B.

---

**Need help?** See `ANTIGRAVITY-SETUP.md` for detailed setup & deployment steps.
