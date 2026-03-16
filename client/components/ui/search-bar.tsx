"use client";

import type { FormEvent, KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder,
}: Props) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd + Enter submits
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="space-y-3"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        placeholder={
          placeholder ?? "Type a reference, meme, trend, or phrase to decode…"
        }
        className="surface-input w-full rounded-2xl px-4 py-3 text-sm outline-none ring-1 placeholder:text-ink-soft focus:ring-accent"
      />
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="btn-primary px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Analyzing…" : "Explain this"}
      </button>
    </form>
  );
}
