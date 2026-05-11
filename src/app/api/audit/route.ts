// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { generateAISummary } from "@/lib/ai-summary";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AuditInput } from "@/types";
import { z } from "zod";

const ToolEntrySchema = z.object({
  tool: z.string(),
  plan: z.string(),
  monthlySpend: z.number().min(0),
  seats: z.number().min(1),
});

const AuditInputSchema = z.object({
  tools: z.array(ToolEntrySchema).min(1),
  teamSize: z.number().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
});

// Rate limiting: simple IP-based in-memory store
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }

  if (limit.count >= 10) return false; // 10 audits per hour per IP
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AuditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const input = parsed.data as AuditInput;
  const auditResult = runAudit(input);
  const aiSummary = await generateAISummary(auditResult);

  const fullResult = { ...auditResult, aiSummary };

  // Store in Supabase
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("audits").insert({
      id: fullResult.id,
      input: fullResult.input,
      recommendations: fullResult.recommendations,
      total_monthly_savings: fullResult.totalMonthlySavings,
      total_annual_savings: fullResult.totalAnnualSavings,
      ai_summary: fullResult.aiSummary,
      is_optimal: fullResult.isOptimal,
      created_at: fullResult.createdAt,
    });
  } catch (err) {
    // Non-fatal: audit still works without storage
    console.error("Supabase store error:", err);
  }

  return NextResponse.json(fullResult);
}
