"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/client/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type SharedCard = {
  title: string;
  reference: string;
  culturalImpact: string;
  localAnalogy: string;
  language: string;
  createdAt: string;
};

export default function SharedCardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [card, setCard] = useState<SharedCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let active = true;
    (async () => {
      try {
        const data = await apiClient.get<SharedCard>(`/api/cards/get?slug=${encodeURIComponent(slug)}`);
        if (active) setCard(data);
      } catch {
        if (active) setCard(null);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <LoadingSpinner size="lg" />
      </main>
    );
  }

  if (!card) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Card not found</h1>
        <p className="mt-3 text-ink-soft">This shared card may have expired or the link is invalid.</p>
        <Link href="/" className="btn-primary mt-6 px-6 py-2.5 text-sm font-semibold">
          Go Home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <section className="shell-panel rounded-[24px] p-6">
        <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Shared CultureLens Card</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{card.title}</h1>

        <div className="mt-6 grid gap-3">
          <article className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
            <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Reference</p>
            <p className="mt-1 text-base leading-7">{card.reference}</p>
          </article>
          <article className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
            <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Cultural Impact</p>
            <p className="mt-1 text-base leading-7">{card.culturalImpact}</p>
          </article>
          <article className="rounded-2xl bg-white p-4 ring-1 ring-black/10">
            <p className="text-xs tracking-[0.12em] text-ink-soft uppercase">Local Analogy</p>
            <p className="mt-1 text-base leading-7">{card.localAnalogy}</p>
          </article>
        </div>

        <p className="mt-5 text-xs text-ink-soft">Language: {card.language}</p>
      </section>
    </main>
  );
}
