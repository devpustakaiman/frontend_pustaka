"use client";

import Link from "next/link";
import { Sparkle, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollCarousel } from "./ScrollCarousel";

interface RecentlyAddedSectionProps {
  books?: Book[];
}

export default function RecentlyAddedSection({ books = [] }: RecentlyAddedSectionProps) {
  const { scrollRef, canLeft, canRight, scroll } = useScrollCarousel();

  return (
    <section className="w-full bg-white py-14 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-gray-100 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#E52E2D] mb-2">
              <Sparkle size={13} strokeWidth={2} />
              Koleksi Terbaru
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
              Buku <span className="text-[#C12A26] italic font-serif">Terbaru</span>
            </h2>
          </div>
          <Link
            href="/katalog?filter=buku-baru"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#272522] hover:text-[#E52E2D] transition-colors mt-4 sm:mt-0"
          >
            <span>Lihat Semua Koleksi</span>
            <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform text-[#E52E2D]" />
          </Link>
        </div>

        {/* Carousel wrapper with overlay arrows */}
        <div className="relative">
          {/* Left arrow + fade */}
          <div
            className={`absolute left-0 top-0 bottom-4 z-10 flex items-center transition-opacity duration-200 ${
              canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("left")}
              aria-label="Sebelumnya"
              className="relative ml-1 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#272522] hover:bg-[#E52E2D] hover:text-white hover:border-[#E52E2D] hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#E52E2D] focus:ring-offset-2"
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </button>
          </div>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {books.map((book, idx) => (
              <NewArrivalCard key={book.id} book={book} idx={idx} />
            ))}
            <div className="flex-shrink-0 w-1" aria-hidden="true" />
          </div>

          {/* Right arrow + fade */}
          <div
            className={`absolute right-0 top-0 bottom-4 z-10 flex items-center transition-opacity duration-200 ${
              canRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("right")}
              aria-label="Berikutnya"
              className="relative mr-1 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-[#272522] hover:bg-[#E52E2D] hover:text-white hover:border-[#E52E2D] hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#E52E2D] focus:ring-offset-2"
            >
              <ChevronRight size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Individual New Arrival Card with Red Brand Palette */
function NewArrivalCard({ book, idx }: { book: Book; idx: number }) {
  const isPromo = isActivePromo(book);
  const countdown = useCountdown(book.promo_end_date || undefined);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const isEven = idx % 2 === 0;

  const numPrice = Number(book.price) || 0;
  const numPromo = Number(book.promo_price) || 0;
  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && isPromo && numPrice > 0 && numPromo > 0) {
    discountPct = Math.round(((numPrice - numPromo) / numPrice) * 100);
  }

  const coverImage =
    (book.coverUrl && book.coverUrl.trim().length > 0 ? book.coverUrl : null) ||
    (book.cover_url && book.cover_url.trim().length > 0 ? book.cover_url : null) ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  return (
    <div
      className="snap-start flex-shrink-0 w-44 sm:w-56 bg-white border border-gray-100 rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-300 h-full self-stretch"
    >
      {/* Cover */}
      <Link
        href={`/katalog/${book.id}`}
        className="block relative overflow-hidden bg-gray-100 aspect-[3/4] rounded-t-2xl sm:rounded-2xl flex-shrink-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={book.title || "Cover Buku"}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Left "Baru" Badge */}
        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#E52E2D] text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10">
          Baru
        </span>

        {/* Top Right Red Discount Badge if Promo */}
        {isPromo && (
          <span className="absolute top-2 right-2 bg-[#E52E2D] text-white font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full shadow-md z-10 animate-pulse">
            -{discountPct}%
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="h-7 sm:h-8 flex items-start">
            <span className="text-[10px] sm:text-xs font-bold text-[#E52E2D] uppercase tracking-wider line-clamp-2 leading-tight">
              {book.category || "Literasi"}
            </span>
          </div>
          <div className="h-9 sm:h-10 flex items-start mt-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors line-clamp-2 leading-tight">
              <Link href={`/katalog/${book.id}`}>{book.title}</Link>
            </h4>
          </div>
          <div className="h-4 sm:h-5 mt-0.5">
            <p className="text-[11px] text-[#76716A] truncate">{book.author}</p>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col justify-between">
          {/* Equalized Price & Strikethrough Row Height */}
          <div className="min-h-[44px] flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-sm sm:text-base font-black ${isPromo ? 'text-[#E52E2D]' : 'text-gray-900'}`}>
                {isPromo ? formattedPromo : (book.price ? formatBookPrice(book.price) : "Hubungi Kami")}
              </span>
              {isPromo && discountPct ? (
                <span className="bg-[#E52E2D] text-white font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full shadow-2xs">
                  HEMAT {discountPct}%
                </span>
              ) : null}
            </div>
            <div className="h-4 flex items-center">
              {isPromo ? (
                <span className="line-through text-gray-400 text-[10px] sm:text-[11px]">
                  {formattedOrig}
                </span>
              ) : (
                <span className="invisible text-[11px] select-none">-</span>
              )}
            </div>
          </div>

          {/* Preserve Timer Slot Height */}
          <div className="min-h-[38px] sm:min-h-[42px] flex items-center my-1 w-full">
            {isPromo ? (
              <div className="w-full bg-red-50/70 border border-red-100 rounded-lg p-1.5 sm:p-2">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-gray-700">
                  <span className="flex items-center gap-1 truncate" suppressHydrationWarning>
                    <Clock size={10} className="text-[#E52E2D] shrink-0 sm:w-3 sm:h-3" />
                    <span>{countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}</span>
                  </span>
                </div>
                <div className="h-1 sm:h-1.5 w-full bg-amber-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#E52E2D] h-full rounded-full transition-all duration-500"
                    style={{ width: countdown.hasMounted ? `${countdown.progressPercent || 65}%` : '0%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full invisible select-none pointer-events-none" />
            )}
          </div>

          {/* Pinned Button at Absolute Bottom */}
          <Link
            href={`/katalog/${book.id}`}
            className="w-full block text-center px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold border border-[#E52E2D] text-[#E52E2D] hover:bg-[#E52E2D] hover:text-white rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wide shadow-2xs"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
