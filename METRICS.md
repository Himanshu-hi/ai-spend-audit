# METRICS

## North Star Metric

**Qualified leads generated per week** (defined as: email captures from audits showing >$200/mo in savings)

**Why this, not DAU/MAU:**
SpendSight is a B2B lead-gen tool. People use it once, maybe twice a year (when their stack changes). Daily active users is meaningless here — a bootstrapped founder might use it once and never come back, but that one visit generates a Credex customer worth $1,200 LTV. The North Star must reflect business value, not engagement vanity.

Qualified leads (>$200/mo savings) are chosen over all email captures because they're the ones Credex can convert to credit sales. A startup with $15/mo in savings is a good user but not a Credex prospect. The threshold filters signal from noise.

---

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate**
*Definition:* % of page visitors who click "Run My Free Audit" and receive results
*Target:* >35%
*Why it matters:* You can't generate leads from people who don't complete the audit. Low completion rate means the form is too long, confusing, or trust is missing.

**2. High-savings audit rate**
*Definition:* % of completed audits that surface >$200/mo in savings
*Target:* >40%
*Why it matters:* This is determined by who comes to the tool, not just quality. If we attract well-optimized teams (engineers who already comparison-shop), this rate drops. Good targeting brings teams who haven't audited their stack. If this drops below 30%, revisit distribution channels.

**3. Email capture rate (post-audit)**
*Definition:* % of high-savings audit viewers who submit email
*Target:* >20%
*Why it matters:* This is the conversion step between value and lead. A 20% rate is realistic for post-value capture (industry benchmarks: 15-25%). Below 15% means the results page isn't compelling or the CTA copy is weak.

---

## What to Instrument First

1. **Audit completion funnel** — Track: page_view → form_interaction → audit_submit → results_shown. Drop-off by step.
2. **Time to complete form** — If median > 5 minutes, form is too complex.
3. **Email capture by savings tier** — <$100, $100-500, >$500. Does higher savings = higher capture rate? (Should be yes.)
4. **Share URL clicks** — How many shared audits drive new visitors?
5. **Tool distribution** — Which tools appear most often? (Informs what to support next.)

Implementation: Posthog (free tier, open source, self-hostable) + Vercel Analytics for traffic.

---

## Pivot Trigger

**If, after 500 completed audits:**
- Email capture rate < 10% — The audit results aren't compelling enough. Either the recommendations are wrong (users don't trust them) or the email ask is too early/too late in the flow. Pivot: A/B test email ask timing.
- High-savings audit rate < 20% — We're attracting the wrong users (already-optimized teams, or teams too small to matter). Pivot: Change distribution to target larger teams or less technically sophisticated buyers.
- Zero Credex consultations booked — The audit-to-Credex pipeline is broken. Either the CTA isn't seen, the savings threshold for showing Credex is wrong, or the consultation offer isn't compelling. Pivot: Lower the threshold or change the CTA to a lower-commitment action (email course, PDF, etc.).
