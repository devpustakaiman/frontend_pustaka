"use client";

import { useState, useEffect } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedTime: string;
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

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      formattedTime,
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

