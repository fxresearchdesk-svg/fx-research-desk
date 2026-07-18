"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NewsArticleCard, type NewsArticle } from "@/components/news-article-card";
import { SiteShell } from "@/components/site-shell";
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
  const [fetchFailed, setFetchFailed] = useState(false);

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
    setFetchFailed(false);
  }, []);

  useEffect(() => {
    fetchPage(1, false)
      .catch(() => setFetchFailed(true))
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

  const emptyMessage =
    fetchFailed || articles.length === 0
      ? "New articles publishing weekly — check back soon."
      : "No articles match this category yet. Try another tab or load more news.";

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 lg:px-10">
        <header className="mb-10">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            MARKET INTELLIGENCE
          </p>
          <h1 className="font-landing-serif text-[42px] font-bold text-[#0E0F13]">
            Latest Forex & Market News
          </h1>
        </header>

        <div className="mb-10 flex flex-wrap gap-2">
          {NEWS_CATEGORIES.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "landing-focus border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                  active
                    ? "border-[#0E0F13] bg-[#0E0F13] text-white"
                    : "border-[#E7E3D8] bg-white text-[#0E0F13] hover:border-[#C6A15B] hover:text-[#C6A15B]"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-[320px] animate-pulse border border-[#E7E3D8] bg-white"
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
                  className="landing-focus inline-block border-[1.5px] border-[#0E0F13] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0E0F13] transition-colors hover:bg-[#0E0F13] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="border border-[#E7E3D8] bg-white px-6 py-16 text-center">
            <p className="text-[15px] font-medium text-[#4A463C]">{emptyMessage}</p>
            {hasMore && articles.length > 0 && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="landing-focus mt-6 inline-block border-[1.5px] border-[#0E0F13] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0E0F13] transition-colors hover:bg-[#0E0F13] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
