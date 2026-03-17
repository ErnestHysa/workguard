# WorkGuard — AI-Powered Worker Rights & Pay Verification

> **The app employers don't want you to have.**

WorkGuard is a mobile-first PWA that helps hourly and shift workers in Ireland (and UK) verify they're being paid fairly, understand their employment rights, and take action when they're not.

## Features (MVP)

| Feature | Description |
|---------|-------------|
| 🔍 **Payslip Scanner** | Upload or photograph a payslip → AI extracts data → checks against Irish NMW, deduction rules, overtime |
| 📋 **Contract Analyser** | Upload employment contract → AI flags risky clauses (non-compete, deductions, garden leave) in plain English |
| ⏱ **Shift Logger** | Clock in/out, add past shifts, compare logged hours to payslip to spot discrepancies |
| ⚖️ **Know Your Rights** | 20+ FAQ answers on Irish employment law + AI chat for specific questions |
| 🚨 **Violation Alerts** | When issues are found, links directly to WRC complaint form |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| PWA | vite-plugin-pwa (offline-capable, installable) |
| AI Engine | Claude API (`claude-sonnet-4-6`) via Vercel serverless functions |
| OCR | PDF.js + Tesseract.js (100% client-side, privacy-first) |
| Auth | Supabase Auth (magic link — no passwords) |
| Database | Supabase PostgreSQL (Row Level Security) |
| Storage | Supabase Storage (encrypted) |
| Hosting | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd workguard
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `VITE_SUPABASE_URL` — from your Supabase project
- `VITE_SUPABASE_ANON_KEY` — from your Supabase project

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial.sql` in the SQL editor
3. Enable Email Magic Link auth in Authentication > Providers

### 4. Run locally

```bash
npm run dev
```

For API routes locally, use [Vercel CLI](https://vercel.com/cli):

```bash
npx vercel dev
```

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard.

## Architecture

```
workguard/
├── api/                        # Vercel serverless functions (Claude API calls)
│   ├── analyze-payslip.ts      # Payslip analysis endpoint
│   ├── analyze-contract.ts     # Contract analysis endpoint
│   ├── rights-qa.ts            # Rights Q&A endpoint
│   └── rights-qa-stream.ts     # Streaming rights Q&A
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route-level page components
│   ├── lib/                    # Supabase client, Claude client, OCR
│   ├── prompts/                # AI system prompts (employment law knowledge)
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript types
├── supabase/migrations/        # Database schema
└── public/                     # Static assets, PWA manifest
```

### Privacy by Design
- OCR is 100% client-side (Tesseract.js + PDF.js) — payslip images never leave the device on free tier
- Only analysed text is sent to Claude API via server-side functions (API key never exposed to client)
- Supabase Row Level Security ensures users can only access their own data
- No analytics, no tracking, no selling data to employers — ever

## Roadmap

- [ ] Phase 2: Onboarding flow, dashboard stats, push notifications
- [ ] Phase 3: Stripe payments (WorkGuard Pro — €7.99/month)
- [ ] Phase 4: UK expansion, union partnerships, WRC direct integration
- [ ] Phase 5: Violation report PDF generator

## Contributing

Built with ❤️ for workers. Irish employment law first, UK next.

## Legal Disclaimer

WorkGuard provides general information only, not legal advice. For specific situations, contact the [Workplace Relations Commission](https://www.workplacerelations.ie), your union, or a solicitor.
