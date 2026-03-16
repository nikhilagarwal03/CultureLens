"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastFn = (opts: ToastOptions) => void;

const ToastContext = createContext<ToastFn | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
    };
  }, []);

  const toast = useCallback<ToastFn>(
    ({ message, type = "info", duration = 3000 }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  const variantClass: Record<ToastType, string> = {
    success: "bg-[color-mix(in_srgb,var(--accent-2)_25%,var(--panel))] text-foreground ring-[color-mix(in_srgb,var(--accent-2)_45%,transparent)]",
    error: "status-error ring-[color-mix(in_srgb,var(--danger-fg)_45%,transparent)]",
    info: "bg-panel text-foreground ring-black/10",
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className={`pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg ring-1 ${variantClass[t.type]}`}
            >
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-base leading-none opacity-60 transition hover:opacity-100"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
