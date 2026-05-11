// src/app/layout.tsx
import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "SpendSight — AI Tool Spend Auditor",
  description:
    "Find out exactly where your team is overspending on AI tools. Free audit in 60 seconds.",
  openGraph: {
    title: "SpendSight — AI Tool Spend Auditor",
    description:
      "Find out exactly where your team is overspending on AI tools. Free audit in 60 seconds.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpendSight - AI Spend Audit Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSight — AI Tool Spend Auditor",
    description: "Find out exactly where your team is overspending on AI tools.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
