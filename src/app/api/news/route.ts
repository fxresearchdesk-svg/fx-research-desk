import { NextResponse } from "next/server";
import type { NewsArticle } from "@/components/news-article-card";
import {
  filterBlockedArticles,
  filterFreshArticles,
  NEWS_QUERY,
  sortArticlesNewestFirst,
} from "@/lib/news";

const NEWS_API_KEY =
  process.env.NEWS_API_KEY ?? "1ed9335a9f8f4542b5f6cfe53ec511d4";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = Math.min(
      Math.max(Number(searchParams.get("pageSize")) || 12, 1),
      20
    );
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${NEWS_QUERY}&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "News API error");
    }

    const articles = sortArticlesNewestFirst(
      filterFreshArticles(
        filterBlockedArticles((data.articles ?? []) as NewsArticle[]),
        7
      )
    );

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      page,
      pageSize,
      hasMore: page * pageSize < (data.totalResults ?? 0) && articles.length > 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "News API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
