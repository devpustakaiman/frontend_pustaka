"use client";

import { useState, useEffect } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedTime: string;
  naturalTime: string;
  progressPercent: number;
}

/**
 * Natural Indonesian text helper function:
 * - If time remaining >= 1 day: X hari Y jam Z menit
 * - If time remaining < 1 day: Y jam Z menit S detik
 * - If time remaining < 1 hour: Z menit S detik
 */
export function formatNaturalIndonesianCountdown(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  isExpired: boolean
): string {
  if (isExpired) return "Promo Berakhir";

  if (days >= 1) {
    return `${days} hari ${hours} jam ${minutes} menit`;
  }
  if (hours >= 1) {
    return `${hours} jam ${minutes} menit ${seconds} detik`;
  }
  return `${minutes} menit ${seconds} detik`;
}

export function useCountdown(targetDate?: string | null): CountdownState {
  const calculate = (): CountdownState => {
    const now = new Date();
    let endDate: Date;

    if (!targetDate) {
      // Fallback default: 2 days from now, locked to 23:59:59 local time
      endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date(targetDate);
      if (isNaN(endDate.getTime())) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          formattedTime: "00:00:00",
          naturalTime: "Promo Berakhir",
          progressPercent: 0,
        };
      }
      // Force Local End of Day: lock to 23:59:59.999 local time
      endDate.setHours(23, 59, 59, 999);
    }

    const difference = endDate.getTime() - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formattedTime: "00:00:00",
        naturalTime: "Promo Berakhir",
        progressPercent: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedTime =
      days > 0
        ? `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m`
        : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    const naturalTime = formatNaturalIndonesianCountdown(
      days,
      hours,
      minutes,
      seconds,
      false
    );

    // Active promo progress calculation (remaining time against promo cycle, clamped 8% - 95%)
    const promoCycleMs = 7 * 24 * 60 * 60 * 1000;
    const totalMs = Math.max(difference, promoCycleMs);
    const progressPercent = Math.min(95, Math.max(8, Math.round((difference / totalMs) * 100)));

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      formattedTime,
      naturalTime,
      progressPercent,
    };
  };

  const [countdown, setCountdown] = useState<CountdownState>(calculate);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculate());
    }, 1000); // 1-second tick - NO MILLISECONDS FLICKER

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
