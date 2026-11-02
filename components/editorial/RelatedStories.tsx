import React from "react";
import { PublicArticle } from "@/lib/content/types";
import EditorialCard from "./EditorialCard";

interface RelatedStoriesProps {
  articles: PublicArticle[];
}

export default function RelatedStories({ articles }: RelatedStoriesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-reading-heading"
      className="site-container mt-16 pt-12 border-t border-[var(--sr-rule)]"
    >
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
        <h2
          id="related-reading-heading"
          className="font-editorial text-xl sm:text-2xl font-bold text-[var(--sr-ink)]"
        >
          Related Scientific Reading
        </h2>
        <span className="text-xs text-[var(--sr-muted)]">
          Selected from the ScientificRadar Demo Corpus
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <EditorialCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
