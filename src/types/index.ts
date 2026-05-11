// src/types/index.ts

export type AITool =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  tool: AITool;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  tool: AITool;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  seats: number;
  status: "overspending" | "optimal" | "switch";
  recommendedAction: string;
  recommendedPlan?: string;
  recommendedTool?: string;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
}

export interface AuditResult {
  id: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  createdAt: string;
  isOptimal: boolean;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}

export const TOOL_PLANS: Record<AITool, string[]> = {
  cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  github_copilot: ["Individual", "Business", "Enterprise"],
  claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  chatgpt: ["Plus", "Team", "Enterprise", "API direct"],
  anthropic_api: ["API direct"],
  openai_api: ["API direct"],
  gemini: ["Free", "Pro", "Ultra", "API"],
  windsurf: ["Free", "Pro", "Teams"],
};

export const TOOL_NAMES: Record<AITool, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: "Coding / Development",
  writing: "Writing / Content",
  data: "Data Analysis",
  research: "Research",
  mixed: "Mixed / General",
};
