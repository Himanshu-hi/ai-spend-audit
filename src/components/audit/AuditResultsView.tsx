"use client";
// src/components/audit/AuditResultsView.tsx

import { useState } from "react";
import { AuditResult, ToolRecommendation } from "@/types";
import { TrendingDown, CheckCircle, AlertTriangle, ArrowRight, Share2, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import LeadCaptureModal from "./LeadCaptureModal";

interface Props {
  result: AuditResult;
  onReset: () => void;
}

export default function AuditResultsView({ result, onReset }: Props) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${result.id}`
    : `/share/${result.id}`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighSavings = result.totalMonthlySavings > 500;

  return (
    <div className="min-h-screen noise">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="font-display font-black text-xl text-white">SpendSight</div>
            <span className="text-neutral-700">·</span>
            <span className="text-neutral-500 text-sm">Your Audit</span>
          </div>
          <button onClick={onReset} className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors">
            <RefreshCw size={14} />
            New Audit
          </button>
        </div>

        {/* Hero savings card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#00ff87]/20 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 mb-6 animate-fade-up glow-green">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff87]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          {result.isOptimal ? (
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-[#00ff87]" size={28} />
                <span className="font-display font-bold text-2xl text-white">You're spending well.</span>
              </div>
              <p className="text-neutral-400 text-lg">Your current AI stack is well-optimized. No major changes recommended.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="text-[#00ff87]" size={20} />
                <span className="text-[#00ff87] text-sm font-semibold uppercase tracking-wide">Savings Found</span>
              </div>
              <div className="flex items-end gap-4 mb-4">
                <div>
                  <div className="font-display font-black text-6xl md:text-7xl text-white leading-none">
                    ${result.totalMonthlySavings.toLocaleString()}
                  </div>
                  <div className="text-neutral-400 text-lg mt-1">per month</div>
                </div>
                <div className="pb-1 text-neutral-500 text-lg">·</div>
                <div className="pb-1">
                  <div className="font-display font-bold text-3xl text-neutral-300">
                    ${result.totalAnnualSavings.toLocaleString()}
                  </div>
                  <div className="text-neutral-500 text-sm">per year</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Summary */}
          <div className="mt-6 pt-6 border-t border-white/8">
            <p className="text-neutral-300 leading-relaxed italic">"{result.aiSummary}"</p>
          </div>
        </div>

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <div className="rounded-2xl border border-amber-700/40 bg-amber-950/30 p-6 mb-6 animate-fade-up animate-fade-up-delay-1">
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={20} />
              <div className="flex-1">
                <h3 className="font-display font-bold text-white mb-1">You qualify for deeper savings via Credex</h3>
                <p className="text-neutral-400 text-sm mb-4">
                  With ${result.totalMonthlySavings}/mo in identified overspend, you're a strong candidate for Credex's discounted AI credits program. 
                  Cursor, Claude, and ChatGPT Enterprise credits — sourced at 20-40% below retail.
                </p>
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  Book a Credex Consultation
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Per-tool breakdown */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-lg text-white mb-4">Tool-by-Tool Breakdown</h2>
          <div className="space-y-3">
            {result.recommendations.map((rec) => (
              <ToolCard
                key={rec.tool}
                rec={rec}
                isExpanded={expanded === rec.tool}
                onToggle={() => setExpanded(expanded === rec.tool ? null : rec.tool)}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {!leadSubmitted ? (
            <button
              onClick={() => setShowLeadModal(true)}
              className="py-4 rounded-xl font-display font-bold bg-[#00ff87] text-neutral-950 hover:bg-[#00cc6a] transition-all flex items-center justify-center gap-2 glow-green"
            >
              Get Full Report by Email
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className="py-4 rounded-xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 font-semibold flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Report sent!
            </div>
          )}
          <button
            onClick={handleShare}
            className="py-4 rounded-xl font-semibold border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            {copied ? "Link copied!" : "Share this audit"}
          </button>
        </div>

        {/* Optimal note */}
        {result.isOptimal && (
          <div className="card p-5 text-center">
            <p className="text-neutral-400 text-sm mb-3">
              Your stack is already efficient! Sign up and we'll notify you when new optimizations apply.
            </p>
            {!leadSubmitted && (
              <button
                onClick={() => setShowLeadModal(true)}
                className="text-[#00ff87] text-sm font-semibold hover:underline"
              >
                Notify me of future savings →
              </button>
            )}
          </div>
        )}
      </div>

      {showLeadModal && (
        <LeadCaptureModal
          auditId={result.id}
          totalMonthlySavings={result.totalMonthlySavings}
          onClose={() => setShowLeadModal(false)}
          onSuccess={() => {
            setLeadSubmitted(true);
            setShowLeadModal(false);
          }}
        />
      )}
    </div>
  );
}

function ToolCard({
  rec,
  isExpanded,
  onToggle,
}: {
  rec: ToolRecommendation;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const chipClass =
    rec.status === "overspending"
      ? "warn-chip"
      : rec.status === "switch"
      ? "savings-chip"
      : "optimal-chip";

  const chipLabel =
    rec.status === "overspending"
      ? "Overspending"
      : rec.status === "switch"
      ? "Better Alternative"
      : "Optimized";

  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-semibold text-white">{rec.toolName}</span>
            <span className="text-neutral-500 text-sm">{rec.currentPlan} · {rec.seats} seat{rec.seats > 1 ? "s" : ""}</span>
            <span className={chipClass}>{chipLabel}</span>
          </div>
          <div className="text-sm text-neutral-500">{rec.recommendedAction}</div>
        </div>
        <div className="text-right shrink-0">
          {rec.monthlySavings > 0 && (
            <div className="font-display font-bold text-[#00ff87] text-xl">
              -${rec.monthlySavings}/mo
            </div>
          )}
          <div className="text-neutral-600 text-xs">${rec.currentSpend}/mo current</div>
        </div>
        <div className="text-neutral-600">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-white/5">
          <p className="text-neutral-400 text-sm leading-relaxed mt-4">{rec.reasoning}</p>
          {rec.monthlySavings > 0 && (
            <div className="flex gap-4 mt-4">
              <div className="bg-neutral-800/60 rounded-lg px-4 py-3">
                <div className="text-xs text-neutral-500 mb-0.5">Monthly savings</div>
                <div className="font-display font-bold text-white">${rec.monthlySavings}</div>
              </div>
              <div className="bg-neutral-800/60 rounded-lg px-4 py-3">
                <div className="text-xs text-neutral-500 mb-0.5">Annual savings</div>
                <div className="font-display font-bold text-white">${rec.annualSavings.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
