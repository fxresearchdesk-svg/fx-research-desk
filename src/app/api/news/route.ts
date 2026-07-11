import { NextResponse } from "next/server";

const NEWS_API_KEY =
  process.env.NEWS_API_KEY ?? "1ed9335a9f8f4542b5f6cfe53ec511d4";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = Math.min(
      Math.max(Number(searchParams.get("pageSize")) || 6, 1),
      20
    );

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=forex+OR+currency+trading+OR+EUR+USD+GBP&sortBy=publishedAt&language=en&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 900 } }
    );
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "News API error");
    }

    return NextResponse.json({ articles: data.articles });
  } catch (err) {
    const message = err instanceof Error ? err.message : "News API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
