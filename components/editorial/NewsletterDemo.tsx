"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function NewsletterDemo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setErrorMessage("Please enter a valid email address format to test the demo form.");
      return;
    }
    setErrorMessage("");
    setSubmitted(true);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="site-container my-14"
    >
      <div className="p-6 sm:p-10 rounded-sm bg-[var(--sr-surface)] border border-[var(--sr-rule)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--sr-accent)]">
            Weekly Scientific Digest · Demo Interface
          </div>
          <h2
            id="newsletter-heading"
            className="font-editorial text-xl sm:text-2xl font-bold text-[var(--sr-ink)]"
          >
            Receive long-form explainers and research digests
          </h2>
          <p className="text-sm text-[var(--sr-ink-secondary)] leading-relaxed max-w-2xl">
            Curated summaries of peer-reviewed breakthroughs in physics,
            biology, chemistry, and earth sciences.{" "}
            <span className="text-[var(--sr-muted)]">
              (Stage A UI demonstration only: entered addresses are validated
              locally in your browser and never stored or transmitted.)
            </span>
          </p>
        </div>

        <div className="lg:col-span-5">
          {submitted ? (
            <div
              role="status"
              className="p-4 bg-white border border-[var(--sr-rule)] rounded-sm space-y-1.5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sr-accent)]">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Demo Subscription Preview Confirmed</span>
              </div>
              <p className="text-xs text-[var(--sr-muted)] leading-relaxed">
                No email address was transmitted or stored. Live newsletter
                delivery is deferred until Stage D production authorization.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-xs font-medium text-[var(--sr-accent)] underline pt-1"
              >
                Reset demo form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <label htmlFor="newsletter-email-input" className="sr-only">
                  Email address for demo preview
                </label>
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  suppressHydrationWarning
                  placeholder="researcher@university.edu"
                  className="flex-1 min-w-0 bg-white border border-[var(--sr-rule)] rounded-sm px-3.5 py-2.5 text-sm text-[var(--sr-ink)] placeholder:text-[var(--sr-muted)] focus:outline-2 focus:outline-[var(--sr-accent)]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--sr-accent)] hover:bg-[var(--sr-accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Preview Subscribe
                </button>
              </div>
              {errorMessage && (
                <p role="alert" className="text-xs text-red-700 font-medium">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
