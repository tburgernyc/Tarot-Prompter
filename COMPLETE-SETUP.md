# COMPLETE SETUP GUIDE — Project Reorganization & File Placement

## Overview

All files have been created and documented. This guide tells you exactly where each file goes and how to set up the project from scratch.

---

## File Organization Reference

### Root Directory Files
```
antigravity-tarot-script-gen/
├── package.json                    (NPM dependencies + scripts)
├── tsconfig.json                   (TypeScript config)
├── tailwind.config.js              (Tailwind CSS config)
├── next.config.ts                  (Next.js config)
├── .env.local                      (Environment variables - CREATE THIS)
├── .gitignore                      (Git ignore rules)
└── README.md                       (Project overview)
```

### Library Files (lib/)
```
lib/
├── auth.ts                         (HTTP-only cookies, HMAC-SHA256)
├── env.ts                          (Zod environment validation)
├── db.ts                           (Prisma client singleton)
├── prompt/
│   ├── tlp_master_v3_4.ts         (TLP v3.4 canonical prompt)
│   └── compiler.ts                 (Prompt composition)
└── spread/
    └── parser.ts                   (Card name validation)
```

### App Routes (app/)
```
app/
├── layout.tsx                      (Root layout)
├── globals.css                     (Global styles)
├── page.tsx                        (Dashboard)
├── unlock/
│   └── page.tsx                    (Password gate)
├── new/
│   └── page.tsx                    (Session wizard)
├── session/
│   ├── [id]/
│   │   ├── page.tsx               (Main reading flow)
│   │   ├── layout.tsx             (Session layout)
│   │   └── (api routes below)
│   └── api/
└── api/
    ├── unlock/
    │   └── route.ts               (POST password verification)
    ├── check-auth/
    │   └── route.ts               (GET auth status)
    ├── sessions/
    │   └── route.ts               (GET/POST sessions)
    └── session/
        └── [id]/
            ├── route.ts           (GET/PATCH session)
            ├── generate-part1/
            │   └── route.ts       (POST Part 1 generation)
            └── generate-part2/
                └── route.ts       (POST Part 2 generation)
```

### Components (components/)
```
components/
└── ui/
    ├── Button.tsx                  (Reusable button component)
    ├── Input.tsx                   (Reusable input component)
    └── Card.tsx                    (Reusable card component)
```

### Database (prisma/)
```
prisma/
├── schema.prisma                   (Database schema - SQLite)
└── .env                            (DATABASE_URL)
```

---

## Step-by-Step Setup

### Step 1: Create Project Directory
```bash
mkdir antigravity-tarot-script-gen
cd antigravity-tarot-script-gen
git init
```

### Step 2: Create Directory Structure
```bash
# Root level - no mkdir needed

# lib/
mkdir -p lib/prompt lib/spread

# app/
mkdir -p app/api/unlock app/api/check-auth app/api/sessions app/api/session
mkdir -p app/unlock app/new app/session/\[id\]/generate-part1 app/session/\[id\]/generate-part2

# components/
mkdir -p components/ui

# prisma/
mkdir -p prisma
```

### Step 3: Copy Root Configuration Files
From the provided files, copy these to the root directory:
```bash
# From artifacts:
cp package.json .
cp tsconfig.json .
cp tailwind.config.js .
cp next.config.ts .
cp .env.example .env.local
cp .gitignore .
cp README.md .
```

### Step 4: Copy/Create Library Files
```bash
# Core libraries (lib/)
cp lib-auth.ts lib/auth.ts
cp lib-env.ts lib/env.ts
cp lib-db.ts lib/db.ts
cp tlp-master-v3-4.ts lib/prompt/tlp_master_v3_4.ts
cp prompt-compiler.ts lib/prompt/compiler.ts
cp spread-parser.ts lib/spread/parser.ts
```

### Step 5: Copy/Create App Files
```bash
# Root app files
cp app-layout.tsx app/layout.tsx
cp app-globals.css app/globals.css
cp app-page.tsx app/page.tsx

# Auth pages
cp app-unlock-page.tsx app/unlock/page.tsx

# Session pages
cp app-new-page.tsx app/new/page.tsx
cp app-session-id-page.tsx app/session/\[id\]/page.tsx

# API routes
cp app-api-unlock-route.ts app/api/unlock/route.ts
cp app-api-check-auth-route.ts app/api/check-auth/route.ts
cp app-api-sessions-route.ts app/api/sessions/route.ts
cp app-api-session-id-route.ts app/api/session/\[id\]/route.ts
cp app-api-session-id-generate-part1-route.ts app/api/session/\[id\]/generate-part1/route.ts
cp app-api-session-id-generate-part2-route.ts app/api/session/\[id\]/generate-part2/route.ts
```

### Step 6: Copy/Create Component Files
```bash
# UI components
cp components-ui-button.tsx components/ui/Button.tsx
cp components-ui-input.tsx components/ui/Input.tsx
cp components-ui-card.tsx components/ui/Card.tsx
```

### Step 7: Copy Database Schema
```bash
cp prisma-schema.prisma prisma/schema.prisma
```

### Step 8: Configure Environment
```bash
# .env.local should look like:
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
APP_PASSWORD=YourSuperSecurePassword123456789!
APP_COOKIE_SECRET=YourSuperSecureSecret123456789Key!
DATABASE_URL=file:./dev.db
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Replace placeholders with your actual values:
- `OPENAI_API_KEY` — Get from https://platform.openai.com/api-keys
- `APP_PASSWORD` — Create a strong password (min 32 chars)
- `APP_COOKIE_SECRET` — Create a strong secret (min 32 chars)

### Step 9: Install Dependencies
```bash
nvm use 20.11.1  # Use Node.js 20
npm install
```

### Step 10: Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates `dev.db` in your project root.

### Step 11: Run Local Development Server
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
```

### Step 12: Test the Application
1. **Visit http://localhost:3000** 
   - Should redirect to `/unlock`

2. **Enter password** 
   - Use `APP_PASSWORD` from `.env.local`
   - Should redirect to `/` (dashboard)

3. **Create a reading**
   - Click "Create New Reading"
   - Fill out the form (4-step wizard)
   - Click "Create Reading"
   - Should redirect to `/session/[id]`

4. **Generate Part 1**
   - Click "Generate Part 1"
   - Should display mock script

5. **Record Spread (Manual)**
   - Currently stub - allows manual entry

6. **Generate Part 2**
   - Click "Generate Part 2"
   - Should display mock script

7. **Download Script**
   - Click "Download Script"
   - Full script downloads as `.txt`

---

## File Mapping Reference

| Source File | Destination | Purpose |
|------------|-------------|---------|
| `package.json` | `./package.json` | NPM dependencies |
| `tsconfig.json` | `./tsconfig.json` | TypeScript config |
| `tailwind.config.js` | `./tailwind.config.js` | Tailwind CSS config |
| `next.config.ts` | `./next.config.ts` | Next.js config |
| `.env.example` | `./.env.local` | Environment variables |
| `.gitignore` | `./.gitignore` | Git rules |
| `lib-auth.ts` | `lib/auth.ts` | Authentication |
| `lib-env.ts` | `lib/env.ts` | Environment validation |
| `lib-db.ts` | `lib/db.ts` | Database client |
| `tlp-master-v3-4.ts` | `lib/prompt/tlp_master_v3_4.ts` | Master prompt |
| `prompt-compiler.ts` | `lib/prompt/compiler.ts` | Prompt compilation |
| `spread-parser.ts` | `lib/spread/parser.ts` | Card parsing |
| `prisma-schema.prisma` | `prisma/schema.prisma` | Database schema |
| `app-layout.tsx` | `app/layout.tsx` | Root layout |
| `app-globals.css` | `app/globals.css` | Global styles |
| `app-page.tsx` | `app/page.tsx` | Dashboard |
| `app-unlock-page.tsx` | `app/unlock/page.tsx` | Password gate |
| `app-new-page.tsx` | `app/new/page.tsx` | Session wizard |
| `app-session-id-page.tsx` | `app/session/[id]/page.tsx` | Reading flow |
| `app-api-unlock-route.ts` | `app/api/unlock/route.ts` | Unlock API |
| `app-api-check-auth-route.ts` | `app/api/check-auth/route.ts` | Auth check API |
| `app-api-sessions-route.ts` | `app/api/sessions/route.ts` | Sessions API |
| `app-api-session-id-route.ts` | `app/api/session/[id]/route.ts` | Session API |
| `app-api-session-id-generate-part1-route.ts` | `app/api/session/[id]/generate-part1/route.ts` | Part 1 API |
| `app-api-session-id-generate-part2-route.ts` | `app/api/session/[id]/generate-part2/route.ts` | Part 2 API |
| `components-ui-button.tsx` | `components/ui/Button.tsx` | Button component |
| `components-ui-input.tsx` | `components/ui/Input.tsx` | Input component |
| `components-ui-card.tsx` | `components/ui/Card.tsx` | Card component |

---

## Verification Checklist

After setup, verify each step:

### ✅ Installation
- [ ] `npm install` completed without errors
- [ ] `npx prisma generate` created client
- [ ] `npx prisma migrate dev --name init` created `dev.db`
- [ ] `npm run dev` started server on port 3000

### ✅ Authentication
- [ ] Visit http://localhost:3000
- [ ] Redirected to /unlock
- [ ] Enter `APP_PASSWORD` from `.env.local`
- [ ] Redirected to / (dashboard)
- [ ] Dashboard shows "Create New Reading" button

### ✅ Session Creation
- [ ] Click "Create New Reading"
- [ ] Fill form across 4 steps
- [ ] Click "Create Reading"
- [ ] Redirected to `/session/[id]`
- [ ] Session info displays correctly

### ✅ Script Generation
- [ ] Click "Generate Part 1"
- [ ] Mock script displays
- [ ] Manually enter card names (or wait for audio feature)
- [ ] Click "Generate Part 2"
- [ ] Full script displays
- [ ] Click "Download Script" (downloads .txt)

---

## Troubleshooting

### "Cannot find module 'lib/auth'"
**Solution:** Verify `lib/auth.ts` exists and path is correct in imports

### "DATABASE_URL not found"
**Solution:** Check `.env.local` exists in root and contains `DATABASE_URL=file:./dev.db`

### "Prisma migration failed"
**Solution:** 
```bash
rm dev.db
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev --name init
```

### "Password gate not working"
**Solution:** Verify `APP_PASSWORD` in `.env.local` matches what you're entering

### "OPENAI_API_KEY invalid"
**Solution:** Get fresh key from https://platform.openai.com/api-keys

### "Build errors with TypeScript"
**Solution:**
```bash
npx tsc --noEmit  # Check for TS errors
npm run build     # Full build check
```

---

## Next Steps After Setup

1. **Test all flows** (unlock → dashboard → create → generate)
2. **Replace mock responses** with real OpenAI API calls
3. **Implement audio recording** for spread capture
4. **Add Voice Packs UI** for customization
5. **Deploy to Vercel** (see ANTIGRAVITY-SETUP.md)

---

## Total Files to Copy/Create: 33

- Configuration: 6 files
- Libraries: 6 files
- App/API: 11 files
- Components: 3 files
- Database: 1 file
- Documentation: 1 file (this file)

---

## Estimated Time

- **File organization:** 10-15 min (copy/create all files)
- **Environment setup:** 5 min (configure .env.local)
- **Database init:** 5 min (npm install + prisma migrate)
- **Local testing:** 10 min (verify all flows work)
- **Total:** ~35 minutes to fully working app

---

## Success Indicator

When you see this in your browser:

```
🔐 Password Gate (locked)
    ↓ (enter password)
📊 Dashboard (empty sessions)
    ↓ (click Create New Reading)
📝 Session Wizard (4 steps)
    ↓ (complete form)
📖 Reading Page (Part 1, Spread, Part 2)
    ↓ (generate scripts)
💾 Download Script (as .txt)
```

**You're ready to integrate real OpenAI APIs!**

---

**Built for Tarot Light Path / Tim B.**  
**Next.js 16 | React 19 | TypeScript 5.9 | Prisma 7.2 | Vercel**
