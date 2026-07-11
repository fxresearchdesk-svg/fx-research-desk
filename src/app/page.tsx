"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { HomePricingSection } from "@/components/home/home-pricing-section";
import { HomeTestimonial } from "@/components/home/home-testimonial";
import { SwissBankHero } from "@/components/home/swiss-bank-hero";
import { NewsArticleCard, type NewsArticle } from "@/components/news-article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  fetchStats,
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { navLinks } from "@/lib/site-config";
import type { Stats, Testimonial } from "@/lib/types";

const FALLBACK_STATS = {
  win_rate: 87.3,
  pips_month: 2450,
  monthly_return: 14.2,
  active_traders: 500,
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Subscribe",
    description: "Choose a plan and get instant access to our secure Telegram channel.",
  },
  {
    step: "2",
    title: "Receive Signals",
    description:
      "Daily trade alerts with entry, stop-loss, and take-profit levels in real-time.",
  },
  {
    step: "3",
    title: "Execute Trades",
    description:
      "Apply institutional-grade setups with clear risk parameters on your broker.",
  },
];

const FEATURED_TESTIMONIAL = {
  quote:
    "The precision of these signals transformed my trading. This is not retail — this is institutional execution.",
  name: "Ahmed K.",
  location: "Dubai",
  memberSince: "2024",
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("");

  const [statsLoading, setStatsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState<Stats | null>(null);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const stats = liveStats ?? FALLBACK_STATS;
  const winRateDisplay = `${Math.round(Number(stats.win_rate))}%`;

  const featuredTestimonial = liveTestimonials[0]
    ? {
        quote: liveTestimonials[0].quote,
        name: liveTestimonials[0].name,
        location: liveTestimonials[0].location ?? "",
        memberSince: new Date(liveTestimonials[0].created_at).getFullYear().toString(),
      }
    : FEATURED_TESTIMONIAL;

  useEffect(() => {
    const configured = isSupabaseConfigured();

    if (!configured) {
      setStatsLoading(false);
      return;
    }

    async function load() {
      const [statsData, testimonials] = await Promise.all([
        fetchStats(),
        fetchTestimonials(),
      ]);
      if (statsData) setLiveStats(statsData);
      setLiveTestimonials(testimonials);
      setStatsLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    fetch("/api/news?pageSize=3")
      .then((r) => r.json())
      .then((data) => {
        setNewsArticles(data.articles || []);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  useEffect(() => {
    const ids = navLinks
      .map((l) => l.href.replace("/#", "").replace("#", ""))
      .filter((id) => !["charts", "news", "education"].includes(id));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar activeSection={activeSection} />

      <SwissBankHero
        winRate={winRateDisplay}
        pipsMonth={stats.pips_month}
        members={stats.active_traders}
        loading={statsLoading}
      />

      <section className="border-y border-[#E5E7EB] bg-[#F9FAFB] py-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-[#4A4A4A]">
          Secure Checkout
          <span className="mx-4 text-[#D1D5DB]">|</span>
          Instant Access
          <span className="mx-4 text-[#D1D5DB]">|</span>
          Verified Results
          <span className="mx-4 text-[#D1D5DB]">|</span>
          Global Reach
        </p>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <header className="mb-14 text-center">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
              Process
            </p>
            <h2 className="font-serif-display text-3xl text-[#1A1A1A]">How It Works</h2>
          </header>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-data mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#E5E7EB] text-lg text-[#B8956A]">
                  {item.step}
                </div>
                <h3 className="mb-3 text-lg text-[#1A1A1A]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomePricingSection />

      <HomeTestimonial
        quote={featuredTestimonial.quote}
        name={featuredTestimonial.name}
        location={featuredTestimonial.location}
        memberSince={featuredTestimonial.memberSince}
      />

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
                Market Intelligence
              </p>
              <h2 className="font-serif-display text-3xl text-[#1A1A1A]">Latest News</h2>
            </div>
            <Link
              href="/news"
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8956A] transition-colors duration-200 hover:text-[#C9A87C]"
            >
              View All →
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse border border-[#E5E7EB] bg-[#F9FAFB]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {newsArticles.slice(0, 3).map((article, i) => (
                <NewsArticleCard key={`${article.url}-${i}`} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
