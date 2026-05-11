// src/__tests__/audit-engine.test.ts
import { runAudit } from "@/lib/audit-engine";
import { AuditInput } from "@/types";

// Test 1: Cursor Business with 2 seats → should recommend Pro
test("Cursor Business with ≤3 seats flags overspending", () => {
  const input: AuditInput = {
    tools: [{ tool: "cursor", plan: "Business", monthlySpend: 80, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.status).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Pro");
  expect(rec.monthlySavings).toBe(40); // (40-20)*2
});

// Test 2: Claude Max with 1 seat non-coding → downgrade to Pro
test("Claude Max for 1 non-coding user suggests Pro downgrade", () => {
  const input: AuditInput = {
    tools: [{ tool: "claude", plan: "Max", monthlySpend: 100, seats: 1 }],
    teamSize: 1,
    useCase: "writing",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.status).toBe("overspending");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 3: Well-configured stack → isOptimal true
test("Optimally configured stack returns isOptimal=true", () => {
  const input: AuditInput = {
    tools: [
      { tool: "cursor", plan: "Pro", monthlySpend: 60, seats: 3 },
      { tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 },
    ],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(input);
  expect(result.isOptimal).toBe(true);
  expect(result.totalMonthlySavings).toBeLessThan(10);
});

// Test 4: Annual savings = monthly * 12
test("Annual savings is exactly 12x monthly savings", () => {
  const input: AuditInput = {
    tools: [{ tool: "cursor", plan: "Business", monthlySpend: 160, seats: 4 }],
    teamSize: 4,
    useCase: "coding",
  };
  const result = runAudit(input);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});

// Test 5: Claude Team with 2 users → switch to Pro saves money
test("Claude Team with 2 seats recommends cheaper individual Pro plans", () => {
  const input: AuditInput = {
    tools: [{ tool: "claude", plan: "Team", monthlySpend: 60, seats: 2 }],
    teamSize: 2,
    useCase: "writing",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.status).toBe("overspending");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 6: GitHub Copilot Enterprise with 2 seats → downgrade to Business
test("GitHub Copilot Enterprise with ≤5 seats suggests Business", () => {
  const input: AuditInput = {
    tools: [{ tool: "github_copilot", plan: "Enterprise", monthlySpend: 78, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.status).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Business");
  expect(rec.monthlySavings).toBe(40); // (39-19)*2
});

// Test 7: API user spending > flat plan cost → suggest flat plan
test("Anthropic API user spending >$100 for 2 users should consider flat plan", () => {
  const input: AuditInput = {
    tools: [{ tool: "anthropic_api", plan: "API direct", monthlySpend: 150, seats: 2 }],
    teamSize: 2,
    useCase: "research",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.status).toBe("overspending");
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 8: Result has unique ID
test("Each audit result has a unique ID", () => {
  const input: AuditInput = {
    tools: [{ tool: "claude", plan: "Pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "mixed",
  };
  const r1 = runAudit(input);
  const r2 = runAudit(input);
  expect(r1.id).not.toBe(r2.id);
});
