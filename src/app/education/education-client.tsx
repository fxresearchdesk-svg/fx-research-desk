"use client";

import Link from "next/link";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

const FEATURED = {
  title: "The Complete Guide to Risk Management",
  excerpt:
    "Learn how professional traders protect capital and compound returns through disciplined position sizing, stop-loss protocols, and drawdown management.",
  href: "/education/risk-management",
};

const ARTICLES = [
  {
    title: "Technical Analysis Fundamentals",
    excerpt:
      "Support, resistance, trendlines, and chart patterns explained.",
    href: "/education/technical-analysis",
  },
  {
    title: "Understanding Forex Correlations",
    excerpt: "How EUR/USD, GBP/USD, and USD/JPY move together and apart.",
    href: "/education",
  },
  {
    title: "The Psychology of Winning Traders",
    excerpt: "Mindset, discipline, and emotional control in volatile markets.",
    href: "/education/trading-psychology",
  },
  {
    title: "Central Bank Policy & FX Markets",
    excerpt: "How Fed, ECB, and BoJ decisions move currency prices.",
    href: "/education",
  },
  {
    title: "Building a Trading Journal",
    excerpt: "Track, review, and improve every trade with data-driven analysis.",
    href: "/education",
  },
  {
    title: "Gold (XAU/USD) Trading Strategy",
    excerpt: "Safe-haven flows, dollar inverse, and key technical levels.",
    href: "/education",
  },
];

export function EducationPageClient() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-[100px]">
        <header className="mb-12">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            KNOWLEDGE CENTER
          </p>
          <h1 className="font-serif-display text-[42px] text-[#1A1A1A]">
            Master the Markets
          </h1>
        </header>

        <section className="mb-14 border border-[#E5E7EB] bg-white p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#B8956A]">
                Featured Guide
              </p>
              <h2 className="font-serif-display mb-4 text-3xl text-[#1A1A1A]">
                {FEATURED.title}
              </h2>
              <p className="mb-6 max-w-2xl text-base leading-relaxed text-[#6B7280]">
                {FEATURED.excerpt}
              </p>
              <Link
                href={FEATURED.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8956A] transition-colors duration-200 hover:text-[#C9A87C]"
              >
                READ GUIDE →
              </Link>
            </div>
            <div className="h-48 border border-[#E5E7EB] bg-[#F9FAFB] lg:h-auto" aria-hidden />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="flex flex-col border border-[#E5E7EB] bg-white"
            >
              <div className="h-40 border-b border-[#E5E7EB] bg-[#F9FAFB]" aria-hidden />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 text-lg text-[#1A1A1A]">{article.title}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-[#6B7280]">
                  {article.excerpt}
                </p>
                <Link
                  href={article.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A] transition-colors duration-200 hover:text-[#C9A87C]"
                >
                  READ →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
