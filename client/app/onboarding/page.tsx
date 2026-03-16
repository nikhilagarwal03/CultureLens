"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { findCountryByName } from "@/lib/client/countries";
import { useAppState } from "@/components/providers/app-provider";
import { CountrySelector } from "@/components/ui/country-selector";
import { CountryMap } from "@/components/ui/country-map";

type Draft = {
  name: string;
  selectedCountry: string;
};

const DRAFT_KEY = "culturelens.onboarding.v1";

function getStoredDraft(): Draft {
  if (typeof window === "undefined") {
    return { name: "", selectedCountry: "" };
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return { name: "", selectedCountry: "" };
    }

    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      name: parsed.name ?? "",
      selectedCountry: parsed.selectedCountry ?? "",
    };
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return { name: "", selectedCountry: "" };
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  // Added completeOnboarding from AppProvider
  const { setUserProfile, completeOnboarding } = useAppState();
  const initialDraft = getStoredDraft();

  const [name, setName] = useState(initialDraft.name);
  const [selectedCountry, setSelectedCountry] = useState(initialDraft.selectedCountry);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function submitMandatoryDetails(payload: { name: string; country: string }) {
    setUserProfile({
      name: payload.name,
      country: payload.country,
      // Defaulting to empty; Lingo.dev handles automatic detection now
      preferredLanguage: "en",
    });

    // Mark as complete in state/localStorage
    completeOnboarding();
    
    window.localStorage.removeItem(DRAFT_KEY);
    router.push("/app");
  }

  useEffect(() => {
    const payload: Draft = { name, selectedCountry };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  }, [name, selectedCountry]);

  const selectedCountryOption = useMemo(() => {
    if (!selectedCountry.trim()) return null;
    return findCountryByName(selectedCountry.trim()) ?? null;
  }, [selectedCountry]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanCountry = selectedCountry.trim();

    if (cleanName.length < 2) {
      setError("Please enter at least 2 characters for your name.");
      return;
    }

    if (!cleanCountry) {
      setError("Please choose your country from the list.");
      return;
    }

    if (!findCountryByName(cleanCountry)) {
      setError("Please select a valid country option.");
      return;
    }

    setIsSubmitting(true);

    submitMandatoryDetails({
      name: cleanName,
      country: cleanCountry,
    });
    setIsSubmitting(false);
  }

  async function onSkip() {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    
    // Using default fallback values for skipping
    submitMandatoryDetails({
      name: name.trim() || "Explorer",
      country: "United States",
    });
  }

  return (
    <div className="relative h-[calc(100vh-72px)] overflow-hidden px-4 py-3 sm:px-6 sm:py-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(105,226,255,0.11),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(114,184,255,0.11),transparent_34%)]" />

      <main className="relative mx-auto h-full w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="shell-panel flex h-full w-full flex-col rounded-[22px] p-4 sm:p-5"
        >
          <div className="mb-3 border-b border-ink-soft/15 pb-3">
            <h1 className="text-[2rem] font-semibold tracking-tight">Welcome to CultureLens</h1>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-soft/95">
              Tell us who you are and where you are from. Our AI automatically detects your language and adapts cultural analogies to hit home for you.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-12">
              <section className="min-h-0 rounded-[16px] border border-ink-soft/18 bg-surface-elevated/45 p-4 lg:col-span-5">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                      Name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nikhil"
                      className="surface-input h-10 w-full rounded-[12px] px-3.5 text-sm outline-none ring-1 placeholder:text-ink-soft/80 focus:ring-accent"
                      maxLength={60}
                    />
                  </div>

                  <div className="rounded-[12px] bg-accent/5 p-4 border border-accent/10">
                    <p className="text-xs font-medium text-accent uppercase tracking-wider">Smart Detection Active</p>
                    <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                      No need to select a language. Just type in your native tongue on the dashboard, and we'll decode it.
                    </p>
                  </div>
                </div>
              </section>

              <section className="relative z-20 min-h-0 rounded-[16px] border border-ink-soft/18 bg-surface-elevated/45 p-4 lg:col-span-7">
                <div className="grid min-h-0 gap-3 lg:grid-rows-[auto_1fr]">
                  <CountryMap
                    selectedCountry={selectedCountryOption?.name ?? ""}
                    className="rounded-[12px]"
                    svgHeightClassName="h-[132px] sm:h-[150px] lg:h-[136px] xl:h-[150px]"
                  />

                  <div className="min-h-0">
                    <label htmlFor="country" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                      Country
                    </label>
                    <CountrySelector
                      id="country"
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      showListByDefault={false}
                      dropdownMode="overlay"
                      listMaxHeightClass="max-h-24 xl:max-h-28"
                      listClassName="mt-2 rounded-[12px] p-1.5"
                    />
                  </div>
                </div>
              </section>
            </div>

            {error ? (
              <p className="status-error mt-2 rounded-[10px] px-3 py-2 text-sm">{error}</p>
            ) : null}

            <div className="relative z-10 mt-3 shrink-0 border-t border-ink-soft/15 pt-3">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-ink-soft/90">
                  You can change your name or country anytime from your profile.
                </p>

                <div className="grid w-full gap-2 sm:w-auto sm:min-w-[320px] sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void onSkip()}
                    disabled={isSubmitting}
                    className="btn-ghost h-10 w-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Skip for now
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn-primary h-10 w-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Saving details..." : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}