"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";


const MESSAGES = [
  "Finding the story behind your words…",
  "Looking for local flavor…",
  "Bringing cultures together…",
  "Making sense of it all…",
  "Adding a dash of culture…",
  "Almost there!"
];

export function ExplainLoading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#050A15]/70 via-[#0D1629]/80 to-[#181F2A]/90 backdrop-blur-xl">
      {/* Animated Gradient Border */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-sm overflow-visible rounded-[36px] p-[2.5px] shadow-2xl shadow-black/50"
        style={{ background: "conic-gradient(from 90deg at 50% 50%, #2DD4BF 0%, #F472B6 25%, #FBBF24 50%, #2DD4BF 100%)" }}
      >
        {/* Glass Card */}
        <div className="relative rounded-[34px] bg-[#0D1629]/90 p-8 overflow-hidden">
          {/* Subtle Background Light Leak */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-[60px]" />

          <div className="flex flex-col items-center">
            {/* THE VISUAL: The Refractive Orb */}
            <div className="relative mb-10 h-32 w-32">
              {/* Outer Static Glass Ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 ring-2 ring-accent/20" />

              {/* Morphing Liquid Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 0.95, 1],
                  rotate: [0, 90, 180, 360],
                  borderRadius: ["40% 60% 60% 40%", "60% 40% 40% 60%", "40% 60% 60% 40%"]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 bg-gradient-to-tr from-accent/40 via-accent/10 to-transparent blur-xl"
              />

              {/* The "Lens" (Centered Icon) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl"
                >
                  <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_#2DD4BF]" />
                </motion.div>
              </div>

              {/* Multiple Orbital Particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5 + i, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{ zIndex: 2 + i }}
                >
                  <div
                    className="absolute h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent via-pink-400 to-yellow-400 shadow-lg"
                    style={{
                      top: `${6 + i * 8}px`,
                      left: `calc(50% + ${(i - 1) * 40}px)`,
                      transform: "translateX(-50%)"
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Text & Progress */}
            <div className="w-full text-center">
              <div className="h-8 mb-2 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    className="text-lg font-semibold tracking-wide text-white/90 drop-shadow"
                  >
                    {MESSAGES[msgIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Premium Progress Bar */}
              <div className="relative mt-4 h-[4px] w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ left: "-40%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-full w-1/3 rounded-full bg-gradient-to-r from-accent via-pink-400 to-yellow-400 blur-[2px] opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Branding Footer */}
          <div className="mt-8 flex items-center justify-center border-t border-white/10 pt-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
              CultureLens
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}