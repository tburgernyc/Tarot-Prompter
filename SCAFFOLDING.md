# Tarot Light Path Script Generator — Project Scaffolding Guide

## Overview

You now have a complete **Next.js 16 application structure** ready to be organized and built. This guide explains exactly where each file goes and how to get the app running locally.

## Project Structure (What to Create)

Copy each file to its respective location:

```
antigravity-tarot-script-gen/
│
├── .env.example                    # Template for environment variables
├── .env.local                      # Your local secrets (copy from .env.example)
├── .gitignore                      # Git ignore rules
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS config
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies + scripts (pinned versions)
├── .nvmrc                          # Node 20.11.1
│
├── lib/
│   ├── env.ts                      # Typed environment validation (getEnv())
│   ├── db.ts                       # Prisma client singleton
│   ├── auth.ts                     # HTTP-only cookie auth (from lib-auth.ts)
│   ├── prompt/
│   │   ├── tlp_master_v3_4.ts      # TLP v3.4 master prompt (from tlp-master-v3-4.ts)
│   │   ├── compiler.ts             # Prompt composition (from prompt-compiler.ts)
│   │   └── validators.ts           # Post-gen quality checks
│   └── spread/
│       ├── parser.ts               # Card validation (from spread-parser.ts)
│       └── astrology.ts            # Web search + caching
│
├── prisma/
│   ├── schema.prisma               # SQLite database schema (UPDATED FOR SQLITE)
│   └── migrations/
│       └── [auto-generated]
│
├── app/
│   ├── layout.tsx                  # Root layout (from app-layout.tsx)
│   ├── globals.css                 # Global styles (from app-globals.css)
│   ├── page.tsx                    # Dashboard (from app-page.tsx)
│   │
│   ├── unlock/
│   │   └── page.tsx                # Password gate (from app-unlock-page.tsx)
│   │
│   ├── new/
│   │   └── page.tsx                # Session wizard (CREATE THIS)
│   │
│   ├── session/
│   │   └── [id]/
│   │       ├── page.tsx            # Main reading flow (CREATE THIS)
│   │       └── layout.tsx          # Session layout (CREATE THIS)
│   │
│   ├── api/
│   │   ├── unlock/
│   │   │   └── route.ts            # POST /api/unlock (from app-api-unlock-route.ts)
│   │   ├── check-auth/
│   │   │   └── route.ts            # GET /api/check-auth (from app-api-check-auth-route.ts)
│   │   ├── sessions/
│   │   │   └── route.ts            # GET/POST /api/sessions (from app-api-sessions-route.ts)
│   │   └── session/
│   │       └── [id]/
│   │           ├── route.ts        # GET session details (CREATE THIS)
│   │           └── generate-part1/
│   │               └── route.ts    # POST streaming Part 1 (CREATE THIS)
│   │
│   └── settings/
│       └── page.tsx                # Settings page (CREATE THIS)
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # Reusable button (CREATE THIS)
│   │   ├── Input.tsx               # Input field (CREATE THIS)
│   │   ├── Card.tsx                # Card component (CREATE THIS)
│   │   └── ...other UI components
│   ├── StreamingText.tsx           # Real-time script display (CREATE THIS)
│   ├── AudioRecorder.tsx           # Mic capture (CREATE THIS)
│   └── SpreadValidator.tsx         # Card confirmation UI (CREATE THIS)
│
├── public/
│   └── favicon.ico
│
├── README.md                       # Documentation (from README.md)
├── ANTIGRAVITY-SETUP.md            # Setup guide (from ANTIGRAVITY-SETUP.md)
├── ARCHITECTURE.md                 # Architecture (from ARCHITECTURE.md)
└── QUICKSTART.md                   # Quick start (from QUICKSTART.md)
```

## Step-by-Step Setup

### 1. Create Project Directory

```bash
mkdir antigravity-tarot-script-gen
cd antigravity-tarot-script-gen
git init
```

### 2. Copy Configuration Files

Create or copy these files to the root:

- `.env.example` (from template provided)
- `.env.local` (copy from .env.example, fill in your secrets)
- `.gitignore` (from template)
- `tsconfig.json` (from template)
- `tailwind.config.js` (from template)
- `next.config.ts` (from template)
- `package.json` (from template with pinned versions)
- `.nvmrc` (containing: `20.11.1`)

### 3. Create Library Files

Create `lib/` directory and copy:

```bash
mkdir -p lib/prompt lib/spread

# Copy core files
cp lib-auth.ts lib/auth.ts
cp lib-env.ts lib/env.ts
cp lib-db.ts lib/db.ts
cp tlp-master-v3-4.ts lib/prompt/tlp_master_v3_4.ts
cp prompt-compiler.ts lib/prompt/compiler.ts
```

Create stubs for:
- `lib/prompt/validators.ts` (post-gen validation)
- `lib/spread/parser.ts` (card parsing — from spread-parser.ts)
- `lib/spread/astrology.ts` (web search caching)
- `lib/logger.ts` (structured logging)
- `lib/cost.ts` (cost tracking)

### 4. Create Prisma Schema

```bash
mkdir -p prisma
cp prisma-schema.prisma prisma/schema.prisma
```

### 5. Create App Structure

```bash
mkdir -p app/unlock app/new app/session/\[id\] app/api/unlock app/api/check-auth app/api/sessions
```

Copy these files:

```bash
cp app-layout.tsx app/layout.tsx
cp app-globals.css app/globals.css
cp app-page.tsx app/page.tsx
cp app-unlock-page.tsx app/unlock/page.tsx
cp app-api-unlock-route.ts app/api/unlock/route.ts
cp app-api-check-auth-route.ts app/api/check-auth/route.ts
cp app-api-sessions-route.ts app/api/sessions/route.ts
```

Create stubs for:
- `app/new/page.tsx` (session wizard)
- `app/session/[id]/page.tsx` (main reading flow)
- `app/session/[id]/layout.tsx` (session layout)
- `app/api/session/[id]/route.ts` (GET session details)
- `app/api/session/[id]/generate-part1/route.ts` (streaming API)
- `app/settings/page.tsx` (settings page)

### 6. Create Components

```bash
mkdir -p components/ui
```

Create reusable UI components:
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Card.tsx`
- `components/ui/Select.tsx`
- `components/ui/Alert.tsx`
- `components/ui/Spinner.tsx`

Create feature components:
- `components/StreamingText.tsx` (real-time text display)
- `components/AudioRecorder.tsx` (mic capture + upload)
- `components/SpreadValidator.tsx` (card confirmation)
- `components/ScriptExporter.tsx` (download options)

### 7. Install Dependencies

```bash
nvm use 20.11.1
npm install
```

### 8. Set Up Environment

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with:
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=file:./dev.db
APP_PASSWORD=YourSuperSecurePassword123456789!
APP_COOKIE_SECRET=YourSuperSecureSecret123456789Key
```

### 9. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# This creates:
# - dev.db (SQLite database)
# - prisma/migrations/[timestamp]_init/
```

### 10. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

**You should see:**
- Redirect to `/unlock`
- Password gate
- Enter `APP_PASSWORD` from .env.local
- Redirect to `/` (dashboard)

## File Reference Map

Here's where each provided file goes:

| Provided File | Destination | Notes |
|---|---|---|
| `package.json` | `./package.json` | Root |
| `tsconfig.json` | `./tsconfig.json` | Root |
| `tailwind.config.js` | `./tailwind.config.js` | Root |
| `next.config.ts` | `./next.config.ts` | Root |
| `.env.example` | `./.env.example` | Root template |
| `.gitignore` | `./.gitignore` | Root |
| `prisma-schema.prisma` | `./prisma/schema.prisma` | Renamed |
| `lib-auth.ts` | `./lib/auth.ts` | Renamed + moved |
| `lib-env.ts` | `./lib/env.ts` | Renamed + moved |
| `lib-db.ts` | `./lib/db.ts` | Renamed + moved |
| `tlp-master-v3-4.ts` | `./lib/prompt/tlp_master_v3_4.ts` | Renamed + moved |
| `prompt-compiler.ts` | `./lib/prompt/compiler.ts` | Renamed + moved |
| `spread-parser.ts` | `./lib/spread/parser.ts` | Renamed + moved |
| `app-layout.tsx` | `./app/layout.tsx` | Renamed + moved |
| `app-globals.css` | `./app/globals.css` | Renamed + moved |
| `app-page.tsx` | `./app/page.tsx` | Renamed + moved |
| `app-unlock-page.tsx` | `./app/unlock/page.tsx` | Renamed + moved |
| `app-api-unlock-route.ts` | `./app/api/unlock/route.ts` | Renamed + moved |
| `app-api-check-auth-route.ts` | `./app/api/check-auth/route.ts` | Renamed + moved |
| `app-api-sessions-route.ts` | `./app/api/sessions/route.ts` | Renamed + moved |
| `README.md` | `./README.md` | Root |
| `ARCHITECTURE.md` | `./ARCHITECTURE.md` | Root |
| `ANTIGRAVITY-SETUP.md` | `./ANTIGRAVITY-SETUP.md` | Root |
| `QUICKSTART.md` | `./QUICKSTART.md` | Root |

## Files to Create (Stubs/Implementations)

These need to be created as stubs or implemented:

1. **`lib/logger.ts`** — Structured logging
   ```typescript
   export const logger = { info: console.log, warn: console.warn, error: console.error };
   ```

2. **`lib/cost.ts`** — Cost tracking
   ```typescript
   export function trackUsage() { /* ... */ }
   export function checkBudget() { /* ... */ }
   ```

3. **`lib/spread/astrology.ts`** — Web search + caching
   ```typescript
   export async function fetchAstrology() { /* ... */ }
   ```

4. **`lib/prompt/validators.ts`** — Post-gen validation
   ```typescript
   export function validatePart1() { /* ... */ }
   export function validatePart2() { /* ... */ }
   ```

5. **`app/new/page.tsx`** — Session wizard
6. **`app/session/[id]/page.tsx`** — Main reading flow
7. **`app/session/[id]/layout.tsx`** — Session layout
8. **`app/api/session/[id]/route.ts`** — Get session
9. **`app/api/session/[id]/generate-part1/route.ts`** — Stream Part 1
10. **`app/settings/page.tsx`** — Settings page
11. **UI components** — Buttons, Inputs, Cards, etc.
12. **Feature components** — StreamingText, AudioRecorder, etc.

## Verification Checklist

- [ ] Run `npm install` successfully
- [ ] Env vars set in `.env.local`
- [ ] Prisma schema exists at `prisma/schema.prisma`
- [ ] Run `npx prisma generate` without errors
- [ ] Run `npx prisma migrate dev` creates `dev.db`
- [ ] `npm run dev` starts server on http://localhost:3000
- [ ] Visit `/unlock`, password gate appears
- [ ] Enter `APP_PASSWORD`, redirects to `/`
- [ ] Dashboard loads (shows "Create New Reading" button)

## Next Steps

Once the basic structure is in place:

1. **Implement stub files** (lib files, pages, components)
2. **Test unlock flow** → password gate → dashboard
3. **Create new session** → wizard wizard
4. **Build Part 1 generation** → streaming API
5. **Build spread capture** → audio recorder + parser
6. **Build Part 2 generation** → streaming API
7. **Test end-to-end** workflow

---

**All configuration and core logic files are provided. This guide shows exactly where they go and what stubs need to be created.**

Ready to scaffold? Start with Step 1 above.
