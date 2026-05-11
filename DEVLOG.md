# DEVLOG

> Replace all dates and entries with your actual daily logs. Backdating is visible in git history.

## Day 1 — YYYY-MM-DD

**Hours worked:** 4

**What I did:** Read the brief carefully 3 times. Set up Next.js project with TypeScript and Tailwind. Created the type definitions for the entire app (`AuditInput`, `AuditResult`, `ToolRecommendation`). Sketched the audit engine logic on paper before touching code — wanted to be sure the reasoning would be defensible before writing a single rule.

**What I learned:** The assignment says "for the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test." This is actually the hardest part — writing rules that a finance person would agree with. Started researching official pricing pages and documenting them.

**Blockers / what I'm stuck on:** Not sure how to handle API-direct users who pay usage-based pricing — their monthly spend varies. Decided to use their self-reported current spend as the baseline.

**Plan for tomorrow:** Build the full audit engine with all 8 tools. Write tests alongside the logic.

---

## Day 2 — YYYY-MM-DD

**Hours worked:** 5

**What I did:** Built the complete audit engine (`audit-engine.ts`). Wrote 8 unit tests covering edge cases: 2-seat Business plan, API user vs flat plan, optimal stack detection, annual savings calculation. All pass. Committed with conventional commit messages.

**What I learned:** `nanoid` is better than `uuid` for short shareable IDs — generates 10-char URL-safe strings by default. Switched to it for audit IDs.

**Blockers / what I'm stuck on:** The Windsurf pricing is harder to find than others — their Teams page requires a sales call for the exact number. Used their publicly listed rate and noted it in PRICING_DATA.md.

**Plan for tomorrow:** Build the frontend form and results components.

---

## Day 3 — YYYY-MM-DD

**Hours worked:** 6

**What I did:** Built the homepage form with React. Implemented localStorage persistence for form state. Built the `AuditResultsView` component and `LeadCaptureModal`. The tool breakdown cards with expand/collapse took longer than expected — getting the layout right on mobile was tricky.

**What I learned:** Using `grid-cols-12` for the form row allows fine-grained control of column widths across breakpoints without fighting flexbox. Will use this pattern more.

**Blockers / what I'm stuck on:** The OG image generation is harder to do dynamically. Decided to use a static OG image for now and note it as a Week 2 improvement (dynamic per-audit OG image via `@vercel/og`).

**Plan for tomorrow:** Set up Supabase, build API routes, test end-to-end.

---

## Day 4 — YYYY-MM-DD

**Hours worked:** 5

**What I did:** Created Supabase project and tables. Built `/api/audit`, `/api/leads`, `/api/share/[id]` routes. Integrated Anthropic API for summaries with graceful fallback. Integrated Resend for transactional emails. Tested end-to-end: form → audit → result → email capture → email received.

**What I learned:** Anthropic API can occasionally return a 529 (overloaded) — important to catch and fallback. My fallback template is actually pretty good, so this isn't a user-facing degradation.

**Blockers / what I'm stuck on:** Rate limiting in API routes is in-memory which means it resets on Vercel cold starts. Documented this limitation in ARCHITECTURE.md — proper fix is Redis, which is overkill for MVP.

**Plan for tomorrow:** Build share page, add OG metadata, write all markdown docs.

---

## Day 5 — YYYY-MM-DD

**Hours worked:** 4

**What I did:** Built `/share/[id]` with SSR metadata for OG/Twitter cards. Wrote ARCHITECTURE.md, PRICING_DATA.md, PROMPTS.md. Started GTM.md and ECONOMICS.md. Did first real user interview (friend who runs a 5-person startup).

**What I learned:** The share page OG metadata requires SSR — `generateMetadata` in Next.js App Router handles this cleanly. The public audit strips email/company from the response, which I verified by checking the JSON response in DevTools.

**Blockers / what I'm stuck on:** Need 2 more user interviews. Cold DMing founders on X is slower than expected — sent 15 DMs, got 2 replies.

**Plan for tomorrow:** 2 more interviews, complete all entrepreneurial docs, polish UI.

---

## Day 6 — YYYY-MM-DD

**Hours worked:** 5

**What I did:** Completed 2 more user interviews. Updated USER_INTERVIEWS.md. Wrote GTM.md, ECONOMICS.md, METRICS.md, LANDING_COPY.md. UI polish pass: fixed mobile spacing, improved the hero card animation, added the Credex consultation CTA for high-savings audits.

**What I learned:** Interview #2 surprised me — the user said they don't think of their AI bills as "overspending" because they budget it as a fixed cost. This changed how I framed the landing copy: instead of "are you overspending?" (defensive), I changed it to "find out exactly what your AI is actually costing" (curious).

**Blockers / what I'm stuck on:** REFLECTION.md takes longer than expected — the 150-400 words per question requirement is real.

**Plan for tomorrow:** Final review, REFLECTION.md, push everything, deploy to Vercel, submit.

---

## Day 7 — YYYY-MM-DD

**Hours worked:** 4

**What I did:** Wrote REFLECTION.md. Final end-to-end test on deployed Vercel URL. Lighthouse audit: Performance 91, Accessibility 94, Best Practices 92. Fixed one accessibility issue (missing aria-label on icon buttons). Verified git log shows commits across 5+ days. Submitted Google Form.

**What I learned:** Lighthouse catches things you'd never think to check — in my case, the icon-only buttons were missing `aria-label` attributes, dropping Accessibility below 90. One-line fix, significant improvement.

**Blockers / what I'm stuck on:** Nothing blocking. Ship it.

**Plan for tomorrow:** N/A — submitted!
