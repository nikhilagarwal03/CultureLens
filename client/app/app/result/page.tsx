"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiClient, ApiClientError } from "@/lib/client/api";
import { clientEnv } from "@/lib/client/env";
import {
  isFavoriteExplain,
  readLastExplain,
  toggleFavoriteExplain,
  type ExplainResult,
} from "@/lib/client/explain-storage";
import { buildShareCardPngDataUrl, buildShareCardSvg } from "@/lib/client/card-generator";
import { useToast } from "@/components/ui/toast";
import { ResultCard } from "@/components/ui/result-card";
import { ShareModal } from "@/components/ui/share-modal";

type CardGenResponse = {
  shareSlug: string;
  shareUrl: string;
};

const SECTIONS: Array<{ key: keyof ExplainResult; label: string }> = [
  { key: "reference", label: "Reference" },
  { key: "originCulture", label: "Origin Culture" },
  { key: "culturalImpact", label: "Cultural Impact" },
  { key: "localAnalogy", label: "Local Analogy" },
  { key: "context", label: "Context" },
];

export default function ResultPage() {
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const data = readLastExplain();
    if (!data) return;
    setQuery(data.query);
    setResult(data.result);
    setIsFavorite(isFavoriteExplain(data.query, data.result.reference));
  }, []);

  const combinedText = useMemo(() => {
    if (!result) return "";
    return [
      `Query: ${query}`,
      `Reference: ${result.reference}`,
      `Origin Culture: ${result.originCulture}`,
      `Cultural Impact: ${result.culturalImpact}`,
      `Local Analogy: ${result.localAnalogy}`,
      `Context: ${result.context}`,
    ].join("\n\n");
  }, [query, result]);

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ message: `${label} copied!`, type: "success" });
    } catch {
      toast({ message: "Clipboard not available in this browser.", type: "error" });
    }
  }

  async function generateShareLink() {
    if (!result || shareLink) return;
    setIsGenerating(true);
    try {
      const payload = await apiClient.post<CardGenResponse>(
        "/api/cards/generate",
        {
          title: query || result.reference,
          reference: result.reference,
          culturalImpact: result.culturalImpact,
          localAnalogy: result.localAnalogy,
          language: "en",
        }
      );
      const link = `${clientEnv.appUrl}${payload.shareUrl}`;
      setShareLink(link);
      toast({ message: "Share link created!", type: "success" });
    } catch (err) {
      toast({
        message: err instanceof ApiClientError ? err.message : "Could not create share link.",
        type: "error",
      });
      setShareModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleShareClick() {
    setShareModalOpen(true);
    void generateShareLink();
  }

  function openSocialShare(kind: "x" | "instagram" | "linkedin") {
    if (!shareLink || !result) return;
    const text = encodeURIComponent(`CultureLens: ${result.reference}`);
    const url = encodeURIComponent(shareLink);
    if (kind === "x") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
    } else if (kind === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
    } else if (kind === "instagram") {
      // Instagram does not support direct web sharing, so show a message or fallback
      alert("Instagram sharing is not supported directly. Please copy the link and share manually.");
    }
  }

  async function downloadCardPng() {
    if (!result || isDownloading) return;
    setIsDownloading(true);

    try {
      const dataUrl = buildShareCardPngDataUrl({ query, result });
      const a = document.createElement("a");
      a.href = dataUrl;
      // Use the question (query) as the filename
      const safeQuery = (query || "result").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      a.download = `culturelens-${safeQuery}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast({ message: "Card downloaded as PNG!", type: "success" });
    } catch {
      toast({ message: "Could not create the download image.", type: "error" });
    } finally {
      setIsDownloading(false);
    }
  }

  async function downloadCardSvg() {
    if (!result || isDownloading) return;
    setIsDownloading(true);
    try {
      const svg = buildShareCardSvg({ query, result });
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      // Use the question (query) as the filename
      const safeQuery = (query || "result").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      a.download = `culturelens-${safeQuery}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ message: "Card downloaded as SVG!", type: "success" });
    } catch {
      toast({ message: "Could not create the SVG file.", type: "error" });
    } finally {
      setIsDownloading(false);
    }
  }

  function toggleBookmark() {
    if (!result) return;
    const next = toggleFavoriteExplain({
      query,
      createdAt: new Date().toISOString(),
      result,
    });
    setIsFavorite(next);
    toast({
      message: next ? "Saved to bookmarks." : "Removed from bookmarks.",
      type: "success",
    });
  }

  if (!result) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">No result found</h1>
        <p className="mt-3 text-ink-soft">Run a search from the dashboard first, then open this page.</p>
        <Link
          href="/app"
          className="btn-primary mt-6 px-6 py-2.5 text-sm font-semibold"
        >
          Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Result</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Decoded insight</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void copy(combinedText, "Full explanation")}
            className="btn-secondary px-4 py-2 text-sm font-medium"
          >
            Copy All
          </button>
          <button
            onClick={handleShareClick}
            disabled={isGenerating}
            className="btn-primary px-4 py-2 text-sm font-semibold disabled:opacity-70"
          >
            {shareLink ? "View Share Link" : "Create Share Link"}
          </button>
          <button
            onClick={() => void downloadCardPng()}
            disabled={isDownloading}
            className="btn-secondary px-4 py-2 text-sm font-semibold disabled:opacity-70"
          >
            {isDownloading ? "Preparing…" : "Download PNG"}
          </button>
          <button
            onClick={() => void downloadCardSvg()}
            disabled={isDownloading}
            className="btn-secondary px-4 py-2 text-sm font-semibold disabled:opacity-70"
          >
            {isDownloading ? "Preparing…" : "Download SVG"}
          </button>
          <button
            onClick={toggleBookmark}
            className="btn-secondary px-4 py-2 text-sm font-semibold"
          >
            {isFavorite ? "Bookmarked" : "Bookmark"}
          </button>
          <Link href="/app" className="btn-ghost px-4 py-2 text-sm font-medium">
            Back
          </Link>
        </div>
      </motion.header>

      <p className="mb-4 rounded-xl bg-panel px-4 py-3 text-sm text-ink-soft ring-1 ring-black/10">{query}</p>


      <section className="grid gap-3">
        {SECTIONS.map((section, index) => (
          <ResultCard
            key={section.key}
            label={section.label}
            content={String(result[section.key] || "")}
            onCopy={() => void copy(String(result[section.key] || ""), section.label)}
            delay={index * 0.06}
          />
        ))}
      </section>

      <ShareModal
        isOpen={shareModalOpen}
        isGenerating={isGenerating}
        shareLink={shareLink}
        onClose={() => setShareModalOpen(false)}
        onCopyLink={() => void copy(shareLink ?? "", "Share link")}
        onShare={openSocialShare}
      />
    </main>
  );
}
