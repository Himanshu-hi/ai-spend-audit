// src/app/api/share/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("audits")
      .select("id, recommendations, total_monthly_savings, total_annual_savings, ai_summary, is_optimal, created_at, input")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Strip identifying info for public share
    const publicData = {
      id: data.id,
      recommendations: data.recommendations,
      totalMonthlySavings: data.total_monthly_savings,
      totalAnnualSavings: data.total_annual_savings,
      aiSummary: data.ai_summary,
      isOptimal: data.is_optimal,
      createdAt: data.created_at,
      teamSize: data.input?.teamSize,
      useCase: data.input?.useCase,
      // No email, no company name
    };

    return NextResponse.json(publicData);
  } catch (err) {
    console.error("Share fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
