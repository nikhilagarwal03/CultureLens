"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/client/countries";

type Props = {
  value: string;
  onChange: (name: string) => void;
  id?: string;
  listMaxHeightClass?: string;
  listClassName?: string;
  showListByDefault?: boolean;
  dropdownMode?: "inline" | "overlay";
};

export function CountrySelector({
  value,
  onChange,
  id,
  listMaxHeightClass = "max-h-56",
  listClassName,
  showListByDefault = true,
  dropdownMode = "inline",
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  function normalize(valueToNormalize: string) {
    return valueToNormalize.toLowerCase().trim();
  }

  const filtered = useMemo(() => {
    const q = normalize(value);
    if (!q) return COUNTRIES.slice(0, 12);

    const exactName = COUNTRIES.filter((c) => normalize(c.name) === q);
    const startsWithName = COUNTRIES.filter((c) => normalize(c.name).startsWith(q) && normalize(c.name) !== q);
    const includesName = COUNTRIES.filter(
      (c) => normalize(c.name).includes(q) && !normalize(c.name).startsWith(q)
    );
    const startsWithCode = COUNTRIES.filter((c) => normalize(c.code).startsWith(q));

    const combined = [...exactName, ...startsWithName, ...includesName, ...startsWithCode];

    const deduped = combined.filter(
      (country, index) => combined.findIndex((item) => item.code === country.code) === index
    );

    if (deduped.length > 0) return deduped.slice(0, 12);

    return COUNTRIES.filter((c) => normalize(c.region).includes(q)).slice(0, 8);
  }, [value]);

  const hasExactMatch = useMemo(() => {
    const q = normalize(value);
    if (!q) return false;
    return COUNTRIES.some((country) => normalize(country.name) === q);
  }, [value]);

  const shouldShowList = showListByDefault || isFocused || (value.trim().length > 0 && !hasExactMatch);

  function select(name: string) {
    onChange(name);
    setIsFocused(false);
  }

  return (
    <div
      className="relative"
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(next)) {
          setIsFocused(false);
        }
      }}
    >
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your country…"
        autoComplete="off"
        className="surface-input w-full rounded-xl px-4 py-3 text-sm outline-none ring-1 placeholder:text-ink-soft focus:ring-accent"
      />
      {shouldShowList && filtered.length > 0 ? (
        <div
          className={`surface-input grid ${listMaxHeightClass} gap-1.5 overflow-auto rounded-xl border p-2 ${
            dropdownMode === "overlay"
              ? "absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 mt-0 shadow-[0_18px_44px_rgba(0,0,0,0.42)]"
              : "mt-3"
          } ${listClassName ?? ""}`}
        >
          {filtered.map((country) => {
            const isSelected = normalize(value) === normalize(country.name);
            return (
              <button
                type="button"
                key={country.code}
                onClick={() => select(country.name)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-accent text-[#03121d]"
                    : "surface-chip ring-1 hover:opacity-90"
                }`}
              >
                <span>{country.name}</span>
                <span
                  className={`text-xs ${isSelected ? "text-[#03121d]/75" : "text-ink-soft"}`}
                >
                  {country.region}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
      {value.trim().length > 0 && filtered.length === 0 ? (
        <p className="mt-2 px-1 text-xs text-ink-soft">No matching country found.</p>
      ) : null}
    </div>
  );
}
