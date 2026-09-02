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
    <div className="bg-white border border-[#E7E1D8] rounded-xl overflow-hidden hover:border-red-300 hover:shadow-xl transition-all duration-200 group flex flex-col h-full relative">
      {/* Cover image & top-right promo badge overlay */}
      <Link
        href={`/katalog/${currentBook.id}`}
        className="block overflow-hidden bg-[#F1E8D8] aspect-[3/4] relative"
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
            <span className="inline-flex items-center bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md border border-red-500">
              {discountPct ? `-${discountPct}%` : "PROMO"}
            </span>
          </div>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-[10px] font-bold text-[#B67A2D] uppercase tracking-wider">
          {currentBook.category || "Literasi"}
        </span>
        <h3 className="font-serif font-bold text-[15px] text-[#272522] mt-1 group-hover:text-[#B67A2D] transition-colors leading-snug line-clamp-2">
          <Link href={`/katalog/${currentBook.id}`}>{currentBook.title}</Link>
        </h3>
        <p className="text-xs text-[#76716A] mt-1 font-medium truncate">
          {currentBook.author}
        </p>

        {/* Dynamic FOMO Deadline Indicator (Only rendered if isActivePromo is true) */}
        {hasActivePromo && (
          <div className="mt-3 bg-red-50/80 border border-red-200/60 rounded-lg p-2 space-y-1">
            {/* Compact rounded progress bar (filled ~75% gradient) */}
            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 rounded-full w-[75%]" />
            </div>
            
            <div className="flex items-center justify-between text-[11px]">
              {daysRemaining <= 1 ? (
                <span className="text-red-600 font-extrabold text-xs flex items-center gap-1 animate-pulse">
                  <span>⚡</span>
                  <span>Berakhir HARI INI!</span>
                </span>
              ) : (
                <span className="text-xs text-orange-900 font-semibold flex items-center gap-1">
                  <span>⏳</span>
                  <span>Berakhir dalam {daysRemaining} hari</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing UI with High Contrast & 'HEBOH' Discount Badge */}
        <div className="mt-3 flex-1 flex items-end">
          {hasActivePromo ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold text-red-600 text-lg sm:text-xl tracking-tight">
                {formattedPromoPrice}
              </span>
              <span className="line-through text-gray-400 text-xs font-normal">
                {formattedOriginalPrice}
              </span>
              {discountPct ? (
                <span className="bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md animate-pulse -rotate-2 inline-block border border-red-500 tracking-tight">
                  HEMAT {discountPct}%
                </span>
              ) : null}
            </div>
          ) : isFallbackPrice ? (
            <span className="text-xs text-[#B67A2D] font-semibold italic">
              {formattedOriginalPrice}
            </span>
          ) : (
            <span className="font-bold text-[#B67A2D] text-base tracking-tight">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* CTA Button - always aligned to bottom with mt-auto */}
        <div className="mt-auto pt-3 border-t border-[#E7E1D8]">
          <Link
            href={`/katalog/${currentBook.id}`}
            className="w-full block text-center px-3 py-2 text-xs font-semibold bg-[#B67A2D] hover:bg-[#8D5D20] rounded-md text-white transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B67A2D] uppercase tracking-wider shadow-sm hover:shadow-md"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
