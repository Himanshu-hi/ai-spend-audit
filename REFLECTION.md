# REFLECTION

> Fill each answer with YOUR actual experience — 150-400 words each. Template below.

## 1. The Hardest Bug

> Describe the hardest bug you hit this week. Be specific: what hypotheses did you form, what did you try, what worked?

**[Your answer here — 150-400 words]**

Example structure: "On Day 4, the Anthropic API was returning a valid 200 response but the audit results were showing the fallback summary every time. My first hypothesis was that the API key was wrong — I checked, it was correct. Second hypothesis: the response format changed. I `console.log`-ed `data.content` and discovered it was returning an empty array on certain prompts that triggered content filtering. The fix was adding a guard: `const textBlock = message.content.find(b => b.type === 'text')` — previously I was accessing `message.content[0].text` directly, which threw when the array was empty."

---

## 2. A Decision You Reversed

> A decision you reversed mid-week, and what made you reverse it.

**[Your answer here — 150-400 words]**

---

## 3. Week 2 Roadmap

> What you would build in Week 2 if you had it.

**[Your answer here — 150-400 words]**

Suggestions to expand on:
- Dynamic OG image generation using `@vercel/og` with per-audit savings numbers rendered as an image
- Benchmark mode: "your AI spend per developer ($X) vs companies your size ($Y)"
- PDF export via `@react-pdf/renderer`
- Embeddable `<script>` widget
- Redis-based rate limiting (Upstash) to replace in-memory store

---

## 4. How You Used AI Tools

> Which tools, for what tasks, what you didn't trust them with, one specific time AI was wrong and you caught it.

**[Your answer here — 150-400 words]**

Be honest and specific. Example: "I used Claude for boilerplate (the email HTML template, repetitive TypeScript interfaces) and Cursor for autocomplete in the audit engine. I did NOT use AI for the audit logic rules — I wrote every condition myself because those need to be defensible, and AI tends to write plausible-sounding but poorly-reasoned financial logic. One specific error: I asked Claude to generate pricing data for Windsurf Teams, and it confidently gave me $40/seat. The actual price on their website is $35/seat. Always verify pricing from official sources."

---

## 5. Self-Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | X/10 | [One sentence] |
| Code quality | X/10 | [One sentence] |
| Design sense | X/10 | [One sentence] |
| Problem solving | X/10 | [One sentence] |
| Entrepreneurial thinking | X/10 | [One sentence] |
