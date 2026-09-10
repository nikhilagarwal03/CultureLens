'use client';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch("/api/visitor-count", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setCount(0);
          return;
        }

        const data = await response.json();
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // Visitor analytics should never affect page rendering.
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  if (isLoading || count === null) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Eye className="size-4" />
        <span className="opacity-50">Loading...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-muted-foreground flex items-center gap-2"
      title="You are a unique visitor!"
    >
      <Eye className="size-4" />
      <span>
        You are the{' '}
        <motion.span
          key={count}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-foreground tabular-nums"
          suppressHydrationWarning
        >
          {count.toLocaleString()}
          <sup className="text-xs">{getOrdinalSuffix(count)}</sup>
        </motion.span>
        {' '}visitor
      </span>
    </motion.div>
  );
}