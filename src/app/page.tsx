"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { CommandCenterHero } from "@/components/home/command-center-hero";
import { HomeLiveSignals } from "@/components/home/home-live-signals";
import { HomePricingStrip } from "@/components/home/home-pricing-strip";
import { HomeTestimonial } from "@/components/home/home-testimonial";
import { NewsArticleCard, type NewsArticle } from "@/components/news-article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  fetchSignals,
  fetchStats,
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { navLinks } from "@/lib/site-config";
import type { Signal, Stats, Testimonial } from "@/lib/types";

const FALLBACK_STATS = {
  win_rate: 87.3,
  pips_month: 2450,
  monthly_return: 14.2,
  active_traders: 500,
};

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
  const [signalsLoading, setSignalsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState<Stats | null>(null);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const stats = liveStats ?? FALLBACK_STATS;
  const winRateDisplay = `${Number(stats.win_rate).toFixed(1)}%`;

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
      setSignalsLoading(false);
      return;
    }

    async function load() {
      const [statsData, signals, testimonials] = await Promise.all([
        fetchStats(),
        fetchSignals(3),
        fetchTestimonials(),
      ]);
      if (statsData) setLiveStats(statsData);
      setLiveSignals(signals);
      setLiveTestimonials(testimonials);
      setStatsLoading(false);
      setSignalsLoading(false);
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
      .filter((id) => !["charts", "pricing", "news", "education"].includes(id));
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
    <main className="min-h-screen overflow-x-hidden bg-[#F5F5F0] text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar activeSection={activeSection} />

      <CommandCenterHero
        winRate={winRateDisplay}
        pipsMonth={stats.pips_month}
        activeMembers={stats.active_traders}
        loading={statsLoading}
      />

      <HomePricingStrip />

      <HomeLiveSignals signals={liveSignals} loading={signalsLoading} />

      <HomeTestimonial
        quote={featuredTestimonial.quote}
        name={featuredTestimonial.name}
        location={featuredTestimonial.location}
        memberSince={featuredTestimonial.memberSince}
      />

      <section className="border-t border-[#E5E7EB] bg-white px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
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
              View All Market News →
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse border border-[#E5E7EB] bg-[#F9FAFB]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
