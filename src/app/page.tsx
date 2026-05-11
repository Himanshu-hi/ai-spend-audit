"use client";
// src/app/page.tsx

import { useState, useEffect } from "react";
import { AuditInput, AuditResult, TOOL_NAMES, AITool, TOOL_PLANS, USE_CASE_LABELS, UseCase } from "@/types";
import AuditResultsView from "@/components/audit/AuditResultsView";
import { Plus, Trash2, ArrowRight, Zap, TrendingDown, Shield } from "lucide-react";

const TOOLS_LIST = Object.entries(TOOL_NAMES) as [AITool, string][];

const EMPTY_TOOL = { tool: "cursor" as AITool, plan: "Pro", monthlySpend: 0, seats: 1 };

const STORAGE_KEY = "spendsight_form_state";

export default function HomePage() {
  const [tools, setTools] = useState([{ ...EMPTY_TOOL }]);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  // Persist form state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { tools: t, teamSize: ts, useCase: uc } = JSON.parse(saved);
        if (t) setTools(t);
        if (ts) setTeamSize(ts);
        if (uc) setUseCase(uc);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tools, teamSize, useCase }));
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, { ...EMPTY_TOOL }]);
  const removeTool = (i: number) => setTools(tools.filter((_, idx) => idx !== i));

  const updateTool = (i: number, field: string, value: string | number) => {
    const updated = [...tools];
    updated[i] = { ...updated[i], [field]: value };
    if (field === "tool") updated[i].plan = TOOL_PLANS[value as AITool][0];
    setTools(updated);
  };

  const runAudit = async () => {
    setError("");
    const validTools = tools.filter((t) => t.monthlySpend > 0 || t.seats > 0);
    if (validTools.length === 0) {
      setError("Add at least one tool with a spend amount.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: validTools, teamSize, useCase } as AuditInput),
      });
      if (!res.ok) throw new Error("Audit failed");
      const data = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <AuditResultsView result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen noise">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,135,0.08),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-[#00ff87] rounded-full pulse-green" />
            <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">Free Audit · No Login Required</span>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl leading-none tracking-tight mb-6">
            Stop overpaying<br />
            <span className="text-[#00ff87]">for AI tools.</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-xl mb-12 leading-relaxed">
            Most startups overspend on AI by 30–60%. Find out exactly where your money is going — and what to do about it.
          </p>

          <div className="flex flex-wrap gap-8 text-sm">
            {[
              { icon: Zap, label: "60-second audit" },
              { icon: TrendingDown, label: "Real savings, not estimates" },
              { icon: Shield, label: "No account needed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-neutral-400">
                <Icon size={16} className="text-[#00ff87]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        {/* Team context */}
        <div className="card p-6 mb-4">
          <h2 className="font-display font-bold text-lg mb-5 text-white">Your Team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Team Size</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Primary Use Case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="form-input"
              >
                {(Object.entries(USE_CASE_LABELS) as [UseCase, string][]).map(([val, label]) => (
                  <option key={val} value={val} className="bg-neutral-900">{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool rows */}
        <div className="space-y-3 mb-4">
          {tools.map((entry, i) => (
            <div key={i} className="card p-5 animate-fade-up">
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Tool */}
                <div className="col-span-12 sm:col-span-3">
                  <label className="form-label">Tool</label>
                  <select
                    value={entry.tool}
                    onChange={(e) => updateTool(i, "tool", e.target.value)}
                    className="form-input"
                  >
                    {TOOLS_LIST.map(([val, name]) => (
                      <option key={val} value={val} className="bg-neutral-900">{name}</option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div className="col-span-12 sm:col-span-3">
                  <label className="form-label">Plan</label>
                  <select
                    value={entry.plan}
                    onChange={(e) => updateTool(i, "plan", e.target.value)}
                    className="form-input"
                  >
                    {TOOL_PLANS[entry.tool].map((plan) => (
                      <option key={plan} value={plan} className="bg-neutral-900">{plan}</option>
                    ))}
                  </select>
                </div>

                {/* Seats */}
                <div className="col-span-5 sm:col-span-2">
                  <label className="form-label">Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={entry.seats}
                    onChange={(e) => updateTool(i, "seats", Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                {/* Spend */}
                <div className="col-span-5 sm:col-span-3">
                  <label className="form-label">Monthly Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                    value={entry.monthlySpend || ""}
                    onChange={(e) => updateTool(i, "monthlySpend", Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                {/* Remove */}
                <div className="col-span-2 sm:col-span-1 flex justify-end pb-0.5">
                  {tools.length > 1 && (
                    <button
                      onClick={() => removeTool(i)}
                      className="p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add tool */}
        <button
          onClick={addTool}
          className="w-full py-3 rounded-xl border border-dashed border-white/10 text-neutral-500 hover:border-[#00ff87]/40 hover:text-[#00ff87] transition-all text-sm flex items-center justify-center gap-2 mb-8"
        >
          <Plus size={16} />
          Add another tool
        </button>

        {error && (
          <div className="bg-red-950/60 border border-red-700/50 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={runAudit}
          disabled={loading}
          className="w-full py-4 rounded-xl font-display font-bold text-lg bg-[#00ff87] text-neutral-950 hover:bg-[#00cc6a] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 glow-green"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
              Analyzing your stack…
            </>
          ) : (
            <>
              Run My Free Audit
              <ArrowRight size={20} />
            </>
          )}
        </button>

        <p className="text-center text-neutral-600 text-xs mt-4">
          No account required. Results shown instantly. Email optional.
        </p>
      </div>
    </div>
  );
}
