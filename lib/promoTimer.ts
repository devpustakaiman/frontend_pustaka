"use client";

import { useState, useEffect } from "react";

export interface PromoTimerResult {
  formattedText: string;
  progressPercent: number; // 0 to 100
  isExpired: boolean;
}

export function getPromoTimeDetails(startDateStr?: string | null, endDateStr?: string | null): PromoTimerResult {
  if (!endDateStr) {
    return { formattedText: "Stok Terbatas", progressPercent: 50, isExpired: false };
  }

  const now = Date.now();
  const endObj = new Date(endDateStr);
  if (isNaN(endObj.getTime())) {
    return { formattedText: "Promo Berakhir", progressPercent: 0, isExpired: true };
  }

  // Detect if the timestamp is midnight UTC (e.g. "2026-09-05T00:00:00Z" or "2026-09-05 00:00:00+00:00")
  // Supabase stores date-only promo_end_date values as midnight UTC.
  // For Indonesian users (UTC+7), midnight UTC is 07:00 WIB — far too early.
  // We reinterpret it as end-of-day WIB: 23:59:59 WIB = 16:59:59 UTC.
  const isMidnightUTC =
    endObj.getUTCHours() === 0 &&
    endObj.getUTCMinutes() === 0 &&
    endObj.getUTCSeconds() === 0;

  if (isMidnightUTC) {
    // Shift to 16:59:59 UTC = 23:59:59 WIB (UTC+7)
    endObj.setUTCHours(16, 59, 59, 999);
  } else if (!endDateStr.includes("T") && !endDateStr.includes(":")) {
    // Plain date string with no time component: lock to local end of day
    endObj.setHours(23, 59, 59, 999);
  }

  const end = endObj.getTime();
  const start = startDateStr ? new Date(startDateStr).getTime() : end - (7 * 24 * 60 * 60 * 1000); // fallback: 7 days total promo

  const remainingMs = end - now;
  if (remainingMs <= 0) {
    return { formattedText: "Promo Berakhir", progressPercent: 0, isExpired: true };
  }

  // 1. Dynamic Progress Percentage (Remaining / Total)
  const totalDuration = Math.max(end - start, 1);
  const rawPercent = (remainingMs / totalDuration) * 100;
  const progressPercent = Math.min(Math.max(Math.round(rawPercent), 8), 92); // visually clamp between 8% and 92% so it never looks empty or 100% full

  // 2. Natural Indonesian Time Formatting
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let formattedText = "";
  if (days >= 1) {
    formattedText = `${days} hari ${hours} jam ${minutes} menit`;
  } else if (hours >= 1) {
    formattedText = `${hours} jam ${minutes} menit`;
  } else {
    const seconds = totalSeconds % 60;
    formattedText = `${minutes} menit ${seconds} detik`;
  }

  return { formattedText, progressPercent, isExpired: false };
}

/**
 * React hook to reactively subscribe to getPromoTimeDetails with 1-second interval
 */
export function usePromoTimer(startDateStr?: string | null, endDateStr?: string | null): PromoTimerResult {
  const [result, setResult] = useState<PromoTimerResult>(() => getPromoTimeDetails(startDateStr, endDateStr));

  useEffect(() => {
    setResult(getPromoTimeDetails(startDateStr, endDateStr));
    const interval = setInterval(() => {
      setResult(getPromoTimeDetails(startDateStr, endDateStr));
    }, 1000);

    return () => clearInterval(interval);
  }, [startDateStr, endDateStr]);

  return result;
}
