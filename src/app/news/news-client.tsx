"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { NewsArticleCard, type NewsArticle } from "@/components/news-article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  dedupeArticles,
  filterArticlesByCategory,
  NEWS_CATEGORIES,
  type NewsCategoryId,
} from "@/lib/news";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function NewsPageClient() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategoryId>("all");

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    const res = await fetch(`/api/news?pageSize=${PAGE_SIZE}&page=${pageNum}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load news");
    }

    const incoming = (data.articles ?? []) as NewsArticle[];

    setArticles((prev) =>
      dedupeArticles(append ? [...prev, ...incoming] : incoming)
    );
    setPage(pageNum);
    setHasMore(Boolean(data.hasMore));
  }, []);

  useEffect(() => {
    fetchPage(1, false)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [fetchPage]);

  const filteredArticles = useMemo(
    () => filterArticlesByCategory(articles, activeCategory),
    [articles, activeCategory]
  );

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await fetchPage(page + 1, true);
    } catch {
      // keep existing articles visible
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-[100px]">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
          Market Intelligence
        </p>
        <h1 className="font-serif-display mb-8 text-4xl text-[#1A1A1A]">
          Latest Forex & Market News
        </h1>

        <div className="mb-10 flex flex-wrap gap-2">
          {NEWS_CATEGORIES.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-200",
                  active
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#B8956A] hover:text-[#B8956A]"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <div
                key={i}
                className="h-[320px] animate-pulse border border-[#E5E7EB] bg-white"
              />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, i) => (
                <NewsArticleCard key={`${article.url}-${i}`} article={article} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-block border border-[#1A1A1A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#6B7280]">
              No articles match this category yet. Try another tab or load more news.
            </p>
            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-6 inline-block border border-[#1A1A1A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
