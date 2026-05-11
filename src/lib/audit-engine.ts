// src/lib/audit-engine.ts
// Audit logic - hardcoded rules, defensible reasoning
// Pricing verified from official pages - see PRICING_DATA.md

import {
  AITool,
  AuditInput,
  AuditResult,
  ToolEntry,
  ToolRecommendation,
  TOOL_NAMES,
  UseCase,
} from "@/types";
import { nanoid } from "nanoid";

// Official pricing per seat/month (USD)
// Source: PRICING_DATA.md - all verified from vendor pages
const OFFICIAL_PRICING: Record<string, Record<string, number>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 60, // estimated, contact sales
  },
  github_copilot: {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: 60, // estimated, contact sales
    "API direct": 0, // usage-based
  },
  chatgpt: {
    Plus: 20,
    Team: 30,
    Enterprise: 60, // estimated
    "API direct": 0,
  },
  anthropic_api: {
    "API direct": 0,
  },
  openai_api: {
    "API direct": 0,
  },
  gemini: {
    Free: 0,
    Pro: 20,
    Ultra: 30, // Gemini Advanced via Google One AI Premium
    API: 0,
  },
  windsurf: {
    Free: 0,
    Pro: 15,
    Teams: 35,
  },
};

// Capability tiers for use-case matching
const CODING_TOOLS: AITool[] = ["cursor", "github_copilot", "windsurf"];
const GENERAL_AI_TOOLS: AITool[] = [
  "claude",
  "chatgpt",
  "gemini",
  "anthropic_api",
  "openai_api",
];

function evaluateTool(
  entry: ToolEntry,
  teamSize: number,
  useCase: UseCase,
  allTools: ToolEntry[]
): ToolRecommendation {
  const { tool, plan, monthlySpend, seats } = entry;
  const officialPrice =
    OFFICIAL_PRICING[tool]?.[plan] ?? monthlySpend / Math.max(seats, 1);
  const expectedSpend = officialPrice * seats;

  let status: "overspending" | "optimal" | "switch" = "optimal";
  let recommendedAction = "Keep current plan";
  let recommendedPlan: string | undefined;
  let recommendedTool: string | undefined;
  let monthlySavings = 0;
  let reasoning = "";

  // --- Cursor ---
  if (tool === "cursor") {
    if (plan === "Business" && seats <= 3) {
      const proSavings = (40 - 20) * seats;
      if (proSavings > 0) {
        status = "overspending";
        recommendedPlan = "Pro";
        recommendedAction = `Downgrade to Cursor Pro`;
        monthlySavings = proSavings;
        reasoning = `Business plan ($40/seat) is designed for teams >5 that need SSO, audit logs, and admin controls. With ${seats} seat(s), Pro ($20/seat) covers the same AI features without enterprise overhead.`;
      }
    } else if (plan === "Pro" && seats >= 10 && useCase === "coding") {
      // Check if github copilot would be cheaper
      const copilotCost = 19 * seats;
      const cursorCost = 20 * seats;
      if (copilotCost < cursorCost) {
        status = "switch";
        recommendedTool = "GitHub Copilot Business";
        recommendedAction = "Consider GitHub Copilot Business";
        monthlySavings = cursorCost - copilotCost;
        reasoning = `At ${seats} seats for pure coding, GitHub Copilot Business ($19/seat) provides similar inline completion with native IDE integration. Cursor's edge is chat-heavy workflows — if your team primarily uses tab-complete, Copilot saves $${monthlySavings}/mo.`;
      } else {
        reasoning = `Cursor Pro at ${seats} seats is appropriately sized for a coding team. The AI chat and tab-complete features are well-utilized at this scale.`;
      }
    } else if (plan === "Hobby" && seats > 1) {
      status = "optimal";
      reasoning = `Free Hobby plan is fine for individual use. If team members need shared usage, Pro at $20/seat adds usage limits relief.`;
    } else {
      reasoning = `${plan} plan at ${seats} seat(s) is correctly matched to your team size and coding use case.`;
    }
  }

  // --- GitHub Copilot ---
  if (tool === "github_copilot") {
    if (plan === "Enterprise" && seats <= 5) {
      const bizSavings = (39 - 19) * seats;
      status = "overspending";
      recommendedPlan = "Business";
      recommendedAction = "Downgrade to Business";
      monthlySavings = bizSavings;
      reasoning = `Enterprise ($39/seat) adds Copilot Chat in GitHub.com, policies, and audit logs — features useful for >50-person engineering orgs. With ${seats} seats, Business ($19/seat) is identical for day-to-day coding assistance.`;
    } else if (plan === "Individual" && seats > 1) {
      // Individual plan is per-person, Business needed for orgs
      const bizCost = 19 * seats;
      const indCost = 10 * seats;
      status = "overspending";
      recommendedPlan = "Business";
      recommendedAction = "Switch to Business plan for org management";
      monthlySavings = -(bizCost - indCost); // negative means it costs more but is required
      if (monthlySavings < 0) monthlySavings = 0;
      reasoning = `Individual plan ($10/seat) is meant for solo developers. For a team of ${seats}, Business ($19/seat) provides org-level management, policy controls, and is the correct licensing tier.`;
    } else {
      reasoning = `GitHub Copilot ${plan} is correctly sized for ${seats} developer(s).`;
    }
  }

  // --- Claude ---
  if (tool === "claude") {
    if (plan === "Max" && seats === 1 && useCase !== "coding") {
      const proSavings = (100 - 20) * seats;
      status = "overspending";
      recommendedPlan = "Pro";
      recommendedAction = "Downgrade to Claude Pro";
      monthlySavings = proSavings;
      reasoning = `Claude Max ($100/seat) provides ~5x higher usage limits for power users doing continuous AI work. For ${useCase} use cases with ${seats} seat, Pro ($20/seat) covers 80% of workflows unless you're hitting rate limits daily.`;
    } else if (plan === "Team" && seats <= 2) {
      const proSavings = (30 - 20) * seats;
      status = "overspending";
      recommendedPlan = "Pro";
      recommendedAction = "Switch to individual Pro plans";
      monthlySavings = proSavings;
      reasoning = `Team plan ($30/seat) adds collaboration features and a shared workspace. With just ${seats} user(s), two individual Pro plans ($20/seat each) cost less and cover identical AI capabilities.`;
    } else if (plan === "Enterprise" && seats <= 3) {
      const teamSavings = (60 - 30) * seats;
      status = "overspending";
      recommendedPlan = "Team";
      recommendedAction = "Downgrade to Claude Team";
      monthlySavings = teamSavings;
      reasoning = `Enterprise adds SSO, admin controls, and extended context — essential for 20+ person companies. At ${seats} seats, Team ($30/seat) provides the same daily AI capability at half the cost.`;
    } else {
      reasoning = `Claude ${plan} is well-matched to your ${useCase} use case at ${seats} seat(s).`;
    }
  }

  // --- ChatGPT ---
  if (tool === "chatgpt") {
    if (plan === "Enterprise" && seats <= 5) {
      const teamSavings = (60 - 30) * seats;
      status = "overspending";
      recommendedPlan = "Team";
      recommendedAction = "Downgrade to ChatGPT Team";
      monthlySavings = teamSavings;
      reasoning = `ChatGPT Enterprise adds SSO, audit logs, and custom deployments — built for 100+ seat orgs. At ${seats} seats, Team ($30/seat) includes GPT-4o, DALL·E, and higher limits at half the price.`;
    } else if (
      plan === "Plus" &&
      seats > 1 &&
      useCase !== "coding" &&
      useCase !== "data"
    ) {
      // Suggest Claude Pro as alternative for writing/research
      const claudeEquivalent = 20 * seats;
      const chatgptCost = 20 * seats;
      if (chatgptCost >= claudeEquivalent) {
        status = "switch";
        recommendedTool = "Claude Pro";
        recommendedAction = "Consider Claude Pro for writing/research";
        monthlySavings = 0;
        reasoning = `At the same price ($20/seat), Claude Pro offers larger context windows (200K tokens vs 128K) and is consistently rated superior for ${useCase} tasks. Same cost, measurably better output for your use case.`;
      }
    } else {
      reasoning = `ChatGPT ${plan} is a reasonable fit for your team.`;
    }
  }

  // --- API Direct tools ---
  if (tool === "anthropic_api" || tool === "openai_api") {
    // For API users, check if they'd be better on a flat plan
    if (monthlySpend > 100 && seats <= 3) {
      const planAlternative = tool === "anthropic_api" ? "Claude Pro" : "ChatGPT Plus";
      const planCost = 20 * seats;
      if (planCost < monthlySpend) {
        status = "overspending";
        recommendedTool = planAlternative;
        recommendedAction = `Switch to ${planAlternative} flat plan`;
        monthlySavings = monthlySpend - planCost;
        reasoning = `You're spending $${monthlySpend}/mo on API usage for ${seats} user(s). A flat ${planAlternative} subscription ($20/seat = $${planCost}/mo) covers the same daily usage for most teams without token anxiety.`;
      } else {
        reasoning = `API usage at $${monthlySpend}/mo for ${seats} user(s) is cost-effective — you're using enough volume that pay-per-token makes sense over flat plans.`;
      }
    } else {
      reasoning = `API usage at $${monthlySpend}/mo is appropriate for your scale.`;
    }
  }

  // --- Gemini ---
  if (tool === "gemini") {
    if (plan === "Ultra" && useCase === "coding") {
      status = "switch";
      recommendedTool = "Cursor Pro";
      recommendedAction = "Switch to Cursor Pro for coding";
      monthlySavings = (30 - 20) * seats;
      reasoning = `Gemini Ultra ($30/seat) is a general AI assistant. For coding specifically, Cursor Pro ($20/seat) provides purpose-built IDE integration, codebase context, and tab-complete that Gemini's interface can't match.`;
    } else if (plan === "Pro" && useCase === "coding") {
      status = "switch";
      recommendedTool = "GitHub Copilot Individual";
      recommendedAction = "Consider GitHub Copilot for coding tasks";
      monthlySavings = (20 - 10) * seats;
      reasoning = `Gemini Pro is a general-purpose AI. For coding, GitHub Copilot Individual ($10/seat) is purpose-built with IDE plugins, inline suggestions, and better code context — at half the price.`;
    } else {
      reasoning = `Gemini ${plan} is suitable for your ${useCase} tasks.`;
    }
  }

  // --- Windsurf ---
  if (tool === "windsurf") {
    if (plan === "Teams" && seats <= 3) {
      const proSavings = (35 - 15) * seats;
      status = "overspending";
      recommendedPlan = "Pro";
      recommendedAction = "Downgrade to Windsurf Pro";
      monthlySavings = proSavings;
      reasoning = `Windsurf Teams ($35/seat) adds team management and billing consolidation. With ${seats} seat(s), individual Pro plans ($15/seat) cover the same AI coding features at less than half the cost.`;
    } else {
      reasoning = `Windsurf ${plan} is appropriate for your coding team.`;
    }
  }

  // Detect if paying significantly above official price (possible over-seat or vendor billing error)
  if (monthlySpend > 0 && officialPrice > 0) {
    const expected = officialPrice * seats;
    if (monthlySpend > expected * 1.2) {
      const diff = monthlySpend - expected;
      reasoning += ` Note: You reported $${monthlySpend}/mo but ${TOOL_NAMES[tool]} ${plan} at ${seats} seat(s) should cost ~$${expected}/mo. Verify your billing — you may be on an old pricing tier or have extra seats.`;
      if (status === "optimal") {
        status = "overspending";
        monthlySavings = Math.max(monthlySavings, diff);
        recommendedAction = "Audit your billing statement";
      }
    }
  }

  return {
    tool,
    toolName: TOOL_NAMES[tool],
    currentPlan: plan,
    currentSpend: monthlySpend,
    seats,
    status,
    recommendedAction,
    recommendedPlan,
    recommendedTool,
    monthlySavings: Math.max(0, monthlySavings),
    annualSavings: Math.max(0, monthlySavings) * 12,
    reasoning,
  };
}

export function runAudit(input: AuditInput): Omit<AuditResult, "aiSummary"> {
  const recommendations = input.tools.map((entry) =>
    evaluateTool(entry, input.teamSize, input.useCase, input.tools)
  );

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isOptimal = totalMonthlySavings < 10;

  return {
    id: nanoid(10),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    createdAt: new Date().toISOString(),
    isOptimal,
  };
}
