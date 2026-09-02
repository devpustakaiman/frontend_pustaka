"use client";

import { useState, useEffect } from "react";
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
import { useCountdown } from "@/lib/hooks/useCountdown";

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

  // Global Countdown Hook mapping days, hours, minutes, seconds from featured book promo_end_date
  const globalTimer = useCountdown(featuredBook?.promo_end_date);

  return (
    <section className="w-full py-8 md:py-12 bg-[#FEFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Warm Red Parchment Container */}
        <div className="bg-[#FFF7F5] border border-red-200/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header & Global Countdown Flip Clock */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-6 border-b border-red-200/80 gap-6">
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

              {/* Main Title */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#D32F2F] tracking-tight flex items-center gap-2">
                <span>🔥 FLASH SALE & PROMO SPESIAL</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Harga spesial untuk buku pilihan. Jangan sampai kehabisan!
              </p>
            </div>

            {/* Right Side: Global Timer UI (HARI, JAM, MENIT, DETIK) & Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
              {/* Global Timer Box (No Milliseconds - Prevents UI Flicker) */}
              <div className="bg-white border border-red-200/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                  <span>⚡</span>
                  <span>BERAKHIR DALAM</span>
                  <span>⚡</span>
                </div>
                
                <div className="flex items-center gap-2" suppressHydrationWarning>
                  {/* HARI */}
                  <div className="flex flex-col items-center">
                    <div
                      suppressHydrationWarning
                      className="bg-[#E53935] text-white font-mono font-black text-lg sm:text-xl px-2.5 py-1 rounded-lg shadow-xs min-w-[42px] text-center border border-red-600"
                    >
                      {isMounted ? String(globalTimer.days).padStart(2, "0") : "02"}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">HARI</span>
                  </div>
                  <span className="font-black text-red-600 text-lg mb-4">:</span>

                  {/* JAM */}
                  <div className="flex flex-col items-center">
                    <div
                      suppressHydrationWarning
                      className="bg-[#E53935] text-white font-mono font-black text-lg sm:text-xl px-2.5 py-1 rounded-lg shadow-xs min-w-[42px] text-center border border-red-600"
                    >
                      {isMounted ? String(globalTimer.hours).padStart(2, "0") : "14"}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">JAM</span>
                  </div>
                  <span className="font-black text-red-600 text-lg mb-4">:</span>

                  {/* MENIT */}
                  <div className="flex flex-col items-center">
                    <div
                      suppressHydrationWarning
                      className="bg-[#E53935] text-white font-mono font-black text-lg sm:text-xl px-2.5 py-1 rounded-lg shadow-xs min-w-[42px] text-center border border-red-600"
                    >
                      {isMounted ? String(globalTimer.minutes).padStart(2, "0") : "26"}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">MENIT</span>
                  </div>
                  <span className="font-black text-red-600 text-lg mb-4">:</span>

                  {/* DETIK */}
                  <div className="flex flex-col items-center">
                    <div
                      suppressHydrationWarning
                      className="bg-[#E53935] text-white font-mono font-black text-lg sm:text-xl px-2.5 py-1 rounded-lg shadow-xs min-w-[42px] text-center border border-red-600 animate-pulse"
                    >
                      {isMounted ? String(globalTimer.seconds).padStart(2, "0") : "07"}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1">DETIK</span>
                  </div>
                </div>
              </div>

              {/* Action Link Button */}
              <Link
                href="/katalog?category=promo"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#272522] hover:text-red-600 transition-colors bg-white px-4 py-2.5 rounded-full border border-red-200 shadow-2xs hover:shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
              >
                <span>Lihat Semua Promo</span>
                <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Upper Showcase: Overhauled Featured Ticket Box (Left 7 cols) + 3 Ticket Coupon Cards (Right 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
            {/* Featured Red Ticket Box (Left 7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              {featuredBook && <FeaturedRedDealTicket book={featuredBook} />}
            </div>

            {/* 3 Right Ticket Coupon Cards (Right 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
              {rightCouponBooks.map((book, idx) => (
                <RightCouponTicketCard key={book.id} book={book} index={idx} />
              ))}
            </div>
          </div>

          {/* Lower Section: "⚡ DEAL HARI INI" (4 Tear-Off Ticket Cards) */}
          <div className="pt-6 border-t border-red-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#272522] uppercase tracking-wider">
                  <Zap size={15} className="text-red-600 fill-red-600" />
                  <span>DEAL HARI INI</span>
                  <span className="text-[#76716A] font-medium text-xs border-l border-gray-300 pl-2">
                    Banyak pilihan, harga tetap spesial!
                  </span>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-7 h-7 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-2xs">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 4 Tear-Off Ticket Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

  const timer = useCountdown(book.promo_end_date);

  return (
    <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col justify-between h-full group border border-red-500/30">
      
      {/* Physical Ticket Side Notches / Cutouts */}
      <div className="absolute top-1/4 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -left-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />

      <div className="absolute top-1/4 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-3/4 -right-4 w-7 h-7 bg-[#FFF7F5] rounded-full z-20 shadow-inner" />

      {/* Ambient Radial Glowing Light */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 z-10">
        
        {/* Left Column: Massive Punchy Discount & Bright Yellow CTA */}
        <div className="md:col-span-4 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs mb-3 border border-amber-300">
              <Flame size={13} className="fill-amber-950" />
              FEATURED DEAL
            </span>

            <p className="text-[11px] font-black text-amber-200 uppercase tracking-widest mt-1">
              DISKON HINGGA
            </p>

            {/* MASSIVE AND PUNCHY DISCOUNT PERCENTAGE */}
            <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white block my-1 tracking-tighter drop-shadow-xl font-sans">
              {discountPct}%
            </span>

            <p className="text-xs text-white/90 font-medium leading-relaxed">
              Deal terbaik hari ini untuk kamu!
            </p>
          </div>

          {/* High-Contrast Bright Yellow Pill Button */}
          <Link
            href={`/katalog/${book.id}`}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs md:text-sm py-3.5 px-6 rounded-full shadow-xl border border-yellow-300 inline-flex items-center justify-between gap-2 mt-4 transition-all duration-200 active:scale-95 group/btn"
          >
            <span>Ambil Promo Sekarang</span>
            <ChevronRight size={18} className="stroke-[3] text-black group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Middle Column: 3D Cover Book Image */}
        <div className="md:col-span-4 flex justify-center py-2">
          <Link
            href={`/katalog/${book.id}`}
            className="w-full aspect-[3/4] max-w-[200px] rounded-xl overflow-hidden shadow-2xl bg-white/10 relative group border border-white/20 block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Bright Yellow Circle Badge */}
            <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md border border-amber-300">
              -{discountPct}%
            </span>
          </Link>
        </div>

        {/* Right Column: Book Info & FOMO Box */}
        <div className="md:col-span-4 flex flex-col justify-between h-full space-y-3">
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
              {book.category || "ROMANSA"}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight mb-1.5 group-hover:text-amber-200 transition-colors line-clamp-2">
              <Link href={`/katalog/${book.id}`}>{book.title}</Link>
            </h3>
            <p className="text-xs text-white/80 font-medium truncate mb-3">
              {book.author}
            </p>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-black text-white text-2xl md:text-3xl tracking-tight">
                {formattedPromo}
              </span>
              <span className="line-through text-white/60 text-xs font-normal">
                {formattedOrig}
              </span>
            </div>
          </div>

          {/* White FOMO Card Driven by Exact Countdown Hook */}
          <div className="bg-white text-slate-900 rounded-2xl p-3.5 mt-3 border border-white/50 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Timer size={14} className="text-red-600" />
                <span>PROMO BERAKHIR</span>
              </span>
              <span className="font-mono text-red-600 font-black text-xs" suppressHydrationWarning>
                {timer.isExpired ? "EXPIRED" : timer.formattedTime}
              </span>
            </div>
            <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full w-[72%]" />
            </div>
            <p className="text-[10px] font-bold text-gray-500 text-right mt-1">
              72% Terjual
            </p>
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

  const timer = useCountdown(book.promo_end_date);

  const pastelStyles = [
    { bg: "bg-[#FCEAE6]", catText: "text-rose-600", fillPct: "65%" },
    { bg: "bg-[#FBF3D5]", catText: "text-amber-700", fillPct: "58%" },
    { bg: "bg-[#E5F5F8]", catText: "text-sky-700", fillPct: "40%" },
  ];

  const style = pastelStyles[index % pastelStyles.length];

  return (
    <div className="bg-white border border-[#FCD8D4] rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-red-300 transition-all duration-200 relative overflow-hidden group">
      
      {/* Ticket Cutout Left/Right Notches */}
      <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#FFF7F5] border border-[#FCD8D4] rounded-full -translate-y-1/2 z-20 shadow-inner" />
      <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#FFF7F5] border border-[#FCD8D4] rounded-full -translate-y-1/2 z-20 shadow-inner" />

      {/* Coupon Badge Top Right */}
      <span className="absolute top-3.5 right-4 bg-[#E53935] text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs z-10">
        -{discountPct}%
      </span>

      {/* Left Cover Image Container */}
      <Link
        href={`/katalog/${book.id}`}
        className={`w-24 sm:w-28 aspect-[3/4] rounded-xl ${style.bg} p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 relative`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={book.title}
          className="w-full h-full object-cover rounded-lg shadow-sm"
        />
      </Link>

      {/* Vertical Dashed Tear Line */}
      <div className="h-24 border-r-2 border-dashed border-red-200/80 my-auto" />

      {/* Right Details Stub */}
      <div className="flex flex-col justify-center min-w-0 flex-1 pr-6">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.catText}`}>
          {book.category || "LITERASI"}
        </span>
        <h4 className="font-serif font-bold text-sm text-[#272522] leading-snug line-clamp-1 group-hover:text-red-600 transition-colors mt-0.5">
          <Link href={`/katalog/${book.id}`}>{book.title}</Link>
        </h4>
        <p className="text-xs text-[#76716A] truncate mt-0.5">{book.author}</p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-extrabold text-[#E53935] text-sm">
            {formattedPromo}
          </span>
          <span className="line-through text-gray-400 text-xs font-normal">
            {formattedOrig}
          </span>
        </div>

        {/* Compact Progress Box */}
        <div className="mt-2 bg-[#FFF8F6] border border-red-100 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-700">
            <span suppressHydrationWarning>⏳ {timer.isExpired ? "EXPIRED" : timer.formattedTime}</span>
            <span className="text-gray-500 font-semibold">{style.fillPct} terjual</span>
          </div>
          <div className="w-full h-1 bg-red-100 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
              style={{ width: style.fillPct }}
            />
          </div>
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

  const timer = useCountdown(book.promo_end_date);

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

      {/* Bottom Progress Bar Box */}
      <div className="bg-white/90 border border-red-100 rounded-lg p-2 mt-auto">
        <div className="flex items-center justify-between text-[9px] font-bold text-gray-700">
          <span suppressHydrationWarning>⏳ {timer.isExpired ? "EXPIRED" : timer.formattedTime}</span>
          <span className="text-gray-500 font-semibold">{badge.fillPct} terjual</span>
        </div>
        <div className="w-full h-1 bg-red-100 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
            style={{ width: badge.fillPct }}
          />
        </div>
      </div>
    </div>
  );
}
