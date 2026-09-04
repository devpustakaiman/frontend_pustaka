"use client";

import { Clock } from "lucide-react";

export interface PromoStockBarProps {
  timeLeft?: string;
  stockLabel?: string;
  progressPercent?: number;
  className?: string;
  theme?: "light" | "dark";
}

export default function PromoStockBar({
  timeLeft = "Promo Berakhir",
  stockLabel = "Stok Terbatas",
  progressPercent = 75,
  className = "",
  theme = "light",
}: PromoStockBarProps) {
  const isDark = theme === "dark";

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {/* Top row: Left = Clock + timeLeft | Right = Stock Label / Remaining Count */}
      <div className="flex items-center justify-between text-[11px] font-semibold gap-2">
        <span
          className={`flex items-center gap-1.5 truncate ${
            isDark ? "text-amber-300 font-bold" : "text-[#E53935] font-bold"
          }`}
          suppressHydrationWarning
        >
          <Clock size={12} className={isDark ? "text-amber-300 shrink-0" : "text-[#E53935] shrink-0"} />
          <span className="truncate">{timeLeft}</span>
        </span>
        <span
          className={`text-[10px] font-bold tracking-wider shrink-0 uppercase ${
            isDark ? "text-red-100" : "text-[#E53935]"
          }`}
        >
          {stockLabel}
        </span>
      </div>

      {/* Bottom row: Unified rounded track bar */}
      <div className={`h-1.5 w-full overflow-hidden rounded-full ${isDark ? "bg-white/20" : "bg-red-100"}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isDark ? "bg-amber-400" : "bg-red-500"
          }`}
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
