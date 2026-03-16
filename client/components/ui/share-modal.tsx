"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import { useState } from "react";

type Platform = "x" | "instagram" | "linkedin";

type Props = {
  isOpen: boolean;
  isGenerating: boolean;
  shareLink: string | null;
  onClose: () => void;
  onCopyLink: () => void;
  onShare: (platform: Platform) => void;
};

export function ShareModal({
  isOpen,
  isGenerating,
  shareLink,
  onClose,
  onCopyLink,
  onShare,
}: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Share card"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.22 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-black/10 bg-panel p-0 shadow-2xl"
          >
            {/* Icon and Close */}
            <div className="flex items-center justify-between px-7 pt-7 pb-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/10 p-2 text-accent">
                  {/* Share Icon SVG */}
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 8.5a2.5 2.5 0 1 0-2.45-3.02l-5.7 2.85a2.5 2.5 0 1 0 0 3.34l5.7 2.85a2.5 2.5 0 1 0 .9-1.79l-5.7-2.85a2.5 2.5 0 0 0 0-1.56l5.7-2.85A2.5 2.5 0 0 0 17 8.5Z"/></svg>
                </span>
                <h2 className="text-lg font-bold tracking-tight text-ink">Share this card</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-[12px] p-1.5 text-ink-soft transition hover:bg-black/10"
                aria-label="Close share dialog"
              >
                ✕
              </button>
            </div>

            <div className="px-7 pb-7 pt-2">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <LoadingSpinner size="md" />
                  <span className="text-base text-ink-soft">Preparing your share link…</span>
                </div>
              ) : shareLink ? (
                <>
                  <div className="mb-5 flex flex-col items-center">
                    <div className="flex w-full items-center gap-2 rounded-xl bg-panel/90 px-3 py-2.5 ring-1 ring-accent/30">
                      <span className="truncate text-sm font-medium text-ink-soft" style={{ maxWidth: 180 }}>{shareLink}</span>
                      <button
                        onClick={handleCopy}
                        className={`ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${copied ? "bg-accent/10 text-accent" : "bg-black/5 text-ink"}`}
                        aria-label="Copy share link"
                      >
                        {/* Check or Share SVG */}
                        {copied ? (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M20.3 6.7a1 1 0 0 0-1.4 0l-8.6 8.59-4.3-4.3a1 1 0 1 0-1.4 1.42l5 5a1 1 0 0 0 1.4 0l9.3-9.3a1 1 0 0 0 0-1.41Z"/></svg>
                        ) : (
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 8.5a2.5 2.5 0 1 0-2.45-3.02l-5.7 2.85a2.5 2.5 0 1 0 0 3.34l5.7 2.85a2.5 2.5 0 1 0 .9-1.79l-5.7-2.85a2.5 2.5 0 0 0 0-1.56l5.7-2.85A2.5 2.5 0 0 0 17 8.5Z"/></svg>
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => onShare("x")}
                      className="flex items-center gap-2 rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
                    >
                      {/* X (Twitter) SVG */}
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.53 3H21l-7.19 8.21L22 21h-6.84l-5.4-6.48L3 21H0l7.78-8.89L2 3h6.84l5.07 6.09L17.53 3Zm-1.13 15.19h1.89l-8.1-9.7H6.3l10.1 9.7ZM8.6 5.13l-1.7-2.01H5.13l2.97 3.5 1.7 2.01h1.77l-2.97-3.5Z"/></svg>
                      X
                    </button>
                    <button
                      onClick={() => onShare("instagram")}
                      className="flex items-center gap-2 rounded-[14px] bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
                    >
                      {/* Instagram SVG */}
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" fill="url(#ig)"/><defs><linearGradient id="ig" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse"><stop stop-color="#f58529"/><stop offset=".5" stop-color="#dd2a7b"/><stop offset="1" stop-color="#515bd4"/></linearGradient></defs><circle cx="12" cy="12" r="4" fill="#fff"/><circle cx="17" cy="7" r="1.2" fill="#fff"/></svg>
                      Instagram
                    </button>
                    <button
                      onClick={() => onShare("linkedin")}
                      className="flex items-center gap-2 rounded-[14px] bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
                    >
                      {/* LinkedIn SVG */}
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="4" fill="#0A66C2"/><path fill="#fff" d="M8.5 10.5h2v7h-2v-7Zm1-3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM10.5 13c0-1.1.9-2 2-2s2 .9 2 2v4.5h-2v-4.5h-2V17.5h-2V13Z"/></svg>
                      LinkedIn
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-base text-ink-soft">Something went wrong. Please try again.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
