"use client";

import { useEffect, useState } from "react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { NewsArticleCard, type NewsArticle } from "@/components/news-article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export function NewsPageClient() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-[100px]">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
          Market Intelligence
        </p>
        <h1 className="font-serif-display mb-12 text-4xl text-[#1A1A1A]">
          Latest Forex & Market News
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[320px] animate-pulse border border-[#E5E7EB] bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <NewsArticleCard key={`${article.url}-${i}`} article={article} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
