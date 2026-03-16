"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LocalUser = {
  name: string;
  country: string;
  preferredLanguage: string;
};

type AppStateContextValue = {
  user: LocalUser | null;
  isHydrated: boolean;
  onboardingComplete: boolean; // New: Tracks if user finished or skipped onboarding
  setUserProfile: (user: LocalUser) => void;
  updateUser: (updates: Partial<LocalUser>) => void;
  clearUserProfile: () => void;
  completeOnboarding: () => void; // New: Action to set completion flag
};

const PROFILE_STORAGE_KEY = "culturelens.profile.v1";
const ONBOARDING_KEY = "culturelens.onboarding_complete";

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    try {
      // 1. Hydrate Profile
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LocalUser;
        // Updated: Language is no longer mandatory for a "valid" initial load
        if (parsed?.name && parsed?.country) {
          setUser(parsed);
        }
      }

      // 2. Hydrate Onboarding Status
      const completed = window.localStorage.getItem(ONBOARDING_KEY);
      if (completed === "true") {
        setOnboardingComplete(true);
      }
    } catch {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setUserProfile = useCallback((nextUser: LocalUser) => {
    setUser(nextUser);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextUser));
    // When a user saves a full profile, we consider onboarding complete
    window.localStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingComplete(true);
  }, []);

  const updateUser = useCallback((updates: Partial<LocalUser>) => {
    setUser((current) => {
      const next = current ? { ...current, ...updates } : (updates as LocalUser);
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete(true);
    window.localStorage.setItem(ONBOARDING_KEY, "true");
  }, []);

  const clearUserProfile = useCallback(() => {
    setUser(null);
    setOnboardingComplete(false);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    window.localStorage.removeItem(ONBOARDING_KEY);
  }, []);

  const value = useMemo(
    () => ({ 
      user, 
      isHydrated, 
      onboardingComplete, 
      setUserProfile, 
      updateUser, 
      clearUserProfile,
      completeOnboarding 
    }),
    [user, isHydrated, onboardingComplete, setUserProfile, updateUser, clearUserProfile, completeOnboarding]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return context;
}