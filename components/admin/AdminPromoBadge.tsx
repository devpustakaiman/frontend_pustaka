"use client";

import { Book, formatDate, formatPromoEndDateToIso } from "@/lib/utils";

export { formatPromoEndDateToIso, formatDate };

interface AdminPromoProps {
  book: Book;
}

/**
 * Cleaned up promo date range display for Admin Cards:
 * Avoids glitched 'Starts: Ends:' labels by only rendering 'Mulai:' if promo_start_date is defined.
 */
export function AdminPromoDateLabel({ book }: AdminPromoProps) {
  if (!book.is_promo) return null;

  const startDate = book.promo_start_date || book.promo_start_at;

  return (
    <div className="text-xs text-red-600 font-medium">
      {startDate && (
        <span>Mulai: {formatDate(startDate)} • </span>
      )}
      {book.promo_end_date && <span>Berakhir: {formatDate(book.promo_end_date)}</span>}
    </div>
  );
}

/**
 * Status badge for Admin Book Cards:
 * - If new Date(book.promo_end_date).getTime() < Date.now(): Shows 'Promo Berakhir' (bg-gray-100 text-gray-500)
 * - If new Date(book.promo_end_date).getTime() >= Date.now(): Shows 'Promo Aktif ({percentage}% • s.d {formatDate})' (bg-red-50 text-red-600 border border-red-200)
 */
export function AdminPromoBadge({ book }: AdminPromoProps) {
  if (!book.is_promo || !book.promo_end_date) return null;

  const endTime = new Date(book.promo_end_date).getTime();
  const isExpired = isNaN(endTime) || endTime < Date.now();

  if (isExpired) {
    return (
      <span className="bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
        Promo Berakhir
      </span>
    );
  }

  let percentage = book.promo_percentage;
  if (
    !percentage &&
    typeof book.price === "number" &&
    typeof book.promo_price === "number" &&
    book.price > 0
  ) {
    percentage = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <span className="bg-red-50 text-red-600 border border-red-200 font-bold px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1">
      Promo Aktif ({percentage ? `${percentage}%` : "Diskon"} • s.d {formatDate(book.promo_end_date)})
    </span>
  );
}

export default AdminPromoBadge;
