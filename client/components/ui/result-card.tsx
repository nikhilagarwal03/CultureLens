"use client";

import { motion } from "framer-motion";

type Props = {
  label: string;
  content: string;
  onCopy?: () => void;
  delay?: number;
};

export function ResultCard({ label, content, onCopy, delay = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="rounded-2xl bg-panel p-4 ring-1 ring-black/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">{label}</p>
          <p className="mt-1 text-sm leading-7 sm:text-base">{content || "—"}</p>
        </div>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="btn-secondary shrink-0 px-3 py-1 text-xs font-medium"
          >
            Copy
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}
