# SpendSight — AI Tool Spend Auditor

SpendSight is a free web app for startup founders and engineering managers who want to know if they're overspending on AI tools like Cursor, Claude, GitHub Copilot, and ChatGPT — and exactly what to do about it.

🔗 **Live:** [https://spendsight.ai](https://spendsight.ai) *(replace with your Vercel URL)*

---

## Screenshots

> Add 3 screenshots here before submission (or link a 30-second Loom)
> - Homepage with form
> - Audit results page with savings
> - Shared public audit URL

---

## Quick Start

```bash
git clone https://github.com/yourusername/ai-spend-audit
cd ai-spend-audit
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                   # http://localhost:3000
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Supabase Setup

Run this SQL in your Supabase SQL editor:

```sql
create table audits (
  id text primary key,
  input jsonb,
  recommendations jsonb,
  total_monthly_savings numeric,
  total_annual_savings numeric,
  ai_summary text,
  is_optimal boolean,
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company_name text,
  role text,
  team_size int,
  audit_id text references audits(id),
  total_monthly_savings numeric,
  created_at timestamptz default now()
);
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set all env vars in Vercel dashboard → Settings → Environment Variables.

---

## Decisions

1. **Next.js App Router over Vite+React** — SSR needed for per-audit OG meta tags on `/share/[id]`. A pure SPA can't do server-side metadata injection, which kills the viral loop.

2. **Hardcoded audit rules, not AI** — The assignment explicitly says "for the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test." AI is used only for the personalized summary paragraph where natural language adds genuine value.

3. **Supabase over Firebase** — Supabase gives a real Postgres database with row-level security, free tier is generous (500MB), and the JS client is simpler than Firestore for relational queries. SQL schema is auditable by non-engineers.

4. **Resend over SES** — Resend has a developer-first API, free tier covers 3k emails/month, and setup takes minutes vs SES's production access request process. For an MVP this is the right call.

5. **Form state in localStorage** — Users often get distracted mid-fill. Persisting form state means they return to a pre-filled form. This increases completion rate for the core action (running an audit). Added 10 lines, meaningful UX improvement.
