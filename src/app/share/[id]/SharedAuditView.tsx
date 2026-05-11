"use client";
// src/app/share/[id]/SharedAuditView.tsx

import { useEffect, useState } from "react";
import { ExternalLink, TrendingDown, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface SharedAudit {
  id: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  isOptimal: boolean;
  teamSize: number;
  useCase: string;
  recommendations: Array<{
    toolName: string;
    currentPlan: string;
    currentSpend: number;
    seats: number;
    status: string;
    recommendedAction: string;
    monthlySavings: number;
    reasoning: string;
  }>;
}

export default function SharedAuditView({ auditId }: { auditId: string }) {
  const [audit, setAudit] = useState<SharedAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/share/${auditId}`)
      .then((r) => r.json())
      .then(setAudit)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auditId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff87]/30 border-t-[#00ff87] rounded-full animate-spin" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display font-bold text-3xl text-white mb-3">Audit not found</h1>
        <p className="text-neutral-500 mb-8">This link may have expired or doesn't exist.</p>
        <a href="/" className="text-[#00ff87] font-semibold hover:underline">Run your own free audit →</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen noise">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="font-display font-black text-xl text-white">SpendSight</div>
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-[#00ff87] hover:underline font-semibold"
          >
            Audit my stack
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="text-neutral-500 text-sm mb-4">Shared audit · {audit.teamSize} person team</div>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-[#00ff87]/20 bg-neutral-900 p-8 mb-6 glow-green">
          {audit.isOptimal ? (
            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#00ff87]" size={28} />
              <span className="font-display font-bold text-2xl text-white">Spend is optimized</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-[#00ff87]" size={18} />
                <span className="text-[#00ff87] text-xs font-semibold uppercase tracking-wide">Savings Found</span>
              </div>
              <div className="font-display font-black text-6xl text-white leading-none mb-1">
                ${audit.totalMonthlySavings.toLocaleString()}
              </div>
              <div className="text-neutral-400">per month · ${audit.totalAnnualSavings.toLocaleString()}/year</div>
            </>
          )}
          <div className="mt-5 pt-5 border-t border-white/8">
            <p className="text-neutral-300 italic text-sm leading-relaxed">"{audit.aiSummary}"</p>
          </div>
        </div>

        {/* Recs */}
        <div className="space-y-3 mb-10">
          {audit.recommendations.map((rec) => (
            <div key={rec.toolName} className="card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === rec.toolName ? null : rec.toolName)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-white text-sm">{rec.toolName}</span>
                    <span className="text-neutral-600 text-xs">{rec.currentPlan} · {rec.seats} seat{rec.seats > 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-neutral-500 text-xs">{rec.recommendedAction}</div>
                </div>
                {rec.monthlySavings > 0 && (
                  <div className="font-display font-bold text-[#00ff87]">-${rec.monthlySavings}/mo</div>
                )}
                <div className="text-neutral-600">
                  {expanded === rec.toolName ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>
              {expanded === rec.toolName && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <p className="text-neutral-400 text-sm leading-relaxed">{rec.reasoning}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-neutral-500 text-sm mb-4">Want to audit your own AI stack?</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#00ff87] text-neutral-950 font-display font-bold px-8 py-3.5 rounded-xl hover:bg-[#00cc6a] transition-colors glow-green"
          >
            Run My Free Audit
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
