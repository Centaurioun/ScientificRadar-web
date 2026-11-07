"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PublicSource } from "@/lib/content/types";

interface CitationInteractionsProps {
  sources: PublicSource[];
  children: React.ReactNode;
}

interface Preview {
  source: PublicSource;
  anchor: HTMLAnchorElement;
  left: number;
  top: number;
}

export default function CitationInteractions({ sources, children }: CitationInteractionsProps) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const saved = useRef<{
    x: number;
    y: number;
    hash: string;
    anchor: HTMLAnchorElement;
  } | null>(null);
  const sourceMap = new Map(sources.map((source) => [source.id, source]));

  useEffect(() => {
    if (!preview) return;
    const hide = () => setPreview(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      document.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  function citationAnchor(target: EventTarget | null): HTMLAnchorElement | null {
    if (!(target instanceof Element)) return null;
    return target.closest<HTMLAnchorElement>("a[data-citation-source-id]");
  }

  function showCitation(anchor: HTMLAnchorElement, keyboard = false) {
    if (!keyboard && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const id = anchor.dataset.citationSourceId;
    const source = id ? sourceMap.get(id) : undefined;
    if (!source) return;

    const rect = anchor.getBoundingClientRect();
    const width = Math.min(392, window.innerWidth - 32);
    const height = 260;
    const left = Math.max(16, Math.min(window.innerWidth - width - 16, rect.left));
    const top = rect.bottom + height + 10 <= window.innerHeight - 16
      ? rect.bottom + 10
      : Math.max(16, rect.top - height - 10);
    setPreview({ source, anchor, left, top });
  }

  const hideCitation = (target: EventTarget | null, related: EventTarget | null) => {
    const anchor = citationAnchor(target);
    if (!anchor) return;
    if (related instanceof Node && anchor.contains(related)) return;
    setPreview((previous) => previous?.anchor === anchor ? null : previous);
  };

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("a[href]");
    if (!link) return;

    if (link.matches("a[data-citation-source-id]")) {
      saved.current = {
        x: window.scrollX,
        y: window.scrollY,
        hash: window.location.hash,
        anchor: link,
      };
      setPreview(null);
      // Native fragment navigation remains the primary action.
      return;
    }

    if (!link.matches('a[data-back-to-citation="true"]')) return;
    const previous = saved.current;
    if (!previous) return; // Preserve the original href fallback if no reading point was recorded.
    event.preventDefault();
    setPreview(null);
    requestAnimationFrame(() => {
      previous.anchor.focus({ preventScroll: true });
      window.scrollTo({ left: previous.x, top: previous.y, behavior: "instant" });
      const url = new URL(window.location.href);
      url.hash = previous.hash;
      window.history.replaceState(window.history.state, "", url.toString());
    });
  }

  return (
    <div
      className="min-w-0"
      onMouseOver={(event) => {
        const anchor = citationAnchor(event.target);
        if (anchor) showCitation(anchor);
      }}
      onMouseOut={(event) => hideCitation(event.target, event.relatedTarget)}
      onFocusCapture={(event) => {
        const anchor = citationAnchor(event.target);
        if (anchor) showCitation(anchor, true);
      }}
      onBlurCapture={(event) => hideCitation(event.target, event.relatedTarget)}
      onClickCapture={handleClick}
    >
      {children}
      {preview && typeof document !== "undefined" && createPortal(
        <div
          role="tooltip"
          data-testid="citation-hover-preview"
          style={{
            position: "fixed",
            zIndex: 999,
            left: preview.left,
            top: preview.top,
            pointerEvents: "none",
            width: "min(392px, calc(100vw - 32px))",
            maxHeight: "min(70vh, 360px)",
            overflow: "hidden",
            boxSizing: "border-box",
            padding: 18,
            border: "1px solid #c8d4d7",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 16px 45px rgba(15, 36, 44, .22)",
            color: "#181c21",
          }}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--sr-accent)]">
            Reference [{preview.source.label}] · Preview
          </div>
          <p className="mt-3 font-editorial text-base font-bold leading-snug">
            {preview.source.title}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--sr-muted)]">
            {preview.source.authors ? preview.source.authors + " · " : ""}
            {preview.source.publication ? preview.source.publication + " · " : ""}
            {preview.source.year || "Year not recorded"}
          </p>
          {preview.source.isIllustrativeDemo && (
            <div className="mt-3 rounded-sm border border-[#eddbb9] bg-[#fff5df] p-2 text-[11px] font-semibold text-[#79561a]">
              Illustrative demo — not a verified publication
            </div>
          )}
          {preview.source.doi && !preview.source.isIllustrativeDemo && (
            <p className="mt-2 text-xs text-[var(--sr-muted)]">DOI: {preview.source.doi}</p>
          )}
          {preview.source.note && (
            <p className="mt-2 text-xs leading-relaxed text-[var(--sr-muted)]">{preview.source.note}</p>
          )}
          <div className="mt-3 border-t border-[var(--sr-rule)] pt-2 text-xs font-semibold text-[var(--sr-accent)]">
            Click to view in references ↓
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
