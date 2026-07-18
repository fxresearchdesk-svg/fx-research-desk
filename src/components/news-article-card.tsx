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
      className="group border border-[#E7E3D8] bg-white transition hover:border-[#C6A15B]/50"
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
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C6A15B]">
          {article.source.name}
        </p>
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-[#0E0F13] transition group-hover:text-[#C6A15B]">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-[#4A463C]">
          {article.description}
        </p>
        <p className="text-xs text-[#9A9488]">
          {new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </a>
  );
}
