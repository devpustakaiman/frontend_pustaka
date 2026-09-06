import { useState, useEffect } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isExpired: boolean;
  isForever: boolean;
  progressPercent: number;
  hasMounted: boolean;
  isMounted: boolean;
}

export function useCountdown(targetDate?: string | Date | null): CountdownState {
  const [hasMounted, setHasMounted] = useState(false);
  const isForever = !targetDate || String(targetDate).trim() === "" || targetDate === "forever";

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: isForever ? 'Promo Berkelanjutan' : '',
    isExpired: false,
    isForever,
    progressPercent: 100,
  });

  useEffect(() => {
    setHasMounted(true);

    if (isForever) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        formatted: 'Promo Berkelanjutan',
        isExpired: false,
        isForever: true,
        progressPercent: 100,
      });
      return;
    }

    const calculate = () => {
      const target = new Date(targetDate!);
      if (isNaN(target.getTime())) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: 'Promo Berkelanjutan',
          isExpired: false,
          isForever: true,
          progressPercent: 100,
        });
        return;
      }
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: 'Promo Berakhir',
          isExpired: true,
          isForever: false,
          progressPercent: 0,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Active promo progress calculation (clamped 8% - 95%)
      const promoCycleMs = 7 * 24 * 60 * 60 * 1000;
      const totalMs = Math.max(diff, promoCycleMs);
      const progressPercent = Math.min(95, Math.max(8, Math.round((diff / totalMs) * 100)));

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        formatted: `${days > 0 ? `${days} hari ` : ''}${hours} jam ${minutes} menit`,
        isExpired: false,
        isForever: false,
        progressPercent,
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate, isForever]);

  return {
    ...timeLeft,
    hasMounted,
    isMounted: hasMounted,
  };
}

