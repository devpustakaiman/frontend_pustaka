import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Book, formatBookPrice, isActivePromo, getPromoDaysRemaining } from "@/lib/utils";
import PromoStockBar from "@/components/PromoStockBar";

export type { Book };

interface BookCardProps {
  book?: Book;
  priority?: boolean;
}

const DEFAULT_BOOK: Book = {
  id: "1",
  title: "Filsafat Literasi Islam",
  author: "Prof. Dr. M. Quraish Shihab",
  category: "Literasi Utama",
  coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  price: 95000,
};

const BookCard = memo(function BookCard({ book = DEFAULT_BOOK, priority = false }: BookCardProps) {
  const currentBook = book || DEFAULT_BOOK;
  const coverImage = currentBook.coverUrl || currentBook.cover_url || DEFAULT_BOOK.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  const hasActivePromo = isActivePromo(currentBook);
  const formattedOriginalPrice = formatBookPrice(currentBook.price);
  const formattedPromoPrice = formatBookPrice(currentBook.promo_price);
  const daysRemaining = getPromoDaysRemaining(currentBook.promo_end_date);

  let discountPct = currentBook.promo_percentage;
  if (!discountPct && hasActivePromo && typeof currentBook.price === "number" && typeof currentBook.promo_price === "number" && currentBook.price > 0) {
    discountPct = Math.round(((currentBook.price - currentBook.promo_price) / currentBook.price) * 100);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-200 group flex flex-col justify-between h-full self-stretch relative">
      {/* Cover image & top-right promo badge overlay */}
      <Link
        href={`/katalog/${currentBook.id}`}
        className="block overflow-hidden bg-gray-100 aspect-[2/3] rounded-t-2xl sm:rounded-2xl relative flex-shrink-0"
      >
        <Image
          src={coverImage}
          alt={currentBook.title || "Cover Buku"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Cover Image Overlay Badge (-X%) */}
        {hasActivePromo && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            {discountPct ? `-${discountPct}%` : "PROMO"}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4 justify-between">
        <div>
          <div className="h-7 sm:h-8 flex items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#E52E2D] uppercase tracking-wider line-clamp-2 leading-tight">
              {currentBook.category || "Literasi"}
            </span>
          </div>
          <div className="h-9 sm:h-10 flex items-start mt-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors line-clamp-2 leading-tight">
              <Link href={`/katalog/${currentBook.id}`}>{currentBook.title}</Link>
            </h4>
          </div>
          <div className="h-4 sm:h-5 mt-0.5">
            <p className="text-[11px] text-[#76716A] truncate">
              {currentBook.author}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col justify-between">
          <div className="min-h-[44px] flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-sm sm:text-base font-black ${hasActivePromo ? 'text-[#E52E2D]' : 'text-gray-900'}`}>
                {hasActivePromo ? formattedPromoPrice : formattedOriginalPrice}
              </span>
              {hasActivePromo && discountPct ? (
                <span className="bg-red-50 text-[#E53935] border border-red-200 font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  HEMAT {discountPct}%
                </span>
              ) : null}
            </div>
            <div className="h-4 flex items-center">
              {hasActivePromo ? (
                <span className="line-through text-gray-400 text-[10px] sm:text-[11px]">
                  {formattedOriginalPrice}
                </span>
              ) : (
                <span className="invisible text-[11px] select-none">-</span>
              )}
            </div>
          </div>

          <div className="min-h-[38px] sm:min-h-[42px] flex items-center my-1.5 w-full">
            {hasActivePromo ? (
              <PromoStockBar
                timeLeft={daysRemaining <= 1 ? "Berakhir HARI INI!" : `Berakhir ${daysRemaining} hari`}
                stockLabel={daysRemaining <= 1 ? "HARI INI!" : "Stok Terbatas"}
                progressPercent={daysRemaining <= 1 ? 95 : 70}
                theme="light"
              />
            ) : (
              <div className="w-full h-full invisible select-none pointer-events-none" />
            )}
          </div>

          <Link
            href={`/katalog/${currentBook.id}`}
            className="w-full block text-center px-2.5 py-2 text-xs font-bold bg-[#E53935] hover:bg-[#C12A26] rounded-xl text-white transition-all duration-200 active:scale-95 uppercase tracking-wider shadow-xs"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
});

export default BookCard;
