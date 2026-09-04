"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  ChevronRight,
  Clock,
  Timer,
  ShoppingCart,
  ChevronLeft,
} from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import PromoStockBar from "@/components/PromoStockBar";

interface PromoSectionProps {
  books?: Book[];
}

export default function PromoSection({ books = [] }: PromoSectionProps) {
  // Filter active promos strictly - unmount if empty
  const activePromoBooks = (books || []).filter(isActivePromo);
  if (activePromoBooks.length === 0) {
    return null;
  }

  // Synchronize header countdown to the earliest active promo end date
  const earliestTargetDate = activePromoBooks[0]?.promo_end_date || undefined;
  const countdown = useCountdown(earliestTargetDate);

  const featuredBook = activePromoBooks[0];
  const sideBooks = activePromoBooks.slice(1, 4);
  const dealStripBooks = activePromoBooks.slice(0, 4);

  // Ref & Scroll Handler for DEAL HARI INI slider
  const dealSliderRef = useRef<HTMLDivElement>(null);
  const scrollDeal = (direction: 'left' | 'right') => {
    if (dealSliderRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      dealSliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Warm Red Parchment Container */}
        <div className="bg-[#FFF7F5] border border-red-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header & Global Countdown */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-red-200/80 gap-4">
            <div>
              {/* Top Header Styling Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E53935] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-xs">
                  <Flame size={14} className="text-amber-300 fill-amber-300" />
                  PROMO TERBATAS
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-orange-950 font-bold bg-orange-100/90 px-3 py-1 rounded-full border border-orange-200/80 shadow-2xs">
                  <Clock size={13} className="text-orange-600" />
                  <span>Diskon Spesial</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#E52E2D] tracking-tight flex items-center gap-2">
                <span>🔥 FLASH SALE &amp; PROMO SPESIAL</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium hidden sm:block">
                Harga spesial untuk buku pilihan. Jangan sampai kehabisan!
              </p>
            </div>

            {/* Right Side: Countdown UI & CTA */}
            <div className="flex flex-row items-center justify-between gap-2 mt-3 sm:mt-0 w-full md:w-auto">
              {/* Compact Horizontal Countdown Card */}
              <div className="flex items-center gap-2 sm:gap-3 bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm h-auto flex-1 sm:flex-none">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-50 text-[#E52E2D] flex items-center justify-center flex-shrink-0">
                  <Timer size={14} className="text-[#E52E2D] animate-pulse sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-500 tracking-wider truncate">
                    ⚡ BERAKHIR DALAM
                  </span>
                  <span
                    className="text-xs sm:text-sm font-extrabold text-[#E52E2D] whitespace-nowrap truncate"
                    suppressHydrationWarning
                  >
                    {countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
                  </span>
                </div>
              </div>

              {/* Action Link Button */}
              <Link
                href="/katalog?category=promo"
                className="group inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-3 sm:px-4 py-2.5 rounded-full border border-red-200 shadow-2xs hover:shadow-xs shrink-0 justify-center whitespace-nowrap"
              >
                <span>Lihat Semua</span>
                <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 2-COLUMN GRID SHOWCASE (Desktop) / Carousel on Mobile     */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Main Featured Deal (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col h-full">
              {featuredBook && <FeaturedRedDealTicket book={featuredBook} />}
            </div>

            {/* Right Column: 3 Stacked Side Cards (lg:col-span-5) - Desktop Only */}
            <div className="hidden lg:flex lg:col-span-5 flex-col gap-3.5 h-full justify-between">
              {sideBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className="flex-1 flex flex-col"
                >
                  <SideCouponCard book={book} index={idx} />
                </div>
              ))}
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* BOTTOM STRIP: DEAL HARI INI                                */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="mt-10 pt-8 border-t border-red-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping" />
                <div>
                  <h3 className="font-serif font-black text-xl text-[#272522] tracking-tight">
                    DEAL HARI INI
                  </h3>
                  <p className="text-xs text-[#76716A]">
                    Tawaran spesial dengan potongan harga terbesar hari ini
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollDeal('left')}
                  aria-label="Sebelumnya"
                  className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollDeal('right')}
                  aria-label="Berikutnya"
                  className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs active:scale-95 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div
              ref={dealSliderRef}
              className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 pb-4 pt-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
            >
              {dealStripBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className="w-[82vw] max-w-[310px] flex-shrink-0 snap-center lg:w-auto"
                >
                  <TearOffTicketCard book={book} index={idx} />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/** 
 * FEATURED HERO DEAL TICKET (Left Column lg:col-span-7)
 */
function FeaturedRedDealTicket({ book }: { book: Book }) {
  const countdown = useCountdown(book.promo_end_date || undefined);
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  let discountPct = book.promo_percentage || 15;
  if (
    !book.promo_percentage &&
    hasPromo &&
    typeof book.price === "number" &&
    typeof book.promo_price === "number" &&
    book.price > 0
  ) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="bg-gradient-to-br from-[#c12a26] to-[#a01e1a] rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-7 text-white relative flex flex-col justify-between overflow-hidden shadow-xl h-full group border border-red-500/30">

      {/* Ticket Cutout Notches */}
      <div className="absolute top-1/4 -left-3.5 sm:-left-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -left-3.5 sm:-left-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -left-3.5 sm:-left-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/4 -right-3.5 sm:-right-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-3.5 sm:-right-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -right-3.5 sm:-right-4 w-6 sm:w-7 h-6 sm:h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />

      {/* Ambient Radial Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Top Row: Badge + Discount Callout ─── */}
      <div className="flex items-center justify-between gap-2 z-10 relative mb-1.5 sm:mb-0">
        <span className="bg-amber-400 text-gray-950 font-extrabold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 sm:gap-1.5 shadow-xs border border-amber-300">
          <Flame size={12} className="fill-gray-950 text-gray-950 sm:w-3.5 sm:h-3.5" />
          <span>FEATURED DEAL</span>
        </span>
        <span className="text-lg sm:text-3xl lg:text-4xl font-black text-amber-300 tracking-tight font-sans drop-shadow-md">
          DISKON HINGGA {discountPct}%
        </span>
      </div>

      {/* ─── Middle Row: Centered 2-Column Showcase (Cover + Book Details) ─── */}
      <div className="my-auto py-2 flex flex-row items-center gap-3.5 sm:gap-5 flex-1 z-10 relative">
        {/* Left Sub-column: Book Cover Asset */}
        <Link
          href={`/katalog/${book.id}`}
          className="w-24 sm:w-44 md:w-48 aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl flex-shrink-0 border border-white/20 block relative"
        >
          <Image
            src={coverImage}
            alt={book.title}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover rounded-lg sm:rounded-xl hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Right Sub-column: Category, Title, Author, Price & Bonus Snippet */}
        <div className="flex flex-col justify-center text-left min-w-0 flex-1">
          <span className="text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            {book.category || "ROMANSA"}
          </span>
          <h3 className="text-base sm:text-2xl font-serif font-black leading-snug sm:leading-tight mt-0.5 text-white line-clamp-2 group-hover:text-amber-200 transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-red-100/90 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">{book.author}</p>
          
          <div className="text-lg sm:text-3xl font-extrabold text-white mt-1.5 sm:mt-3 flex items-baseline justify-start gap-2 flex-wrap">
            <span>{formattedPromo}</span>
            <span className="text-red-200/80 line-through text-xs sm:text-base font-normal">
              {formattedOrig}
            </span>
          </div>

          {/* Micro-Description / Value Highlight (Hidden on Mobile) */}
          <p className="mt-3 text-xs sm:text-sm text-red-100/90 line-clamp-2 leading-relaxed hidden sm:block">
            Dapatkan penawaran eksklusif edisi bertanda tangan penulis dan bonus stiker selama persediaan masih ada.
          </p>
        </div>
      </div>

      {/* ─── Bottom Row: Countdown Progress Bar + CTA Button ─── */}
      <div className="bg-black/25 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 border border-white/10 mt-2 sm:mt-auto z-10 relative">
        {/* Countdown + Progress Bar */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <PromoStockBar
            timeLeft={`Sisa Waktu: ${countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}`}
            stockLabel="Bonus Stiker"
            progressPercent={50}
            theme="dark"
          />
        </div>

        {/* CTA Button */}
        <Link
          href={`/katalog/${book.id}`}
          className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl whitespace-nowrap text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0 justify-center w-full sm:w-auto"
        >
          <span>Ambil Promo Sekarang</span>
          <ChevronRight size={14} strokeWidth={3} className="text-gray-950 sm:w-4 sm:h-4" />
        </Link>
      </div>

    </div>
  );
}

/** 
 * SIDE COUPON CARD ITEM (Right Column lg:col-span-5)
 */
function SideCouponCard({ book, index }: { book: Book; index: number }) {
  const countdown = useCountdown(book.promo_end_date || undefined);
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  let discountPct = book.promo_percentage || 15;
  if (
    !book.promo_percentage &&
    hasPromo &&
    typeof book.price === "number" &&
    typeof book.promo_price === "number" &&
    book.price > 0
  ) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="flex-1 bg-white rounded-3xl p-3.5 sm:p-4 border border-gray-100 shadow-sm flex flex-row items-center gap-3 sm:gap-3.5 hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Ticket Cutout Notches */}
      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#FFF7F5] border border-gray-100 rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#FFF7F5] border border-gray-100 rounded-full -translate-y-1/2 z-20 shadow-inner" />

      {/* Discount Badge */}
      <span className="absolute top-3 right-3 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
        -{discountPct}%
      </span>

      {/* Cover Thumbnail */}
      <Link
        href={`/katalog/${book.id}`}
        className="w-20 aspect-[2/3] flex-shrink-0 rounded-xl bg-gray-50 p-1 border border-gray-100 overflow-hidden block group-hover:scale-105 transition-transform relative"
      >
        <Image
          src={coverImage}
          alt={book.title}
          fill
          sizes="80px"
          loading="lazy"
          className="object-cover rounded-lg"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4 flex flex-col justify-between h-full">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E53935]">
            {book.category || "LITERASI"}
          </span>
          <h4 className="font-bold text-gray-900 line-clamp-2 text-sm sm:text-base group-hover:text-red-600 transition-colors mt-0.5">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h4>
          <p className="text-xs text-[#76716A] truncate mt-0.5">{book.author}</p>

          <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
            <span className="font-extrabold text-[#E53935] text-sm sm:text-base">{formattedPromo}</span>
            <span className="line-through text-gray-400 text-xs font-normal">{formattedOrig}</span>
          </div>
        </div>

        {/* Dynamic Countdown & Stock Progress */}
        <div className="mt-2.5 pt-2 border-t border-gray-100/80">
          <PromoStockBar
            timeLeft={countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
            stockLabel="Stok Terbatas"
            progressPercent={50}
            theme="light"
          />
        </div>
      </div>

    </div>
  );
}

/** 
 * TEAR-OFF TICKET CARD ITEM (DEAL HARI INI Strip)
 */
function TearOffTicketCard({ book, index }: { book: Book; index: number }) {
  const countdown = useCountdown(book.promo_end_date || undefined);
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  let discountPct = book.promo_percentage || 15;
  if (
    !book.promo_percentage &&
    hasPromo &&
    typeof book.price === "number" &&
    typeof book.promo_price === "number" &&
    book.price > 0
  ) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-red-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full group relative overflow-hidden">
      
      {/* Discount Tag */}
      <span className="absolute top-2.5 right-2.5 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
        -{discountPct}%
      </span>

      {/* Cover Image */}
      <Link
        href={`/katalog/${book.id}`}
        className="w-full aspect-[2/3] max-h-36 sm:max-h-40 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-2.5 border border-gray-100 group-hover:scale-102 transition-transform block relative"
      >
        <Image
          src={coverImage}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover rounded-lg"
        />
      </Link>

      {/* Title & Author */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-bold text-[#E53935] uppercase tracking-wider block mb-0.5">
            {book.category || "FLASH SALE"}
          </span>
          <h4 className="font-bold text-gray-900 line-clamp-1 text-xs sm:text-sm group-hover:text-red-600 transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h4>
          <p className="text-[11px] text-[#76716A] truncate mt-0.5">{book.author}</p>
        </div>

        {/* Price & Stock */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between gap-1 flex-wrap mb-1.5">
            <span className="font-black text-[#E53935] text-sm">{formattedPromo}</span>
            <span className="line-through text-gray-400 text-[10px] font-normal">{formattedOrig}</span>
          </div>

          {/* Standardized Stock / Time Progress Bar */}
          <div className="mb-3">
            <PromoStockBar
              timeLeft={countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
              stockLabel="Stok Terbatas"
              progressPercent={65}
              theme="light"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/katalog/${book.id}`}
        className="w-full bg-[#E53935] hover:bg-[#C12A26] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
      >
        <span>Lihat Detail</span>
      </Link>

    </div>
  );
}

