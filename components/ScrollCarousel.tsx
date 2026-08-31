"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollCarouselProps {
  children: React.ReactNode;
  /** Gap between cards in pixels — used to calculate scroll amount */
  cardGap?: number;
  /** Variant — changes arrow button styling for dark backgrounds */
  variant?: "light" | "dark";
  /** Extra classes for the scrollable track */
  trackClassName?: string;
}

/**
 * A horizontally scrollable carousel with modern prev/next arrow controls.
 * Arrows auto-hide when the track is at the start or end.
 * The arrows are rendered in-flow inside the section header area.
 */
export function useScrollCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Use rAF so sync runs after the browser finishes layout/paint
    const raf = requestAnimationFrame(() => sync());
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by ~80% of visible width
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return { scrollRef, canLeft, canRight, scroll };
}

interface ArrowButtonsProps {
  canLeft: boolean;
  canRight: boolean;
  onLeft: () => void;
  onRight: () => void;
  variant?: "light" | "dark";
}

export function CarouselArrowButtons({
  canLeft,
  canRight,
  onLeft,
  onRight,
  variant = "light",
}: ArrowButtonsProps) {
  const base =
    "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const light = {
    active: `bg-white border border-[#E7E1D8] text-[#272522] shadow-sm hover:bg-[#B67A2D] hover:border-[#B67A2D] hover:text-white hover:shadow-md focus:ring-[#B67A2D]`,
    inactive: `bg-white/30 border border-[#E7E1D8]/40 text-[#272522]/20 cursor-not-allowed`,
  };

  const dark = {
    active: `bg-white/10 border border-white/20 text-white hover:bg-amber-400 hover:border-amber-400 hover:text-[#1A2B3C] hover:shadow-md focus:ring-amber-400`,
    inactive: `bg-white/5 border border-white/10 text-white/15 cursor-not-allowed`,
  };

  const styles = variant === "dark" ? dark : light;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLeft}
        disabled={!canLeft}
        aria-label="Sebelumnya"
        className={`${base} ${canLeft ? styles.active : styles.inactive}`}
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>
      <button
        onClick={onRight}
        disabled={!canRight}
        aria-label="Berikutnya"
        className={`${base} ${canRight ? styles.active : styles.inactive}`}
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
