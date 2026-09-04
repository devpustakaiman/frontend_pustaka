import { useState, useEffect } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isExpired: boolean;
  progressPercent: number;
  hasMounted: boolean;
  isMounted: boolean;
}

export function useCountdown(targetDate?: string | Date | null): CountdownState {
  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: '',
    isExpired: false,
    progressPercent: 0,
  });

  useEffect(() => {
    setHasMounted(true);

    const calculate = () => {
      let target: Date;
      if (!targetDate) {
        target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      } else {
        target = new Date(targetDate);
        if (isNaN(target.getTime())) {
          target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
        }
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
        progressPercent,
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return {
    ...timeLeft,
    hasMounted,
    isMounted: hasMounted,
  };
}

