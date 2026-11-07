"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScientificTableData } from "@/lib/content/types";

interface ScientificTableProps {
  table: ScientificTableData;
}

type View = "matrix" | "focus";

export default function ScientificTable({ table }: ScientificTableProps) {
  const [view, setView] = useState<View>("matrix");
  const [selected, setSelected] = useState(0);
  const manualView = useRef(false);

  useEffect(() => {
    const update = () => {
      if (!manualView.current) {
        setView(window.innerWidth < 700 ? "focus" : "matrix");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (table.headers.length === 0 || table.rows.length === 0) return null;

  const chooseView = (next: View) => {
    manualView.current = true;
    setView(next);
  };
  const selectedRow = table.rows[Math.min(selected, table.rows.length - 1)];
  const control = "min-h-11 cursor-pointer rounded-sm border border-[var(--sr-rule)] px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)]";

  return (
    <section className="my-10 w-full max-w-[var(--sr-figure-max)] mx-auto" data-testid="responsive-scientific-table">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sr-rule)] py-3">
        <h3 className="font-editorial text-sm font-bold text-[var(--sr-ink)]">
          {table.caption}
        </h3>
        <div role="group" aria-label="Table presentation" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => chooseView("matrix")}
            aria-pressed={view === "matrix"}
            className={control + (view === "matrix" ? " bg-[var(--sr-ink)] text-white" : " bg-white text-[var(--sr-ink)]")}
          >
            Data matrix
          </button>
          <button
            type="button"
            onClick={() => chooseView("focus")}
            aria-pressed={view === "focus"}
            className={control + (view === "focus" ? " bg-[var(--sr-ink)] text-white" : " bg-white text-[var(--sr-ink)]")}
          >
            Row focus
          </button>
        </div>
      </div>

      {view === "matrix" ? (
        <div data-testid="table-matrix-view">
          <p className="mb-2 text-xs text-[var(--sr-accent)]">
            Scroll horizontally for more columns →
          </p>
          <div
            role="region"
            aria-label={table.caption + " — horizontally scrollable data table"}
            tabIndex={0}
            className="overflow-x-auto rounded-sm border border-[var(--sr-rule)] bg-white focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
          >
            <table className="w-full min-w-max border-collapse text-left font-sans text-xs sm:text-sm tabular-nums">
              <caption className="sr-only">{table.caption}</caption>
              <thead>
                <tr className="border-b border-[var(--sr-rule)] bg-[var(--sr-paper)]">
                  {table.headers.map((header, index) => (
                    <th
                      scope="col"
                      key={index}
                      className={"px-3 py-3 font-semibold text-[var(--sr-ink)] " +
                        (index === 0 ? "sticky left-0 z-10 max-w-40 min-w-36 whitespace-normal bg-[var(--sr-paper)]" : "whitespace-nowrap text-right")}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sr-rule-subtle)]">
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {table.headers.map((header, index) => index === 0 ? (
                      <th
                        key={index}
                        scope="row"
                        className="sticky left-0 z-10 max-w-40 min-w-36 whitespace-normal bg-white px-3 py-3 font-semibold text-[var(--sr-ink)]"
                      >
                        {row[index] ?? "—"}
                      </th>
                    ) : (
                      <td key={index} className="whitespace-nowrap px-3 py-3 text-right text-[var(--sr-ink-secondary)]">
                        {row[index] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div data-testid="table-row-focus-view" className="rounded-sm border border-[var(--sr-rule)] bg-white">
          <div className="border-b border-[var(--sr-rule)] bg-[var(--sr-surface)] p-4">
            <label htmlFor={"material-" + table.id} className="mb-2 block text-xs font-semibold text-[var(--sr-ink)]">
              Choose a row to inspect
            </label>
            <select
              id={"material-" + table.id}
              aria-label={"Choose a row in " + table.caption}
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="min-h-11 w-full min-w-0 rounded-sm border border-[var(--sr-rule)] bg-white px-3 text-sm text-[var(--sr-ink)] focus-visible:outline-2 focus-visible:outline-[var(--sr-accent)]"
            >
              {table.rows.map((row, index) => (
                <option key={index} value={index}>{row[0] || "Row " + (index + 1)}</option>
              ))}
            </select>
          </div>
          <div className="px-4 pt-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--sr-accent)]">
              Row {selected + 1} of {table.rows.length}
            </div>
            <h4 className="mt-1 font-editorial text-base font-bold text-[var(--sr-ink)]">
              {selectedRow[0]}
            </h4>
          </div>
          <dl className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            {table.headers.slice(1).map((header, index) => (
              <div key={index} className="border-b border-[var(--sr-rule-subtle)] p-4">
                <dt className="text-xs leading-relaxed text-[var(--sr-muted)]">{header}</dt>
                <dd className="mt-1 break-words font-sans text-lg font-bold tabular-nums text-[var(--sr-ink)]">
                  {selectedRow[index + 1] ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {table.footnote && (
        <p className="mt-3 text-xs leading-relaxed text-[var(--sr-muted)]">
          {table.footnote}
        </p>
      )}
    </section>
  );
}
