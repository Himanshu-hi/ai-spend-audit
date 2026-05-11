// src/app/share/[id]/page.tsx
import { Metadata } from "next";
import SharedAuditView from "./SharedAuditView";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spendsight.ai";
    const res = await fetch(`${baseUrl}/api/share/${params.id}`, { cache: "no-store" });
    
    if (!res.ok) {
      return { title: "Audit Not Found — SpendSight" };
    }
    
    const data = await res.json();
    const savings = data.totalMonthlySavings;
    const title = savings > 0
      ? `AI Audit: $${savings}/mo in savings found — SpendSight`
      : `AI Stack Audit — SpendSight`;
    const description = savings > 0
      ? `This team found $${savings}/month ($${savings * 12}/year) in AI tool overspend. Audit your own stack for free.`
      : `Full AI tool spend audit. Check if your team is overspending on Cursor, GitHub Copilot, Claude, and more.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${baseUrl}/og-image.png`],
      },
    };
  } catch {
    return { title: "SpendSight — AI Spend Auditor" };
  }
}

export default function SharePage({ params }: Props) {
  return <SharedAuditView auditId={params.id} />;
}
