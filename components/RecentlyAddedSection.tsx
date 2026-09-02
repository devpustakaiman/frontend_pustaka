"use client";

import Link from "next/link";
import { Sparkle, ChevronRight, ChevronLeft } from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useCountdown } from "@/lib/hooks/useCountdown";
import { useScrollCarousel } from "./ScrollCarousel";

interface RecentlyAddedSectionProps {
  books?: Book[];
}

export default function RecentlyAddedSection({ books = [] }: RecentlyAddedSectionProps) {
  const { scrollRef, canLeft, canRight, scroll } = useScrollCarousel();

  return (
    <section className="w-full bg-[#F7F4E9] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — clean, no arrows here */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-[#DDD8C8] pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#B67A2D] mb-2">
              <Sparkle size={13} strokeWidth={1.5} />
              Koleksi Terbaru
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
              Buku Baru
            </h2>
          </div>
          <Link
            href="/katalog?category=baru"
            className="group inline-flex items-center gap-1 text-sm font-medium text-[#272522] hover:text-[#B67A2D] transition-colors mt-4 sm:mt-0"
          >
            Lihat Semua Buku Baru
            <ChevronRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
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
            {/* Gradient fade */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F7F4E9] to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("left")}
              aria-label="Sebelumnya"
              className="relative ml-1 w-10 h-10 rounded-full bg-white border border-[#E7E1D8] shadow-md flex items-center justify-center text-[#272522] hover:bg-[#B67A2D] hover:text-white hover:border-[#B67A2D] hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#B67A2D] focus:ring-offset-2"
            >
              <ChevronLeft size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
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
            {/* Gradient fade */}
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F7F4E9] to-transparent pointer-events-none" />
            <button
              onClick={() => scroll("right")}
              aria-label="Berikutnya"
              className="relative mr-1 w-10 h-10 rounded-full bg-white border border-[#E7E1D8] shadow-md flex items-center justify-center text-[#272522] hover:bg-[#B67A2D] hover:text-white hover:border-[#B67A2D] hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#B67A2D] focus:ring-offset-2"
            >
              <ChevronRight size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Individual New Arrival Card with Promo Badge, HEMAT % pill, & useCountdown Timer */
function NewArrivalCard({ book, idx }: { book: Book; idx: number }) {
  const isPromo = isActivePromo(book);
  const timer = useCountdown(book.promo_end_date);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const isEven = idx % 2 === 0;

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && isPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div
      className={`snap-start flex-shrink-0 w-[148px] sm:w-[180px] lg:w-[210px] bg-white border border-[#EAE5D9] rounded-xl overflow-hidden group flex flex-col hover:border-[#B67A2D]/50 hover:shadow-xl transition-all duration-300 ${
        isEven ? "mt-0" : "mt-4"
      }`}
    >
      {/* Cover */}
      <Link
        href={`/katalog/${book.id}`}
        className="block relative overflow-hidden bg-[#F1E8D8]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverUrl || book.cover_url || ""}
          alt={book.title}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Left "Baru" Badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#B67A2D] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow z-10">
          Baru
        </span>

        {/* Top Right Red Discount Badge if Promo */}
        {isPromo && (
          <span className="absolute top-2.5 right-2.5 bg-[#E53935] text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md z-10 animate-pulse">
            -{discountPct}%
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] font-bold text-[#B67A2D] uppercase tracking-wider block">
            {book.category || "Literasi"}
          </span>
          <h3 className="font-serif font-bold text-[13px] text-[#272522] mt-1 leading-snug line-clamp-2 group-hover:text-[#B67A2D] transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-[11px] text-[#76716A] mt-0.5 truncate">{book.author}</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E7E1D8]">
          {isPromo ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-[#D32F2F] text-xs sm:text-sm">
                  {formattedPromo}
                </span>
                <span className="bg-[#E53935] text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-2xs">
                  HEMAT {discountPct}%
                </span>
              </div>
              <span className="line-through text-gray-400 text-[10px]">
                {formattedOrig}
              </span>

              {/* Compact Countdown Bar */}
              <div className="mt-1.5 bg-[#FFF8F6] border border-red-100 rounded-md p-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-gray-700">
                  <span suppressHydrationWarning>⏳ {timer.isExpired ? "EXPIRED" : timer.formattedTime}</span>
                </div>
                <div className="w-full h-1 bg-red-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full w-[70%]" />
                </div>
              </div>
            </div>
          ) : book.price ? (
            <span className="font-bold text-[#B67A2D] text-sm block">
              {formatBookPrice(book.price)}
            </span>
          ) : (
            <span className="text-xs text-[#76716A] italic">Hubungi Kami</span>
          )}

          <Link
            href={`/katalog/${book.id}`}
            className="mt-2.5 w-full block text-center px-2 py-1.5 text-[11px] font-semibold bg-[#F1E8D8] hover:bg-[#B67A2D] rounded-md text-[#B67A2D] hover:text-white transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#B67A2D] uppercase tracking-wide"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

