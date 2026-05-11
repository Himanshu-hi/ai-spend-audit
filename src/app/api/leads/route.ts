// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const LeadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().optional(),
  auditId: z.string(),
  totalMonthlySavings: z.number(),
  honeypot: z.string().optional(), // must be empty
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { honeypot, ...data } = parsed.data;

  // Honeypot check — bots fill this field
  if (honeypot && honeypot.length > 0) {
    return NextResponse.json({ ok: true }); // silently reject
  }

  // Store lead
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("leads").insert({
      email: data.email,
      company_name: data.companyName,
      role: data.role,
      team_size: data.teamSize,
      audit_id: data.auditId,
      total_monthly_savings: data.totalMonthlySavings,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Lead store error:", err);
  }

  // Send confirmation email
  try {
    const isHighSavings = data.totalMonthlySavings > 500;

    await resend.emails.send({
      from: "SpendSight <hello@spendsight.ai>",
      to: data.email,
      subject: `Your AI Spend Audit — $${data.totalMonthlySavings}/mo in savings found`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #0d0d0d; padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #00ff87; margin: 0; font-size: 24px; font-weight: 800;">SpendSight</h1>
            <p style="color: #888; margin: 8px 0 0;">AI Tool Spend Auditor</p>
          </div>
          
          <div style="background: #fff; padding: 32px; border: 1px solid #e5e5e5;">
            <h2 style="font-size: 20px; margin: 0 0 16px;">Your Audit Report</h2>
            
            <div style="background: #f0fff4; border: 1px solid #00cc6a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Potential monthly savings</p>
              <p style="margin: 8px 0 0; font-size: 36px; font-weight: 900; color: #009150;">$${data.totalMonthlySavings}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #666;">That's $${data.totalMonthlySavings * 12}/year</p>
            </div>
            
            <p style="color: #444; line-height: 1.6;">
              Your full audit is saved at your unique report URL. We've analyzed your current AI tool stack and identified where you're overspending based on current official pricing.
            </p>
            
            ${
              isHighSavings
                ? `
            <div style="background: #fff3e0; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 8px; color: #92400e;">You qualify for a Credex consultation</h3>
              <p style="margin: 0; color: #78350f; font-size: 14px;">
                With $${data.totalMonthlySavings}/mo in identified savings, you're a strong candidate for Credex's discounted AI credits program. Many companies in your situation save 20-40% further through credits.
              </p>
              <a href="https://credex.rocks" style="display: inline-block; margin-top: 12px; background: #f59e0b; color: #1a1a1a; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">Book a Credex Consultation →</a>
            </div>
            `
                : ""
            }
            
            <p style="color: #888; font-size: 12px; margin-top: 32px; border-top: 1px solid #e5e5e5; padding-top: 16px;">
              SpendSight is a free tool by Credex. We sell discounted AI credits for teams that are serious about AI cost efficiency.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err);
    // Non-fatal
  }

  return NextResponse.json({ ok: true });
}
