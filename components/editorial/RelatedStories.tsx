"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicArticle } from "@/lib/content/types";
import EditorialCard from "./EditorialCard";

interface RelatedStoriesProps {
  articles: PublicArticle[];
}

export default function RelatedStories({ articles }: RelatedStoriesProps) {
  const track = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
        const nextPosition = Math.max(0, Math.min(maximum, element.scrollLeft));
        const firstSlide = element.querySelector<HTMLElement>("[data-related-slide]");
        const firstSlideBounds = firstSlide?.getBoundingClientRect();
        const trackBounds = element.getBoundingClientRect();
        const initialOffset = firstSlideBounds
          ? Math.max(0, element.scrollLeft + firstSlideBounds.left - trackBounds.left)
          : 0;
        setCanScrollPrevious(nextPosition > initialOffset + 2);
        setCanScrollNext(nextPosition < maximum - 2);

        const styles = getComputedStyle(element);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
        const step = firstSlide
          ? firstSlide.getBoundingClientRect().width + gap
          : element.clientWidth;
        setPosition(step > 0 ? Math.round(nextPosition / step) : 0);
      });
    };

    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;

  const scroll = (direction: -1 | 1) => {
    const element = track.current;
    if (!element) return;

    const firstSlide = element.querySelector<HTMLElement>("[data-related-slide]");
    const styles = getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
    const step = firstSlide
      ? firstSlide.getBoundingClientRect().width + gap
      : element.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="related-reading-heading"
      aria-roledescription="carousel"
      className="site-container mt-16 border-t border-[var(--sr-rule)] pt-12"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="related-reading-heading"
            className="font-editorial text-xl font-bold text-[var(--sr-ink)] sm:text-2xl"
          >
            Related Reading
          </h2>
          <p className="mt-1 text-xs text-[var(--sr-muted)]">
            Selected from the ScientificRadar Demo Corpus
          </p>
        </div>

        {articles.length > 1 && (
          <div
            className="flex items-center gap-2"
            role="group"
            aria-label="Related Reading carousel controls"
          >
            <span aria-live="polite" className="sr-only">
              Related story {Math.min(position + 1, articles.length)} of {articles.length}
            </span>
            <button
              type="button"
              aria-label="Previous related stories"
              aria-controls="related-reading-track"
              disabled={!canScrollPrevious}
              onClick={() => scroll(-1)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-[var(--sr-rule)] bg-white text-[var(--sr-ink)] transition-colors hover:bg-[var(--sr-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next related stories"
              aria-controls="related-reading-track"
              disabled={!canScrollNext}
              onClick={() => scroll(1)}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-[var(--sr-rule)] bg-white text-[var(--sr-ink)] transition-colors hover:bg-[var(--sr-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        id="related-reading-track"
        ref={track}
        role="group"
        aria-label={`Related articles, ${articles.length} stories`}
        tabIndex={0}
        data-testid="related-reading-track"
        className="-mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-3 pb-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)] motion-reduce:scroll-auto sm:mx-0 sm:px-0"
      >
        {articles.map((article, index) => (
          <div
            key={article.id}
            data-related-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${articles.length}: ${article.title}`}
            className="flex basis-[84%] shrink-0 snap-start flex-col sm:basis-[calc((100%_-_1rem)/2)] lg:basis-[calc((100%_-_2rem)/3)]"
          >
            <EditorialCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
