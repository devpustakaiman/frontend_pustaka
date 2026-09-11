import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Book, formatBookPrice, getPromoDaysRemaining, getEffectiveBookPrice, formatIndonesianDate } from "@/lib/utils";
import PromoStockBar from "@/components/PromoStockBar";
import { generateSlug } from "@/lib/slugify";

export type { Book };

interface BookCardProps {
  book?: Book;
  priority?: boolean;
  hidePrice?: boolean;
}

const BookCard = memo(function BookCard({ book, priority = false, hidePrice = false }: BookCardProps) {
  if (!book) return null;
  const currentBook = book;
  const coverImage = currentBook.coverUrl || currentBook.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  const isUpcoming = hidePrice || currentBook.is_upcoming === true;

  const priceInfo = getEffectiveBookPrice(currentBook);
  const hasActivePromo = !isUpcoming && priceInfo.isPromo;
  const formattedOriginalPrice = priceInfo.originalPrice;
  const formattedPromoPrice = priceInfo.promoPrice;
  const daysRemaining = getPromoDaysRemaining(currentBook.promo_end_date);
  const discountPct = priceInfo.discountPercentage;

  const target = currentBook.slug || generateSlug(currentBook.title) || currentBook.id;
  const targetUrl = target ? `/katalog/${target}` : "/katalog";

  const timeLeftText = !currentBook.promo_end_date || daysRemaining >= 900
    ? "Promo Berkelanjutan"
    : daysRemaining <= 1
    ? "Berakhir HARI INI!"
    : `Berakhir ${daysRemaining} hari`;

  const releaseDateText = currentBook.release_date
    ? formatIndonesianDate(currentBook.release_date)
    : currentBook.estimated_release_date || "Segera Terbit";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-200 group flex flex-col justify-between h-full self-stretch relative">
      {/* Cover image & top-right badge overlay */}
      <Link
        href={targetUrl}
        prefetch={false}
        className="relative w-full aspect-[3/4] rounded-t-xl sm:rounded-t-2xl bg-gray-50/70 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 block"
      >
        <Image
          src={coverImage}
          alt={currentBook.title || "Cover Buku"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-contain p-1 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        />

        {/* Cover Image Overlay Badge */}
        {isUpcoming ? (
          <span className="absolute top-2.5 right-2.5 z-10 bg-[#E52E2D] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            SEGERA TERBIT
          </span>
        ) : (
          hasActivePromo && (
            <span className="absolute top-2.5 right-2.5 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              {discountPct ? `-${discountPct}%` : "PROMO"}
            </span>
          )
        )}
      </Link>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4 justify-between">
        <div className="flex flex-col gap-1">
          {/* Category: Strict 1-line truncation */}
          <span className="text-[10px] sm:text-xs font-bold text-[#E52E2D] uppercase tracking-wider truncate block">
            {currentBook.category || "Literasi"}
          </span>

          {/* Book Title: Locked 2-line height reservation */}
          <h4
            className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2 h-9 sm:h-10 overflow-hidden"
            title={currentBook.title}
          >
            <Link href={targetUrl} prefetch={false}>{currentBook.title}</Link>
          </h4>

          {/* Author Name: Strict 1-line truncation */}
          <p className="text-xs text-gray-500 truncate block mt-1">
            {currentBook.author}
          </p>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col justify-between">
          
          {/* Standardized Price or Release Date Area */}
          {isUpcoming ? (
            <div className="flex flex-col min-h-[44px] justify-center mt-1.5">
              <span className="text-xs text-gray-500 font-medium">Estimasi Rilis:</span>
              <span className="text-sm sm:text-base font-bold text-[#E52E2D] tracking-tight truncate">
                {releaseDateText}
              </span>
            </div>
          ) : (
            <div className="flex flex-col min-h-[44px] justify-center mt-1.5">
              {/* Main Active / Discounted Price */}
              <span className={`text-base font-bold tracking-tight ${hasActivePromo ? 'text-red-600' : 'text-gray-900'}`}>
                {hasActivePromo ? formattedPromoPrice : (currentBook.price ? formatBookPrice(currentBook.price) : formattedOriginalPrice)}
              </span>

              {/* Original Strikethrough Price */}
              {hasActivePromo ? (
                <span className="text-xs text-gray-400 line-through">
                  {formattedOriginalPrice}
                </span>
              ) : (
                <span className="text-xs text-transparent select-none">&#160;</span>
              )}
            </div>
          )}

          <div className="min-h-[38px] sm:min-h-[42px] flex items-center my-1.5 w-full">
            {isUpcoming ? (
              <div className="w-full inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-[#E52E2D] rounded-xl text-xs font-bold border border-red-100">
                <Calendar size={13} className="shrink-0" />
                <span className="truncate">Bisa Pre-Order</span>
              </div>
            ) : hasActivePromo ? (
              <PromoStockBar
                timeLeft={timeLeftText}
                stockLabel={daysRemaining <= 1 && daysRemaining < 900 ? "HARI INI!" : "Stok Terbatas"}
                progressPercent={daysRemaining <= 1 && daysRemaining < 900 ? 95 : 70}
                theme="light"
              />
            ) : (
              <div className="w-full h-full invisible select-none pointer-events-none" />
            )}
          </div>

          <Link
            href={targetUrl}
            prefetch={false}
            className="w-full block text-center px-2.5 py-2 text-xs font-bold bg-[#E53935] hover:bg-[#C12A26] rounded-xl text-white transition-all duration-200 active:scale-95 uppercase tracking-wider shadow-xs"
          >
            LIHAT DETAIL
          </Link>
        </div>
      </div>
    </div>
  );
});

export default BookCard;

