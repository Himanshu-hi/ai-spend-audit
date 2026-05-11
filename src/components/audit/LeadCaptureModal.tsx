"use client";
// src/components/audit/LeadCaptureModal.tsx

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

interface Props {
  auditId: string;
  totalMonthlySavings: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadCaptureModal({ auditId, totalMonthlySavings, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState(""); // must stay empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Email is required."); return; }
    setLoading(true);
    setError("");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          auditId,
          totalMonthlySavings,
          honeypot,
        }),
      });
      onSuccess();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="font-display font-bold text-2xl text-white mb-2">Get your full report</h2>
        <p className="text-neutral-400 text-sm mb-6">
          We'll email you the complete audit with all recommendations.
          {totalMonthlySavings > 500 && " We'll also reach out about Credex credits for your high-savings case."}
        </p>

        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="space-y-4">
          <div>
            <label className="form-label">Work Email *</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
          <div>
            <label className="form-label">Company Name <span className="text-neutral-600 normal-case">(optional)</span></label>
            <input
              type="text"
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Your Role <span className="text-neutral-600 normal-case">(optional)</span></label>
            <input
              type="text"
              placeholder="CTO, Engineering Manager..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3.5 rounded-xl font-display font-bold bg-[#00ff87] text-neutral-950 hover:bg-[#00cc6a] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Sending…" : <>Send My Report <ArrowRight size={18} /></>}
        </button>

        <p className="text-center text-neutral-600 text-xs mt-3">
          No spam. One email with your audit, that's it.
        </p>
      </div>
    </div>
  );
}
