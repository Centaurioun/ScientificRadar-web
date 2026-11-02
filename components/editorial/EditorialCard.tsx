import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicArticle } from "@/lib/content/types";
import {
  formatPublicationDate,
  getCategoryName,
  getEditorialTypeLabel,
} from "@/lib/content/repository";
import { DEMO_AUTHORS } from "@/lib/content/fixtures";

interface EditorialCardProps {
  article: PublicArticle;
  showSummary?: boolean;
  compact?: boolean;
}

export default function EditorialCard({
  article,
  showSummary = true,
  compact = false,
}: EditorialCardProps) {
  const categoryName = getCategoryName(article.categorySlug);
  const typeLabel = getEditorialTypeLabel(article.editorialType);
  const authors = DEMO_AUTHORS.filter((a) => article.authorIds.includes(a.id))
    .map((a) => a.name)
    .join(" & ");

  return (
    <article className="flex flex-col justify-between group h-full">
      <div>
        {/* Image Container with Consistent 16:10 Aspect Ratio & Resilient Fallback */}
        {!compact && (
          <Link
            href={`/article/${article.slug}`}
            className="block overflow-hidden rounded-sm border border-[var(--sr-rule)] bg-[#14222A] mb-3.5 focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
          >
            {article.hero ? (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={article.hero.src}
                  alt={article.hero.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.015] transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] w-full flex items-center justify-center p-4 text-xs text-slate-300 font-medium">
                {categoryName} · {typeLabel}
              </div>
            )}
          </Link>
        )}

        {/* Unboxed Zero-Pill Metadata Kicker */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--sr-accent)] mb-1.5">
          <Link
            href={`/topics/${article.categorySlug}`}
            className="hover:underline focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
          >
            {categoryName}
          </Link>
          <span aria-hidden="true" className="text-[var(--sr-muted)]">
            ·
          </span>
          <span className="text-[var(--sr-muted)] font-medium">
            {typeLabel}
          </span>
        </div>

        {/* Editorial Serif Title */}
        <h3
          className={`font-editorial font-bold text-[var(--sr-ink)] tracking-tight leading-snug text-balance ${
            compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
          }`}
        >
          <Link
            href={`/article/${article.slug}`}
            className="group-hover:text-[var(--sr-accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
          >
            {article.title}
          </Link>
        </h3>

        {showSummary && (
          <p className="mt-2 text-sm text-[var(--sr-ink-secondary)] leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        )}
      </div>

      {/* Byline & Date Footer */}
      <div className="mt-3 pt-2.5 border-t border-[var(--sr-rule-subtle)] flex items-center flex-wrap gap-1.5 text-xs text-[var(--sr-muted)]">
        {authors && (
          <>
            <span className="font-medium text-[var(--sr-ink)]">{authors}</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <time dateTime={article.publishedAt}>
          {formatPublicationDate(article.publishedAt)}
        </time>
        <span aria-hidden="true">·</span>
        <span>{article.readingTimeMinutes} min read</span>
      </div>
    </article>
  );
}
