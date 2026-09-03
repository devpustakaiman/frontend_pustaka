"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Flame,
  ChevronRight,
  Clock,
  Zap,
  Timer,
  ShoppingCart,
  ChevronLeft,
} from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { usePromoTimer } from "@/lib/promoTimer";

interface PromoSectionProps {
  books?: Book[];
}

export default function PromoSection({ books = [] }: PromoSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter active promos
  const activePromoBooks = books.filter(isActivePromo);
  const displayBooks = activePromoBooks.length > 0 ? activePromoBooks : books;

  if (!displayBooks || displayBooks.length === 0) {
    return null;
  }

  const featuredBook = displayBooks[0];
  const rightCouponBooks = displayBooks.slice(1, 4);
  const dealStripBooks = displayBooks.slice(0, 4);

  // Global Countdown Hook mapping natural time & progress from featured book
  const globalTimer = usePromoTimer(featuredBook?.created_at, featuredBook?.promo_end_date);

  const allSlides = [
    ...(featuredBook ? [{ type: "featured" as const, book: featuredBook }] : []),
    ...rightCouponBooks.map((book, idx) => ({ type: "coupon" as const, book, idx })),
    ...dealStripBooks.map((book, idx) => ({ type: "deal" as const, book, idx })),
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Warm Red Parchment Container */}
        <div className="bg-[#FFF7F5] border border-red-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header & Global Countdown — responsive flex-col on mobile, flex-row on md+ */}
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

              {/* Main Title — scales fluidly */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#E52E2D] tracking-tight flex items-center gap-2">
                <span>🔥 FLASH SALE &amp; PROMO SPESIAL</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Harga spesial untuk buku pilihan. Jangan sampai kehabisan!
              </p>
            </div>

            {/* Right Side: Countdown UI & CTA — wraps on mobile, row on sm+ */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Natural Indonesian Countdown Box */}
              <div className="bg-white border border-red-200/90 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <Timer size={18} className="text-[#E52E2D] animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                    ⚡ BERAKHIR DALAM
                  </span>
                  <span
                    className="text-sm sm:text-base font-extrabold text-[#E52E2D] tracking-tight font-sans block"
                    suppressHydrationWarning
                  >
                    {isMounted ? globalTimer.formattedText : "–"}
                  </span>
                </div>
              </div>

              {/* Action Link Button */}
              <Link
                href="/katalog?category=promo"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-red-200 shadow-2xs hover:shadow-xs shrink-0 justify-center"
              >
                <span>Lihat Semua Promo</span>
                <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* MOBILE CAROUSEL  (hidden on lg+)                           */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:hidden mb-6">
            <MobilePromoCarousel slides={allSlides} />
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* DESKTOP LAYOUT  (hidden below lg)                          */}
          {/* ═══════════════════════════════════════════════════════════ */}

          {/* Upper Showcase: Featured Banner (Left 7 cols) + 3 Side Cards (Right 5 cols) */}
          <div className="hidden lg:grid grid-cols-12 gap-6 items-stretch mb-10">
            {/* Featured Red Ticket Box (Left 7 cols) */}
            <div className="col-span-7 h-full flex flex-col">
              {featuredBook && <FeaturedRedDealTicket book={featuredBook} />}
            </div>

            {/* 3 Right Side Cards (Right 5 cols) */}
            <div className="col-span-5 flex flex-col justify-between h-full gap-4">
              {rightCouponBooks.map((book, idx) => (
                <RightCouponTicketCard key={book.id} book={book} index={idx} />
              ))}
            </div>
          </div>

          {/* Lower Section: "⚡ DEAL HARI INI" (4 Tear-Off Ticket Cards) — desktop only */}
          <div className="hidden lg:block pt-6 border-t border-red-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-red-600 text-white shadow-2xs">
                  <Zap size={14} className="fill-white" />
                </span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#272522]">
                    DEAL HARI INI
                  </h3>
                  <p className="text-[11px] text-[#76716A]">
                    Tawaran spesial dengan potongan harga terbesar hari ini
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {dealStripBooks.map((book, idx) => (
                <TearOffTicketCard key={book.id} book={book} index={idx} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE PROMO CAROUSEL — fully interactive with prev/next buttons + live dots
// ─────────────────────────────────────────────────────────────────────────────
type SlideItem =
  | { type: "featured"; book: Book }
  | { type: "coupon"; book: Book; idx: number }
  | { type: "deal"; book: Book; idx: number };

function MobilePromoCarousel({ slides }: { slides: SlideItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - 16, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Find the slide whose center is closest to the container center
    const containerCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(containerCenter - elCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(closest);
  }, []);

  const prev = () => scrollToIndex(Math.max(0, activeIdx - 1));
  const next = () => scrollToIndex(Math.min(slides.length - 1, activeIdx + 1));

  return (
    <div className="relative">
      {/* Swipeable track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="min-w-[88vw] max-w-[360px] flex-shrink-0 snap-center"
          >
            {slide.type === "featured" && <MobilePromoFeaturedSlide book={slide.book} />}
            {slide.type === "coupon" && <RightCouponTicketCard book={slide.book} index={slide.idx} />}
            {slide.type === "deal" && <TearOffTicketCard book={slide.book} index={slide.idx} />}
          </div>
        ))}
      </div>

      {/* ── Controls bar: prev/next + dots ── */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Prev button */}
        <button
          onClick={prev}
          disabled={activeIdx === 0}
          aria-label="Sebelumnya"
          className="w-9 h-9 rounded-full bg-white border border-red-200 shadow-md flex items-center justify-center text-[#E52E2D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 active:scale-95 transition-all duration-150"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "w-5 h-2 bg-[#E52E2D] shadow-sm"
                  : "w-2 h-2 bg-red-200 hover:bg-red-300"
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={next}
          disabled={activeIdx === slides.length - 1}
          aria-label="Berikutnya"
          className="w-9 h-9 rounded-full bg-[#E52E2D] shadow-md flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#c12a26] active:scale-95 transition-all duration-150"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Slide counter */}
      <p className="text-center text-[11px] text-gray-400 font-medium mt-1.5">
        {activeIdx + 1} / {slides.length}
      </p>
    </div>
  );
}

/**
 * MOBILE FEATURED SLIDE — Compact card for the mobile horizontal carousel
 * Same branding as FeaturedRedDealTicket but height-constrained to fit mobile viewport
 */
function MobilePromoFeaturedSlide({ book }: { book: Book }) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && hasPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white rounded-3xl p-5 relative overflow-hidden shadow-xl flex flex-col gap-4 h-full border border-red-500/30">
      {/* Ambient glow */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs w-fit border border-amber-300 z-10">
        <Flame size={12} className="fill-amber-950" />
        FEATURED DEAL
      </span>

      {/* Cover + Info row */}
      <div className="flex items-center gap-4 z-10 flex-1">
        {/* Book cover */}
        <Link
          href={`/katalog/${book.id}`}
          className="w-24 h-32 rounded-xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 flex-shrink-0 block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={book.title} className="w-full h-full object-cover" />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{book.category || "ROMANSA"}</span>
          <h3 className="font-serif text-base font-bold text-white leading-tight line-clamp-2">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-[11px] text-white/70 truncate">{book.author}</p>

          {/* Discount + price */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="bg-amber-400 text-amber-950 font-black text-[11px] px-2 py-0.5 rounded-full">-{discountPct}%</span>
            <span className="font-black text-white text-lg tracking-tight">{formattedPromo}</span>
            <span className="line-through text-white/50 text-xs">{formattedOrig}</span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="bg-black/30 rounded-2xl px-3 py-2.5 flex items-center gap-2 z-10 border border-white/10">
        <Clock size={14} className="text-amber-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">Sisa Waktu</p>
          <p className="text-xs font-extrabold text-amber-300 truncate" suppressHydrationWarning>{timer.formattedText}</p>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${timer.progressPercent}%` }} />
          </div>
        </div>
        <Link
          href={`/katalog/${book.id}`}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[11px] py-2 px-3 rounded-full shrink-0 inline-flex items-center gap-1 transition-all"
        >
          Ambil
          <ChevronRight size={13} className="stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}

/** 
 * OVERHAULED FEATURED DEAL (MAIN RED TICKET BOX)
 * Deep Red Gradient, Massive Punchy Discount Text & Solid Yellow Pill CTA Button
 */
function FeaturedRedDealTicket({ book }: { book: Book }) {
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

  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white rounded-3xl p-5 sm:p-7 md:p-9 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full group border border-red-500/30">

      {/* Physical Ticket Side Notches / Cutouts */}
      <div className="absolute top-1/4 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/4 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />

      {/* Ambient Radial Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Header area: discount label + book info — 2-col on sm+ ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start z-10 relative">

        {/* Left: Badge + % Number */}
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs w-fit border border-amber-300">
            <Flame size={13} className="fill-amber-950" />
            FEATURED DEAL
          </span>
          <p className="text-[11px] font-black text-amber-200 uppercase tracking-widest mt-1">
            DISKON HINGGA
          </p>
          <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-xl font-sans leading-none">
            {discountPct}%
          </span>
          <p className="text-xs text-white/80 font-medium">
            Deal terbaik hari ini untuk kamu!
          </p>
        </div>

        {/* Right: Title + Author + Price */}
        <div className="flex flex-col justify-center gap-1">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            {book.category || "ROMANSA"}
          </span>
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2 group-hover:text-amber-200 transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-xs text-white/70 font-medium truncate">{book.author}</p>
          <div className="flex flex-wrap items-baseline gap-2 mt-1">
            <span className="font-black text-white text-xl sm:text-2xl tracking-tight">
              {formattedPromo}
            </span>
            <span className="line-through text-white/50 text-xs font-normal">
              {formattedOrig}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Center: Cover image ─── */}
      <div className="relative flex justify-center py-4 sm:py-6 my-auto z-10">
        <Link
          href={`/katalog/${book.id}`}
          className="relative block rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={book.title}
            className="max-w-[200px] sm:max-w-[240px] md:max-w-[260px] h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md border border-amber-300">
            -{discountPct}%
          </span>
        </Link>
      </div>

      {/* ─── Bottom action bar: CTA + Timer — stack on mobile, row on sm+ ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2 z-10 relative">
        {/* CTA Button */}
        <Link
          href={`/katalog/${book.id}`}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm py-3 px-5 rounded-full shadow-xl border border-yellow-300 inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 group/btn w-full sm:w-auto"
        >
          <span>Ambil Promo Sekarang</span>
          <ChevronRight size={18} className="stroke-[3] text-black group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        {/* Timer widget */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-2 w-full sm:w-auto sm:min-w-[200px]">
          <Clock size={15} className="text-amber-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wide">Sisa Waktu</p>
            <p className="text-xs sm:text-sm font-extrabold text-amber-300 truncate" suppressHydrationWarning>
              {timer.formattedText}
            </p>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${timer.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/** 
 * RIGHT COUPON TICKET CARD ITEM 
 * Realistic Ticket Stub with Left/Right Notches & Dashed Tear Line
 */
function RightCouponTicketCard({ book, index }: { book: Book; index: number }) {
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

  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  const pastelStyles = [
    { bg: "bg-[#FCEAE6]", catText: "text-rose-600", fillPct: "65%" },
    { bg: "bg-[#FBF3D5]", catText: "text-amber-700", fillPct: "58%" },
    { bg: "bg-[#E5F5F8]", catText: "text-sky-700", fillPct: "40%" },
  ];

  const style = pastelStyles[index % pastelStyles.length];

  return (
    <div className="bg-white border border-[#FCD8D4] rounded-3xl p-4 sm:p-5 flex flex-col shadow-sm hover:shadow-lg hover:border-red-300 transition-all duration-200 relative overflow-hidden group h-full">

      {/* Ticket Cutout Left/Right Notches */}
      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#FFF7F5] border border-[#FCD8D4] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#FFF7F5] border border-[#FCD8D4] rounded-full -translate-y-1/2 z-20 shadow-inner" />

      {/* Coupon Badge Top Right */}
      <span className="absolute top-3.5 right-4 bg-[#E53935] text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs z-10">
        -{discountPct}%
      </span>

      {/* Main row: Cover + Tear Line + Details — fills card height */}
      <div className="flex flex-row items-center gap-4 flex-1 min-h-0">
        {/* Thumbnail */}
        <Link
          href={`/katalog/${book.id}`}
          className={`w-20 h-28 sm:w-24 sm:h-32 rounded-xl ${style.bg} p-1.5 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 overflow-hidden`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        </Link>

        {/* Vertical Dashed Tear Line */}
        <div className="self-stretch border-r-2 border-dashed border-red-200/80 my-1 shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0 pr-5 flex flex-col justify-center">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.catText}`}>
            {book.category || "LITERASI"}
          </span>
          <h4 className="font-serif font-bold text-sm text-[#272522] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mt-0.5">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h4>
          <p className="text-xs text-[#76716A] truncate mt-0.5">{book.author}</p>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
            <span className="font-extrabold text-[#E53935] text-sm">{formattedPromo}</span>
            <span className="line-through text-gray-400 text-xs font-normal">{formattedOrig}</span>
          </div>
        </div>
      </div>

      {/* Countdown pinned to bottom */}
      <div className="mt-3 bg-[#FFF8F6] border border-red-100 rounded-xl px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-700 flex items-center gap-1.5 truncate" suppressHydrationWarning>
            <Clock size={12} className="text-[#E52E2D] shrink-0" />
            <span>{timer.formattedText}</span>
          </span>
          <span className="bg-red-50 border border-red-200/80 text-[#E52E2D] font-bold text-[9px] px-2 py-0.5 rounded-full shrink-0">
            Stok Terbatas
          </span>
        </div>
        <div className="h-1.5 w-full bg-amber-100/70 rounded-full overflow-hidden">
          <div
            className="bg-[#E52E2D] h-full rounded-full transition-all duration-500"
            style={{ width: `${timer.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** 
 * TEAR-OFF TICKET CARD (DEAL HARI INI) 
 * Realistic Tear-Off Coupon Ticket with Cutouts & Horizontal Dashed Tear Line
 */
function TearOffTicketCard({ book, index }: { book: Book; index: number }) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  const cardBadges = [
    { label: "🔥 HOT DEAL", bg: "bg-red-600 text-white", fillPct: "72%" },
    { label: "⚡ FAST SELLING", bg: "bg-rose-600 text-white", fillPct: "65%" },
    { label: "🔔 LAST CHANCE", bg: "bg-amber-600 text-white", fillPct: "58%" },
    { label: "⭐ EDITOR'S PROMO", bg: "bg-teal-600 text-white", fillPct: "40%" },
  ];

  const badge = cardBadges[index % cardBadges.length];

  return (
    <div className="bg-[#FFF5F3] border border-red-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
      
      {/* Half-Circle Cutouts on Left and Right Edges (Tear-off Trick) */}
      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#FFF7F5] border border-red-200/80 rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#FFF7F5] border border-red-200/80 rounded-full -translate-y-1/2 z-20 shadow-inner" />

      {/* Top Pill Badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badge.bg} shadow-2xs`}
        >
          {badge.label}
        </span>
      </div>

      {/* Book Image & Meta Info Section */}
      <div className="flex items-start gap-3 flex-1 mb-2">
        {/* Thumbnail */}
        <Link
          href={`/katalog/${book.id}`}
          className="w-20 aspect-[3/4] bg-white rounded-lg overflow-hidden shrink-0 shadow-md border border-white block group-hover:scale-105 transition-transform duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Details */}
        <div className="flex flex-col justify-between h-full min-w-0 flex-1">
          <div>
            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider block">
              {book.category || "LITERASI"}
            </span>
            <h4 className="font-serif font-bold text-xs text-[#272522] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mt-0.5">
              <Link href={`/katalog/${book.id}`}>{book.title}</Link>
            </h4>
            <p className="text-[10px] text-[#76716A] truncate mt-0.5">{book.author}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Dashed Tear Line */}
      <div className="w-full border-t-2 border-dashed border-red-200/90 my-2.5" />

      {/* Pricing & CTA Action Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-black text-red-600 text-sm block">
            {formattedPromo}
          </span>
          <span className="line-through text-gray-400 text-[10px]">
            {formattedOrig}
          </span>
        </div>

        {/* Shopping Cart Circular Button */}
        <Link
          href={`/katalog/${book.id}`}
          className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 hover:scale-110"
        >
          <ShoppingCart size={14} />
        </Link>
      </div>

      {/* Bottom Compact Natural Countdown & Stock Box with Progress Bar */}
      <div className="bg-white/95 border border-red-100 rounded-xl p-2.5 mt-auto space-y-1.5 text-[9px]">
        {/* Top line: Clock/Sandglass icon + Natural time string on left, Stok Terbatas badge on right */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="font-semibold text-gray-700 flex items-center gap-1 truncate" suppressHydrationWarning>
            <Clock size={11} className="text-[#E52E2D] shrink-0" />
            <span>{timer.formattedText}</span>
          </span>
          <span className="bg-red-50 border border-red-200/80 text-[#E52E2D] font-bold text-[9px] px-2 py-0.5 rounded-full shrink-0">
            Stok Terbatas
          </span>
        </div>

        {/* Bottom line: Subtle progress bar container */}
        <div className="h-1.5 w-full bg-amber-100/70 rounded-full overflow-hidden mt-1.5">
          <div
            className="bg-[#E52E2D] h-full rounded-full transition-all duration-500"
            style={{ width: `${timer.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
