"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { renderScientificMath } from "@/lib/content/math";

interface ScientificEquationProps {
  tex: string;
  label: string;
  explanation: string;
  variables?: { symbol: string; meaning: string }[];
}

export default function ScientificEquation({ tex, label, explanation, variables = [] }: ScientificEquationProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const rendered = renderScientificMath(tex);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const returnFocus = trigger.current;
    document.body.style.overflow = "hidden";
    close.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const elements = Array.from(dialog.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!elements.length) return;
      if (event.shiftKey && document.activeElement === elements[0]) {
        event.preventDefault();
        elements[elements.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) {
        event.preventDefault();
        elements[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  const math = (
    <div role="math" aria-label={tex} className="overflow-x-auto py-3 px-2 font-math text-base whitespace-nowrap text-[var(--sr-ink)] sm:text-lg">
      {rendered ? (
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      ) : (
        <code className="whitespace-pre-wrap break-words">{tex}</code>
      )}
    </div>
  );

  return (
    <section
      data-tex={tex}
      className="article-prose my-8 rounded-sm border border-[var(--sr-rule)] bg-[var(--sr-surface)] p-5"
      data-testid="scientific-equation"
    >
      <div className="mb-2 text-xs font-sans font-semibold uppercase tracking-wider text-[var(--sr-muted)]">
        {label}
      </div>
      {math}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sr-rule)] pt-3">
        <p className="text-xs leading-relaxed text-[var(--sr-muted)]">Swipe the equation if needed to inspect all terms.</p>
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          data-testid="equation-inspect-trigger"
          aria-haspopup="dialog"
          className="min-h-11 cursor-pointer rounded-sm border border-[var(--sr-accent)] bg-white px-3 text-xs font-semibold text-[var(--sr-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)]"
        >
          ⤢ &nbsp; Inspect equation
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[var(--sr-ink-secondary)] sm:text-[13px]">
        {explanation}
      </p>
      {variables.length > 0 && (
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 border-t border-[var(--sr-rule)] pt-2.5 text-xs font-sans sm:grid-cols-2">
          {variables.map((item) => (
            <div key={item.symbol} className="flex gap-1.5">
              <dt className="shrink-0 font-math font-semibold text-[var(--sr-ink)]">{item.symbol}:</dt>
              <dd className="text-[var(--sr-muted)]">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      )}

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-[#0d181ed9] text-[#181c21] sm:items-center sm:p-6"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={label + " inspector"}
            className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-xl sm:max-h-[85dvh] sm:max-w-2xl sm:rounded-md"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--sr-rule)] px-4 py-3 sm:px-7">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--sr-accent)]">Equation inspection</div>
                <h2 className="mt-1 truncate font-editorial text-base font-bold">{label}</h2>
              </div>
              <button
                ref={close}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close equation inspector"
                className="min-h-11 shrink-0 cursor-pointer rounded-sm border border-[var(--sr-rule)] bg-[var(--sr-surface)] px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)]"
              >
                ✕ Close
              </button>
            </header>
            <div className="min-h-0 overflow-y-auto px-4 pb-7 pt-5 sm:px-7">
              <div className="rounded-sm border border-[var(--sr-rule)] bg-[var(--sr-surface)] p-3">
                {math}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--sr-ink-secondary)]">
                {explanation}
              </p>
              {variables.length > 0 && (
                <>
                  <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--sr-accent)]">Variable definitions</h3>
                  <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {variables.map((item) => (
                      <div key={item.symbol} className="rounded-sm border border-[var(--sr-rule)] bg-[var(--sr-paper)] p-3">
                        <dt className="font-math font-bold text-[var(--sr-ink)]">{item.symbol}</dt>
                        <dd className="mt-1 text-xs leading-relaxed text-[var(--sr-muted)]">{item.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
