"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useId, useState } from "react";
import { SearchIcon } from "./icons";

function normalize(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "").replace(/[–—_]/g, "-");
}

/**
 * "Check your lot" box. Knows every lot code at build time, so an unknown code
 * gets an immediate, honest answer instead of a dead end.
 */
export function LotCheckForm({
  codes,
  size = "lg",
  initial = "",
}: {
  codes: string[];
  size?: "lg" | "md";
  initial?: string;
}) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(initial);
  const [notFound, setNotFound] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = normalize(value);
    if (!code) return;
    if (codes.includes(code)) {
      router.push(`/lot/${code}`);
    } else {
      setNotFound(code);
    }
  }

  const big = size === "lg";
  return (
    <div>
      <form onSubmit={submit} role="search" aria-label="Check a lot code">
        <label htmlFor={id} className={`block font-semibold ${big ? "mb-2 text-base" : "mb-1.5 text-sm"}`}>
          Check your lot
        </label>
        <div className="flex gap-2">
          <input
            id={id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setNotFound(null);
            }}
            placeholder="e.g. RET-2026-001"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            aria-describedby={`${id}-help`}
            className={`lot-code min-w-0 flex-1 rounded-lg border border-line bg-card px-4 uppercase placeholder:normal-case placeholder:text-muted/80 focus:border-accent ${
              big ? "py-3.5 text-lg" : "py-2.5 text-base"
            }`}
          />
          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-lg bg-accent font-semibold text-white hover:bg-accent-dark ${
              big ? "px-5 text-lg" : "px-4"
            }`}
          >
            <SearchIcon />
            <span>Check</span>
          </button>
        </div>
        <p id={`${id}-help`} className="mt-2 text-sm text-muted">
          The lot code is printed on the vial label, next to the QR code.
        </p>
      </form>
      <div aria-live="polite">
        {notFound && (
          <div className="mt-4 rounded-xl border border-fail/30 bg-fail-soft p-4 text-sm text-ink">
            <p className="font-semibold text-fail">
              We have no lot with the code <span className="lot-code">{notFound}</span>.
            </p>
            <p className="mt-1">
              Check the label for a typo (the format is three letters, the year, and a number, like RET-2026-001). Every
              lot we have ever received is listed on{" "}
              <Link href="/record" className="text-accent underline">
                The Record
              </Link>
              . If the code on your vial is not there, that vial may not be ours.{" "}
              <Link href="/contact" className="text-accent underline">
                Please tell us
              </Link>
              . We want to know.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
