import Link from "next/link";
import { Book, formatBookPrice, isActivePromo, getPromoDaysRemaining } from "@/lib/utils";

export type { Book };

interface BookCardProps {
  book?: Book;
}

const DEFAULT_BOOK: Book = {
  id: "1",
  title: "Filsafat Literasi Islam",
  author: "Prof. Dr. M. Quraish Shihab",
  category: "Literasi Utama",
  coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  price: 95000,
};

export default function BookCard({ book = DEFAULT_BOOK }: BookCardProps) {
  const currentBook = book || DEFAULT_BOOK;
  const coverImage = currentBook.coverUrl || currentBook.cover_url || DEFAULT_BOOK.coverUrl;

  const hasActivePromo = isActivePromo(currentBook);
  const formattedOriginalPrice = formatBookPrice(currentBook.price);
  const formattedPromoPrice = formatBookPrice(currentBook.promo_price);
  const isFallbackPrice = formattedOriginalPrice === "Lihat Harga di Mizanstore";
  const daysRemaining = getPromoDaysRemaining(currentBook.promo_end_date);

  // Calculate discount percentage badge value if not provided directly
  let discountPct = currentBook.promo_percentage;
  if (!discountPct && hasActivePromo && typeof currentBook.price === "number" && typeof currentBook.promo_price === "number" && currentBook.price > 0) {
    discountPct = Math.round(((currentBook.price - currentBook.promo_price) / currentBook.price) * 100);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-200 group flex flex-col h-full relative">
      {/* Cover image & top-right promo badge overlay */}
      <Link
        href={`/katalog/${currentBook.id}`}
        className="block overflow-hidden bg-gray-50 aspect-[3/4] relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={currentBook.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Cover Image Overlay Badge (-X%) */}
        {hasActivePromo && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center bg-[#E52E2D] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
              {discountPct ? `-${discountPct}%` : "PROMO"}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-3">
        <span className="text-[9px] font-bold text-[#E52E2D] uppercase tracking-wider">
          {currentBook.category || "Literasi"}
        </span>
        <h3 className="font-serif font-bold text-[13px] text-[#272522] mt-0.5 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2">
          <Link href={`/katalog/${currentBook.id}`}>{currentBook.title}</Link>
        </h3>
        <p className="text-[11px] text-[#76716A] mt-0.5 font-medium truncate">
          {currentBook.author}
        </p>

        {/* Dynamic FOMO Deadline Indicator (Only rendered if isActivePromo is true) */}
        {hasActivePromo && (
          <div className="mt-3 bg-red-50/80 border border-red-200/60 rounded-xl p-2 space-y-1">
            {/* Compact rounded progress bar */}
            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#E52E2D] via-rose-500 to-orange-500 rounded-full w-[75%]" />
            </div>
            
            <div className="flex items-center justify-between text-[11px]">
              {daysRemaining <= 1 ? (
                <span className="text-[#E52E2D] font-extrabold text-xs flex items-center gap-1 animate-pulse">
                  <span>⚡</span>
                  <span>Berakhir HARI INI!</span>
                </span>
              ) : (
                <span className="text-xs text-red-900 font-semibold flex items-center gap-1">
                  <span>⏳</span>
                  <span>Berakhir dalam {daysRemaining} hari</span>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-2 flex-1 flex items-end">
          {hasActivePromo ? (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-extrabold text-[#E52E2D] text-sm tracking-tight">
                {formattedPromoPrice}
              </span>
              <span className="line-through text-gray-400 text-[10px] font-normal">
                {formattedOriginalPrice}
              </span>
              {discountPct ? (
                <span className="bg-[#E52E2D] text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-sm -rotate-1 inline-block tracking-tight">
                  HEMAT {discountPct}%
                </span>
              ) : null}
            </div>
          ) : isFallbackPrice ? (
            <span className="text-[11px] text-[#E52E2D] font-semibold italic">
              {formattedOriginalPrice}
            </span>
          ) : (
            <span className="font-extrabold text-[#E52E2D] text-sm tracking-tight">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <Link
            href={`/katalog/${currentBook.id}`}
            className="w-full block text-center px-3 py-2 text-[11px] font-bold bg-[#E52E2D] hover:bg-[#C12A26] rounded-lg text-white transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md uppercase tracking-wider"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
