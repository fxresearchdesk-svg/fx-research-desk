export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
};

type NewsArticleCardProps = {
  article: NewsArticle;
};

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group border border-[#E5E7EB] bg-white transition hover:border-[#B8956A]/40"
    >
      {article.urlToImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#B8956A]">
          {article.source.name}
        </p>
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-[#1A1A1A] transition group-hover:text-[#B8956A]">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-[#6B7280]">
          {article.description}
        </p>
        <p className="text-xs text-[#9CA3AF]">
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </a>
  );
}
