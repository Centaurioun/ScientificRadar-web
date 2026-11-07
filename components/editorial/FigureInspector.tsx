"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PublicMedia } from "@/lib/content/types";

interface FigureInspectorProps {
  media: PublicMedia;
  figureNumber?: string;
}

const STOPS = [0.18, 0.5, 0.82];

export default function FigureInspector({ media, figureNumber }: FigureInspectorProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [region, setRegion] = useState<number | null>(null);
  const [jump, setJump] = useState(0);
  const [caption, setCaption] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x:number; y:number; left:number; top:number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const labels = media.src.includes("spider-silk-hierarchy")
    ? ["I · Micelles", "II · Duct", "III · Fibre"]
    : ["I · Left", "II · Centre", "III · Right"];

  useEffect(() => {
    if (!open) return;
    const formerOverflow = document.body.style.overflow;
    const returnFocus = trigger.current;
    document.body.style.overflow = "hidden";
    close.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && dialog.current) {
        const items = Array.from(dialog.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ));
        if (items.length > 0) {
          if (e.shiftKey && document.activeElement === items[0]) {
            e.preventDefault();
            items[items.length - 1].focus();
          } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
            e.preventDefault();
            items[0].focus();
          }
        }
      }
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(300, z + 25));
      if (e.key === "-") setZoom((z) => Math.max(75, z - 25));
      if (["1", "2", "3"].includes(e.key)) {
        setRegion(Number(e.key) - 1);
        setZoom((z) => Math.max(200, z));
        setJump((n) => n + 1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = formerOverflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open || region === null || zoom < 200) return;
    const frame = requestAnimationFrame(() => {
      const el = stage.current;
      if (!el) return;
      const maxX = Math.max(0, el.scrollWidth - el.clientWidth);
      const left = Math.max(0, Math.min(maxX, el.scrollWidth * STOPS[region] - el.clientWidth / 2));
      el.scrollTo({ left, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, region, zoom, jump]);

  const changeZoom = (next: number) => {
    setZoom(Math.max(75, Math.min(300, next)));
    if (next < 200) setRegion(null);
  };
  const jumpTo = (index: number) => {
    setRegion(index);
    setZoom((z) => Math.max(200, z));
    setJump((n) => n + 1);
  };
  const control = "min-h-11 cursor-pointer rounded-sm border border-[#c6d6d9] bg-white px-3 text-xs font-semibold text-[#181c21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80d6de] disabled:opacity-40";

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => { setZoom(100); setRegion(null); setCaption(true); setOpen(true); }}
        className="my-2 min-h-11 cursor-pointer rounded-sm border border-[var(--sr-accent)] bg-[var(--sr-surface)] px-3 text-xs font-semibold text-[var(--sr-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sr-accent)]"
        aria-haspopup="dialog"
        data-testid="figure-inspect-trigger"
      >
        ⤢ &nbsp; Expand &amp; inspect
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[1000] bg-[#0d181e] text-white">
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={(figureNumber || "Scientific figure") + " inspector"}
            className="flex h-[100dvh] min-h-0 w-full flex-col"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#36525e] px-3 py-2.5 sm:px-7">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#91cecd]">
                  {figureNumber || "Scientific figure"} · Inspection mode
                </div>
                <p className="mt-1 truncate text-xs font-semibold">{media.alt}</p>
              </div>
              <button
                ref={close} type="button" onClick={() => setOpen(false)}
                aria-label="Close figure inspector"
                className="min-h-11 shrink-0 cursor-pointer rounded-sm bg-[#d9efef] px-3 text-xs font-semibold text-[#181c21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80d6de]"
              >
                ✕ Close
              </button>
            </header>

            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#36525e] px-3 py-2 sm:px-7">
              <button type="button" className={control} onClick={() => changeZoom(zoom - 25)} disabled={zoom <= 75} aria-label="Zoom out">−</button>
              <input
                type="range" min={75} max={300} step={25} value={zoom}
                aria-label="Figure zoom"
                onChange={(e) => changeZoom(Number(e.target.value))}
                className="w-20 accent-[#15747b]"
              />
              <span className="min-w-10 text-xs font-semibold tabular-nums" aria-live="polite">{zoom}%</span>
              <button type="button" className={control} onClick={() => changeZoom(zoom + 25)} disabled={zoom >= 300} aria-label="Zoom in">+</button>
              <button type="button" className={control} onClick={() => changeZoom(100)}>Reset</button>
              <button type="button" className={control} onClick={() => setCaption((v) => !v)} aria-pressed={caption}>Caption</button>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[#36525e] bg-[#152b33] px-3 py-2 sm:px-7" role="group" aria-label="Jump to figure region">
              <span className="mr-1 text-xs font-semibold">Jump to</span>
              {labels.map((label, index) => (
                <button
                  type="button" key={label} onClick={() => jumpTo(index)} aria-pressed={region === index}
                  className={"min-h-11 cursor-pointer rounded-sm border px-2.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80d6de] " +
                    (region === index ? "border-[#80d6de] bg-[#d9efef] text-[#181c21]" : "border-[#4f6871] bg-[#2a414b] text-white")}
                >
                  {label}
                </button>
              ))}
            </div>

            <div
              ref={stage} aria-label="Zoomable scientific figure"
              className="min-h-0 flex-1 overflow-auto overscroll-contain p-3"
              style={{ cursor: dragging ? "grabbing" : zoom > 100 ? "grab" : "default" }}
              onPointerDown={(e) => {
                if (e.pointerType !== "mouse" || e.button !== 0 || zoom <= 100) return;
                setRegion(null);
                drag.current = {
                  x: e.clientX, y: e.clientY,
                  left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
              }}
              onPointerMove={(e) => {
                const from = drag.current;
                if (!from) return;
                e.currentTarget.scrollLeft = from.left - (e.clientX - from.x);
                e.currentTarget.scrollTop = from.top - (e.clientY - from.y);
              }}
              onPointerUp={() => { drag.current = null; setDragging(false); }}
              onPointerCancel={() => { drag.current = null; setDragging(false); }}
            >
              <div className="mx-auto" style={{ width: String(zoom) + "%", minWidth: zoom > 100 ? 720 : undefined }}>
                <Image
                  src={media.src} alt={media.alt}
                  width={media.width || 1200} height={media.height || 750}
                  sizes="100vw" draggable={false}
                  className="block h-auto w-full max-w-none select-none rounded-sm border border-[#3c5966]"
                />
              </div>
            </div>

            {caption && (
              <div className="max-h-[27dvh] shrink-0 overflow-y-auto border-t border-[#36525e] bg-[#142b33] px-3 py-3 text-xs leading-relaxed sm:px-7">
                <strong className="text-[#91cecd]">{figureNumber || "Figure"}</strong>
                {" · "}{media.caption}{" · "}
                <span className="text-[#b7cdd1]">
                  Credit: {media.credit}{media.license ? " · License: " + media.license : ""}
                </span>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
