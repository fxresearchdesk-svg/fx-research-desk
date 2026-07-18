"use client";

import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

const FEATURED = {
  title: "The Complete Guide to Risk Management",
  excerpt:
    "Learn how professional traders protect capital and compound returns through disciplined position sizing, stop-loss protocols, and drawdown management.",
  href: "/education/risk-management",
};

type EducationArticle = {
  title: string;
  excerpt: string;
  href?: string;
  comingSoon?: boolean;
};

const ARTICLES: EducationArticle[] = [
  {
    title: "Technical Analysis Fundamentals",
    excerpt: "Support, resistance, trendlines, and chart patterns explained.",
    href: "/education/technical-analysis",
  },
  {
    title: "Understanding Forex Correlations",
    excerpt: "How EUR/USD, GBP/USD, and USD/JPY move together and apart.",
    comingSoon: true,
  },
  {
    title: "The Psychology of Winning Traders",
    excerpt: "Mindset, discipline, and emotional control in volatile markets.",
    href: "/education/trading-psychology",
  },
  {
    title: "Central Bank Policy & FX Markets",
    excerpt: "How Fed, ECB, and BoJ decisions move currency prices.",
    comingSoon: true,
  },
  {
    title: "Building a Trading Journal",
    excerpt: "Track, review, and improve every trade with data-driven analysis.",
    comingSoon: true,
  },
  {
    title: "Gold (XAU/USD) Trading Strategy",
    excerpt: "Safe-haven flows, dollar inverse, and key technical levels.",
    comingSoon: true,
  },
];

export function EducationPageClient() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 lg:px-10">
        <header className="mb-12">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            KNOWLEDGE CENTER
          </p>
          <h1 className="font-landing-serif text-[42px] font-bold text-[#0E0F13]">
            Master the Markets
          </h1>
        </header>

        <section className="mb-14 border border-[#E7E3D8] bg-white p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C6A15B]">
                Featured Guide
              </p>
              <h2 className="font-landing-serif mb-4 text-3xl font-bold text-[#0E0F13]">
                {FEATURED.title}
              </h2>
              <p className="mb-6 max-w-2xl text-base leading-relaxed text-[#4A463C]">
                {FEATURED.excerpt}
              </p>
              <Link
                href={FEATURED.href}
                className="landing-focus text-xs font-bold uppercase tracking-[0.2em] text-[#C6A15B] transition-colors hover:text-[#E8C173]"
              >
                READ GUIDE →
              </Link>
            </div>
            <div className="h-48 border border-[#E7E3D8] bg-[#F1EEE5] lg:h-auto" aria-hidden />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="relative flex flex-col border border-[#E7E3D8] bg-white"
            >
              {article.comingSoon && (
                <span className="absolute right-0 top-0 bg-[#0E0F13] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-white">
                  COMING SOON
                </span>
              )}
              <div className="h-40 border-b border-[#E7E3D8] bg-[#F1EEE5]" aria-hidden />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 text-lg font-semibold text-[#0E0F13]">
                  {article.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-[#4A463C]">
                  {article.excerpt}
                </p>
                {article.comingSoon || !article.href ? (
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A9488]">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={article.href}
                    className="landing-focus text-[11px] font-bold uppercase tracking-[0.2em] text-[#C6A15B] transition-colors hover:text-[#E8C173]"
                  >
                    READ →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
