// src/lib/ai-summary.ts
import Anthropic from "@anthropic-ai/sdk";
import { AuditResult, USE_CASE_LABELS } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAISummary(audit: Omit<AuditResult, "aiSummary">): Promise<string> {
  const { input, recommendations, totalMonthlySavings, isOptimal } = audit;

  const topSavings = recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3);

  const toolList = recommendations.map((r) => r.toolName).join(", ");

  const prompt = `You are a financial advisor specializing in AI tool spend for startups.

A team of ${input.teamSize} people uses: ${toolList}
Primary use case: ${USE_CASE_LABELS[input.useCase]}
Total current AI spend: $${input.tools.reduce((s, t) => s + t.monthlySpend, 0)}/month
Potential monthly savings: $${totalMonthlySavings}
${isOptimal ? "Their spend is already well-optimized." : ""}

Top recommendations:
${topSavings.map((r) => `- ${r.toolName}: ${r.recommendedAction} (saves $${r.monthlySavings}/mo) — ${r.reasoning}`).join("\n")}

Write a personalized 80-100 word audit summary paragraph for this specific team. Be direct, specific, and actionable. Mention actual tools and numbers. Avoid generic advice. Sound like a CFO giving real advice, not marketing copy. No bullet points — flowing paragraph only.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    return textBlock?.text ?? getFallbackSummary(audit);
  } catch (error) {
    console.error("Anthropic API error, using fallback:", error);
    return getFallbackSummary(audit);
  }
}

function getFallbackSummary(audit: Omit<AuditResult, "aiSummary">): string {
  const { input, totalMonthlySavings, recommendations, isOptimal } = audit;

  if (isOptimal) {
    return `Your team of ${input.teamSize} is running a lean AI stack. Based on your current tool selection and plans, the spend is well-optimized for your ${USE_CASE_LABELS[input.useCase].toLowerCase()} use case. No major switches are recommended at this time — keep monitoring as vendors update their pricing and you scale.`;
  }

  const topRec = recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  return `Your team of ${input.teamSize} could save $${totalMonthlySavings}/month ($${totalMonthlySavings * 12}/year) on AI tools without losing capability. The biggest opportunity is ${topRec?.toolName ?? "your current stack"} — ${topRec?.reasoning ?? "there are more cost-effective alternatives available"}. These are real savings based on current vendor pricing, not estimates.`;
}