import type { NewsArticle } from "@/components/news-article-card";

export const BLOCKED_SOURCES = [
  "pypi.org",
  "github.com",
  "techcrunch",
  "the verge",
] as const;

export const NEWS_QUERY =
  "forex+trading+OR+foreign+exchange+OR+currency+market+OR+EURUSD+OR+GBPUSD+OR+USDJPY+OR+gold+price+OR+Federal+Reserve+OR+ECB+OR+interest+rates";

export const NEWS_CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "forex", label: "FOREX" },
  { id: "commodities", label: "COMMODITIES" },
  { id: "central-banks", label: "CENTRAL BANKS" },
  { id: "crypto", label: "CRYPTO" },
] as const;

export type NewsCategoryId = (typeof NEWS_CATEGORIES)[number]["id"];

const CATEGORY_KEYWORDS: Record<Exclude<NewsCategoryId, "all">, string[]> = {
  forex: [
    "forex",
    "fx",
    "currency",
    "eurusd",
    "eur/usd",
    "gbpusd",
    "gbp/usd",
    "usdjpy",
    "usd/jpy",
    "foreign exchange",
    "currency pair",
    "pip",
  ],
  commodities: [
    "gold",
    "silver",
    "oil",
    "crude",
    "commodity",
    "commodities",
    "xau",
    "xag",
    "precious metal",
    "copper",
    "natural gas",
  ],
  "central-banks": [
    "federal reserve",
    "fed ",
    "ecb",
    "central bank",
    "interest rate",
    "interest rates",
    "monetary policy",
    "rate cut",
    "rate hike",
    "powell",
    "lagarde",
    "fomc",
    "bank of england",
    "boe",
  ],
  crypto: [
    "crypto",
    "cryptocurrency",
    "bitcoin",
    "btc",
    "ethereum",
    "eth",
    "blockchain",
    "digital asset",
  ],
};

export function filterBlockedArticles(articles: NewsArticle[]): NewsArticle[] {
  return articles.filter((article) => {
    const sourceName = (article.source?.name ?? "").toLowerCase();
    const url = (article.url ?? "").toLowerCase();
    const title = article.title ?? "";

    if (!title.trim() || !article.url) return false;

    return !BLOCKED_SOURCES.some(
      (blocked) => sourceName.includes(blocked) || url.includes(blocked)
    );
  });
}

export function filterArticlesByCategory(
  articles: NewsArticle[],
  category: NewsCategoryId
): NewsArticle[] {
  if (category === "all") return articles;

  const keywords = CATEGORY_KEYWORDS[category];

  return articles.filter((article) => {
    const text = `${article.title} ${article.description ?? ""}`.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
}

export function dedupeArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  });
}
