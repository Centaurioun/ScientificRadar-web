"use client";

import React, { useState } from "react";
import {
  ArticleBlock,
  PublicArticle,
  PublicAuthor,
} from "@/lib/content/types";
import {
  READING_MEASURE_PRESETS,
  ReadingMeasureOption,
} from "@/lib/design/tokens";
import { sanitizeCanonicalBodyHtml } from "@/lib/content/sanitizer";
import ScientificFigure from "./ScientificFigure";
import CitationList from "./CitationList";
import AuthorProfile from "./AuthorProfile";

interface ArticleReaderProps {
  article: PublicArticle;
  authors: PublicAuthor[];
  initialMeasure?: ReadingMeasureOption;
}

export default function ArticleReader({
  article,
  authors,
  initialMeasure = "700",
}: ArticleReaderProps) {
  const [measure, setMeasure] = useState<ReadingMeasureOption>(initialMeasure);

  const headings = article.blocks.filter(
    (b): b is Extract<ArticleBlock, { type: "heading" }> =>
      b.type === "heading" && b.level === 2
  );

  const sourceMap = new Map(article.sources.map((s) => [s.id, s]));
  const activePreset = READING_MEASURE_PRESETS[measure];

  const handleMeasureChange = (nextMeasure: ReadingMeasureOption) => {
    setMeasure(nextMeasure);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("measure", nextMeasure);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div
      data-reading-measure={measure}
      style={
        {
          "--sr-reading-max": activePreset.px,
        } as React.CSSProperties
      }
      className="site-container pb-12"
    >
      {/* Reading Measure Comparator Control Bar (For Owner 600px vs 700px Evaluation) */}
      <div className="max-w-[var(--sr-reading-max)] mx-auto mb-8 p-3 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-xs text-[var(--sr-ink-secondary)]">
          <span className="font-semibold text-[var(--sr-ink)]">
            Reading Column Width:
          </span>{" "}
          <span data-testid="active-reading-measure-label">
            {activePreset.label}
          </span>
        </div>

        <div
          role="group"
          aria-label="Select article reading column width"
          className="inline-flex items-center gap-1 bg-white p-1 rounded-sm border border-[var(--sr-rule)] self-start sm:self-auto"
        >
          {(["700", "600", "560"] as ReadingMeasureOption[]).map((opt) => {
            const isSelected = measure === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleMeasureChange(opt)}
                aria-pressed={isSelected}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--sr-accent)] text-white font-semibold"
                    : "text-[var(--sr-muted)] hover:text-[var(--sr-ink)]"
                }`}
              >
                {opt}px
              </button>
            );
          })}
        </div>
      </div>

      {/* Quanta/Knowable-inspired Layout: Optional Desktop Left Rail OUTSIDE Reading Column */}
      <div className="relative xl:grid xl:grid-cols-[220px_minmax(0,1fr)_220px] xl:gap-8 items-start">
        {/* Left Rail on Desktop >=1280px (Never shrinks central prose column) */}
        <aside
          aria-label="Article outline and metadata"
          className="hidden xl:block sticky top-28 space-y-6 pr-2 text-xs text-[var(--sr-muted)]"
        >
          {headings.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold uppercase tracking-wider text-[var(--sr-ink)]">
                In This Article
              </div>
              <ul className="space-y-2 border-l border-[var(--sr-rule)] pl-3">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="block hover:text-[var(--sr-accent)] transition-colors leading-snug"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
                {article.sources.length > 0 && (
                  <li>
                    <a
                      href="#references-heading"
                      className="block hover:text-[var(--sr-accent)] transition-colors leading-snug"
                    >
                      Sources &amp; References ({article.sources.length})
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-[var(--sr-rule)] space-y-1.5">
            <div className="font-semibold uppercase tracking-wider text-[var(--sr-ink)]">
              Edition Status
            </div>
            <p className="leading-relaxed">
              Original Stage A demonstration article. Typography: Merriweather
              serif prose ({activePreset.px} measure).
            </p>
          </div>
        </aside>

        {/* Central Article Body Column */}
        <div className="min-w-0">
          {article.bodyHtml ? (
            <div
              data-testid="article-prose-container"
              className="article-prose font-editorial text-[var(--sr-ink)] space-y-6"
              dangerouslySetInnerHTML={{
                __html: sanitizeCanonicalBodyHtml(article.bodyHtml),
              }}
            />
          ) : (
            <div
              data-testid="article-prose-container"
              className="space-y-6"
            >
              {article.blocks.map((block) => {
                switch (block.type) {
                  case "paragraph": {
                    return (
                      <p
                        key={block.id}
                        className={`article-prose font-editorial text-[var(--sr-ink)] ${
                          block.dropCap
                            ? "first-letter:float-left first-letter:font-editorial first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:mr-3 first-letter:mt-1 first-letter:text-[var(--sr-ink)]"
                            : ""
                        }`}
                      >
                        {block.text}
                        {block.citations && block.citations.length > 0 && (
                          <sup className="ml-1 font-sans text-xs font-semibold text-[var(--sr-accent)] whitespace-nowrap">
                            {block.citations.map((srcId, i) => {
                              const src = sourceMap.get(srcId);
                              const label = src ? src.label : "?";
                              return (
                                <React.Fragment key={srcId}>
                                  {i > 0 && ","}
                                  <a
                                    id={`cite-${srcId}`}
                                    href={`#ref-${srcId}`}
                                    data-citation-source-id={srcId}
                                    aria-label={`Reference ${label}`}
                                    className="hover:underline px-0.5"
                                  >
                                    [{label}]
                                  </a>
                                </React.Fragment>
                              );
                            })}
                          </sup>
                        )}
                      </p>
                    );
                  }

                  case "heading": {
                    if (block.level === 2) {
                      return (
                        <h2
                          key={block.id}
                          id={block.id}
                          className="article-prose font-editorial text-xl sm:text-2xl font-bold text-[var(--sr-ink)] pt-6 pb-1 tracking-tight scroll-mt-24"
                        >
                          {block.text}
                        </h2>
                      );
                    }
                    return (
                      <h3
                        key={block.id}
                        id={block.id}
                        className="article-prose font-editorial text-lg sm:text-xl font-bold text-[var(--sr-ink)] pt-4 pb-0.5 tracking-tight scroll-mt-24"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  case "quote": {
                    return (
                      <blockquote
                        key={block.id}
                        className="article-prose my-8 py-6 border-y border-[var(--sr-rule)]"
                      >
                        <p className="font-editorial italic text-lg sm:text-xl text-[var(--sr-ink)] leading-relaxed">
                          “{block.quote}”
                        </p>
                        {block.attribution && (
                          <footer className="mt-2.5 text-xs font-sans font-medium text-[var(--sr-muted)]">
                            — {block.attribution}
                          </footer>
                        )}
                      </blockquote>
                    );
                  }

                  case "key-takeaways": {
                    return (
                      <aside
                        key={block.id}
                        aria-label={block.title}
                        className="article-prose my-8 p-5 sm:p-6 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] font-sans"
                      >
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)] mb-3">
                          {block.title}
                        </h2>
                        <ul className="space-y-2.5 text-sm text-[var(--sr-ink-secondary)] leading-relaxed list-disc pl-5">
                          {block.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </aside>
                    );
                  }

                  case "math": {
                    return (
                      <div
                        key={block.id}
                        data-tex={block.tex}
                        className="article-prose my-8 p-5 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)]"
                      >
                        <div className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--sr-muted)] mb-2">
                          {block.label}
                        </div>
                        <div
                          role="math"
                          aria-label={block.tex}
                          className="font-math text-base sm:text-lg text-[var(--sr-ink)] py-3 px-2 overflow-x-auto whitespace-nowrap"
                        >
                          {block.tex
                            .replace(/\\int_\{0\}\^\{\\varepsilon_f\}/g, "∫₀^εf ")
                            .replace(/\\sigma\(\\varepsilon\)\\, d\\varepsilon/g, "σ(ε) dε")
                            .replace(/\\approx/g, "≈")
                            .replace(/\\text\{([^}]+)\}/g, "$1")
                            .replace(/\\cdot/g, "·")
                            .replace(/\^\{-3\}/g, "⁻³")
                            .replace(
                              /\\frac\{\(p\\text\{O\}_2\)\^\{n_H\}\}\{\(P_\{50\}\)\^\{n_H\} \+ \(p\\text\{O\}_2\)\^\{n_H\}\}/g,
                              "(pO₂)^nH / [ (P₅₀)^nH + (pO₂)^nH ]"
                            )
                            .replace(
                              /\\frac\{V_0\}\{\\pi\} \\arctan\\left\(\\frac\{x\}\{D\}\\right\)/g,
                              "(V₀ / π) · arctan(x / D)"
                            )}
                        </div>
                        <p className="mt-2 text-xs sm:text-[13px] font-sans text-[var(--sr-ink-secondary)] leading-relaxed">
                          {block.explanation}
                        </p>
                        {block.variables && block.variables.length > 0 && (
                          <dl className="mt-3 pt-2.5 border-t border-[var(--sr-rule)] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
                            {block.variables.map((v) => (
                              <div key={v.symbol} className="flex gap-1.5">
                                <dt className="font-math font-semibold text-[var(--sr-ink)] shrink-0">
                                  {v.symbol}:
                                </dt>
                                <dd className="text-[var(--sr-muted)]">
                                  {v.meaning}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    );
                  }

                  case "figure": {
                    return (
                      <ScientificFigure
                        key={block.id}
                        media={block.media}
                        figureNumber={block.figureNumber}
                        layout={block.layout}
                      />
                    );
                  }

                  case "table": {
                    return (
                      <div
                        key={block.id}
                        className="my-10 w-full max-w-[var(--sr-figure-max)] mx-auto"
                      >
                        <div className="overflow-x-auto border border-[var(--sr-rule)] rounded-sm bg-white">
                          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm tabular-nums">
                            <caption className="p-4 text-left font-semibold text-[var(--sr-ink)] bg-[var(--sr-surface)] border-b border-[var(--sr-rule)]">
                              {block.table.caption}
                            </caption>
                            <thead>
                              <tr className="border-b border-[var(--sr-rule)] bg-[var(--sr-paper)]">
                                {block.table.headers.map((header, hIdx) => (
                                  <th
                                    key={hIdx}
                                    scope="col"
                                    className="py-3 px-4 font-semibold text-[var(--sr-ink)] whitespace-nowrap"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--sr-rule-subtle)]">
                              {block.table.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="hover:bg-[var(--sr-surface)]/50"
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`py-2.5 px-4 ${
                                        cIdx === 0
                                          ? "font-medium text-[var(--sr-ink)] whitespace-nowrap"
                                          : "text-[var(--sr-ink-secondary)] whitespace-nowrap"
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {block.table.footnote && (
                          <p className="mt-2 text-xs text-[var(--sr-muted)] leading-relaxed">
                            {block.table.footnote}
                          </p>
                        )}
                      </div>
                    );
                  }
                }
              })}
            </div>
          )}

          {/* Citations & References */}
          <CitationList sources={article.sources} />

          {/* Author Box & Topics */}
          <AuthorProfile authors={authors} tags={article.tagSlugs} />
        </div>

        {/* Right Symmetry Rail Spacer on Desktop >=1280px */}
        <div className="hidden xl:block" aria-hidden="true" />
      </div>
    </div>
  );
}
