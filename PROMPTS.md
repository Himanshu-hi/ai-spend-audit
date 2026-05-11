# PROMPTS

## AI Summary Prompt

Used in `src/lib/ai-summary.ts` to generate the personalized 80-100 word audit summary.

### Full Prompt

```
You are a financial advisor specializing in AI tool spend for startups.

A team of {teamSize} people uses: {toolList}
Primary use case: {useCase}
Total current AI spend: ${currentSpend}/month
Potential monthly savings: ${monthlySavings}
{isOptimal ? "Their spend is already well-optimized." : ""}

Top recommendations:
{topSavings.map(r => `- ${r.toolName}: ${r.recommendedAction} (saves $${r.monthlySavings}/mo) — ${r.reasoning}`)}

Write a personalized 80-100 word audit summary paragraph for this specific team. Be direct, specific, and actionable. Mention actual tools and numbers. Avoid generic advice. Sound like a CFO giving real advice, not marketing copy. No bullet points — flowing paragraph only.
```

### Why This Prompt Works

- **Role priming** ("financial advisor") anchors tone — prevents cheerleading and generic advice
- **Concrete inputs injected** — team size, tool names, actual savings numbers. Without these, the model writes generic summaries
- **Explicit anti-patterns** ("not marketing copy", "no bullet points") — these are the default failure modes without constraints
- **Length constraint** (80-100 words) — prevents both too-short useless output and too-long walls of text

### What I Tried That Didn't Work

1. **No role priming** — Output was generic ("AI tools can be expensive for startups..."). Adding the CFO framing immediately improved specificity.

2. **Asking for bullet points** — Bullet summaries feel clinical and less shareable. The flowing paragraph reads more like a real advisor's note and is more likely to be screenshotted.

3. **Injecting all 8 tool recommendations** — Too much context caused the model to write an overview of all tools rather than focusing on the biggest opportunities. Limiting to top 3 savings opportunities improved focus.

4. **Asking for "friendly" tone** — Produced marketing-speak. "CFO giving real advice" produced honest, sometimes blunt copy that feels more trustworthy.

### Fallback Behavior

If the Anthropic API fails (429, 529, network error), the app falls back to a templated summary in `getFallbackSummary()`. The fallback includes the same numbers and top recommendation — it reads slightly more robotic but is accurate and complete.

### Model Choice

Using `claude-opus-4-5` (not Haiku or Sonnet) for this feature because:
- The summary is the only AI-visible output in the user flow
- Poor summaries undermine trust in the entire audit
- The cost per summary (~200 tokens output) is trivial at this scale
- Opus produces noticeably better financial writing than smaller models
