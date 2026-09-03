import { useState, useEffect } from 'react';
import { PROMO_TARGET_DATE } from '@/lib/constants';

export function useCountdown(targetDate: string | Date = PROMO_TARGET_DATE) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: '',
    isExpired: false,
  });

  useEffect(() => {
    const calculate = () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: 'Promo Berakhir',
          isExpired: true,
        });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        formatted: `${days > 0 ? `${days} hari ` : ''}${hours} jam ${minutes} menit`,
        isExpired: false,
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}
