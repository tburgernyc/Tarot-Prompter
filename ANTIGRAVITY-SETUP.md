# Tarot Light Path Script Generator — Setup & Deployment Guide

## Project Overview

**Antigravity IDE** is a semi-live YouTube tarot script generator designed for Tim B. / Tarot Light Path.

**Workflow:**
1. **Phase 1:** Input sign, date, topic, length → Generate cold open + intro + grounding script
2. **Phase 2:** Record yourself reading 12 cards + bottom card aloud → App transcribes, validates, verifies astrology
3. **Phase 3:** Generate Part 2 (spread walkthrough + actions + outro) + full combined script, ready to read on camera

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Runtime:** Node.js ≥20.9 (pin 20.11.1)
- **Database:** Vercel Postgres + Prisma 7.2.0
- **LLM:** OpenAI (gpt-5.2-pro for primary, gpt-4o-mini for fast/transcription)
- **Styling:** Tailwind CSS 4.1.18
- **Validation:** Zod 4.3.5
- **Streaming:** OpenAI streaming API
- **Deployment:** Vercel (serverless)

## Local Development Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd antigravity-tarot-script-gen
nvm install 20.11.1
nvm use 20.11.1
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Required
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
APP_PASSWORD=<strong-password-min-32-chars>
APP_COOKIE_SECRET=<strong-secret-min-32-chars>

# Optional (with sensible defaults)
APP_COOKIE_TTL_DAYS=14
OPENAI_MODEL_PRIMARY=gpt-5.2-pro
OPENAI_MODEL_FAST=gpt-4o-mini
LOG_LEVEL=info
MOCK_OPENAI=false
MAX_COST_USD_PER_SESSION=2.50
WEB_SEARCH_CACHE_TTL_HOURS=24
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
# This creates the schema and generates Prisma Client
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000/unlock → Enter APP_PASSWORD → Start creating readings.

## Vercel Deployment

### 1. Push to GitHub

```bash
git remote add origin <github-repo>
git push -u origin main
```

### 2. Connect to Vercel

- Go to [vercel.com](https://vercel.com)
- Click "New Project" → Select your GitHub repo
- Framework: Next.js (auto-detected)
- Root Directory: `.`

### 3. Environment Variables in Vercel

In Vercel project settings → Environment Variables:

```
OPENAI_API_KEY = sk-...
DATABASE_URL = postgresql://...
APP_PASSWORD = <your-strong-password>
APP_COOKIE_SECRET = <your-strong-secret>
NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
```

### 4. Database

- Use **Vercel Postgres** for the easiest setup:
  - In Vercel dashboard → Storage → Create Database (Postgres)
  - Copy the `DATABASE_URL` to environment variables
  - Run migrations after first deploy (or via GitHub Actions)

### 5. Deploy

```bash
git push
# Vercel auto-deploys on main
```

After deploy, run migrations:

```bash
vercel env pull
npx prisma migrate deploy
```

## Local QA Checklist

- [ ] Unlock with APP_PASSWORD works
- [ ] Create new session with sign + date + topic
- [ ] Generate Part 1 script (streaming output)
- [ ] Upload audio file (12 cards + bottom card reading)
- [ ] Transcription appears correctly
- [ ] Parse spread validates card names
- [ ] Astrology fetch returns moon phase + transits
- [ ] Generate Part 2 script (woven astrology, actions, TLP v3.4 compliance)
- [ ] Full script combines Part 1 + Part 2
- [ ] Export to .txt and markdown
- [ ] Regenerate Part 2 (preserves astrology cache)
- [ ] Cost tracking displays
- [ ] Session list + search works
- [ ] Voice Packs page shows defaults
- [ ] Settings page loads models + cache status

## Smoke Test (Mock Mode)

```bash
MOCK_OPENAI=true npm run dev
```

This skips actual OpenAI calls and returns deterministic sample outputs for end-to-end testing.

## Troubleshooting

### "DATABASE_URL not found"
Ensure `.env.local` is in root directory and `npm run dev` is re-run after adding env vars.

### "Prisma migration fails"
```bash
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev --name init
```

### "OPENAI_API_KEY rate limit"
Check your OpenAI account balance and quota. Implement stricter rate limiting in `/api/session/[id]/generate-part1`.

### "Audio upload fails"
Ensure audio file is < 20MB and in WAV/MP3/M4A format. Check multipart handler in `/api/session/[id]/transcribe-spread`.

## Security Notes

- **Cookie:** HttpOnly, Secure (prod only), SameSite=Lax
- **Unlocking:** Rate-limited to 3 attempts per 15 minutes with exponential backoff
- **Audio uploads:** Size-limited to 20MB; virus scanning not included (add VirusTotal if needed)
- **Astrology cache:** Cached by date + timezone; no PII stored
- **Cost control:** Enforced per-session; warns if approaching MAX_COST_USD_PER_SESSION

## File Structure

```
antigravity-tarot-script-gen/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard
│   ├── unlock/
│   │   └── page.tsx                # Password gate
│   ├── new/
│   │   └── page.tsx                # Session wizard
│   ├── session/
│   │   └── [id]/
│   │       ├── page.tsx            # Guided session flow
│   │       ├── layout.tsx
│   ├── teleprompter/
│   │   └── [id]/
│   │       └── page.tsx            # Teleprompter view
│   ├── voice-packs/
│   │   └── page.tsx                # Voice pack management
│   ├── settings/
│   │   └── page.tsx                # App settings
│   └── api/
│       ├── unlock/
│       │   └── route.ts
│       └── session/
│           └── [id]/
│               ├── route.ts
│               ├── generate-part1/
│               │   └── route.ts    # Stream Part 1
│               ├── transcribe-spread/
│               │   └── route.ts    # Audio + transcribe
│               ├── parse-spread/
│               │   └── route.ts
│               ├── fetch-astrology/
│               │   └── route.ts    # Web search + cache
│               ├── generate-part2/
│               │   └── route.ts    # Stream Part 2
│               └── regenerate-part2/
│                   └── route.ts    # Reuse cached astro
│
├── lib/
│   ├── auth.ts                     # Cookie + password logic
│   ├── db.ts                       # Prisma client
│   ├── cost.ts                     # Cost tracking
│   ├── env.ts                      # Typed env validation (t3-oss)
│   ├── logger.ts                   # Structured logging
│   ├── openai.ts                   # OpenAI client + streaming
│   ├── prompt/
│   │   ├── tlp_master_v3_4.ts      # TLP canonical prompt (VERBATIM)
│   │   ├── voicePacks.ts           # Voice pack schema + resolver
│   │   ├── compiler.ts             # Compose system/dev/user messages
│   │   └── validators.ts           # Post-gen validation
│   ├── spread/
│   │   ├── parser.ts               # Card name normalization + validation
│   │   ├── astrology.ts            # Web search + moon phase + transits
│   │   └── normalizer.ts           # Card alias handling
│   └── utils.ts
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Alert.tsx
│   │   └── Spinner.tsx
│   ├── StreamingText.tsx           # Real-time script display
│   ├── AudioRecorder.tsx           # Mic capture + upload
│   ├── SessionList.tsx
│   ├── SpreadValidator.tsx         # Manual card confirmation
│   └── ScriptExporter.tsx          # .txt / markdown download
│
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── migrations/
│       └── [auto-generated]
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── .env.local                      # Local secrets (never commit)
├── .env.example                    # Template
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── package.json                    # All pinned versions
├── .nvmrc                          # Node 20.11.1
├── README.md
└── ANTIGRAVITY-SETUP.md            # This file
```

## Deployment Checklist

- [ ] All env vars set in Vercel
- [ ] Database created and migrated
- [ ] OPENAI_API_KEY valid and funded
- [ ] APP_PASSWORD and APP_COOKIE_SECRET are cryptographically strong
- [ ] NEXT_PUBLIC_APP_URL matches deployed domain
- [ ] Build succeeds: `npm run build`
- [ ] Manual QA on staging environment
- [ ] Monitoring/logging configured (optional: Sentry, Datadog)
- [ ] Docs shared with team
- [ ] Backup strategy for audio files (optional: S3)

## Next Steps After Launch

1. **Collect usage metrics** → Refine Part 2 generation based on live readings
2. **User feedback** → Adjust hook library / tone / action embedding
3. **Voice Pack iteration** → Create 3–5 curated packs (Direct, Mystical, Tight, Expansive, etc.)
4. **Audio archive** → Consider S3 storage for long-term session backups
5. **A/B testing** → Test different hook styles, astrology integration depths, action phrasing

---

**Built with ❤️ for Tarot Light Path | Tim B.**
