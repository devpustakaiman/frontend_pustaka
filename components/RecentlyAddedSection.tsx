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
  const countdown = useCountdown();
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
      className={`snap-start flex-shrink-0 w-[152px] sm:w-[184px] lg:w-[214px] bg-white border border-gray-100 rounded-2xl overflow-hidden group flex flex-col hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-300 ${
        isEven ? "mt-0" : "mt-3"
      }`}
    >
      {/* Cover */}
      <Link
        href={`/katalog/${book.id}`}
        className="block relative overflow-hidden bg-gray-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={book.title || "Cover Buku"}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
          }}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Left "Baru" Badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#E52E2D] text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10">
          Baru
        </span>

        {/* Top Right Red Discount Badge if Promo */}
        {isPromo && (
          <span className="absolute top-2.5 right-2.5 bg-[#E52E2D] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md z-10 animate-pulse">
            -{discountPct}%
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] font-bold text-[#E52E2D] uppercase tracking-wider block">
            {book.category || "Literasi"}
          </span>
          <h3 className="font-serif font-bold text-[13px] text-[#272522] mt-1 leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-[11px] text-[#76716A] mt-0.5 truncate">{book.author}</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100">
          {isPromo ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-[#E52E2D] text-xs sm:text-sm">
                  {formattedPromo}
                </span>
                <span className="bg-[#E52E2D] text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-2xs">
                  HEMAT {discountPct}%
                </span>
              </div>
              <span className="line-through text-gray-400 text-[10px]">
                {formattedOrig}
              </span>

              {/* Compact Synchronized Countdown Bar */}
              <div className="mt-1.5 bg-red-50/70 border border-red-100 rounded-lg p-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-gray-700">
                  <span className="flex items-center gap-1 truncate" suppressHydrationWarning>
                    <Clock size={11} className="text-[#E52E2D] shrink-0" />
                    <span>{countdown.formatted || "Promo Berakhir"}</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#E52E2D] h-full rounded-full transition-all duration-500 w-[65%]"
                  />
                </div>
              </div>
            </div>
          ) : book.price ? (
            <span className="font-extrabold text-[#E52E2D] text-sm block">
              {formatBookPrice(book.price)}
            </span>
          ) : (
            <span className="text-xs text-[#76716A] italic">Hubungi Kami</span>
          )}

          <Link
            href={`/katalog/${book.id}`}
            className="mt-2.5 w-full block text-center px-3 py-2 text-[11px] font-bold border border-[#E52E2D] text-[#E52E2D] hover:bg-[#E52E2D] hover:text-white rounded-xl transition-all duration-200 active:scale-95 uppercase tracking-wide shadow-2xs"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
