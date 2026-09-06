"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, ChevronLeft, Bookmark, Clock } from "lucide-react";
import { Book, formatBookPrice, isActivePromo, getEffectiveBookPrice } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import PromoStockBar from "./PromoStockBar";
import { getRecommendedBooks, getNewBooks } from "@/lib/api";

interface RecommendedSectionProps {
  books?: Book[];
  title?: string;
}

/** 
 * MAIN FEATURED EDITORIAL CARD (Left Column lg:col-span-7)
 * Premium Gold & Signature Red theme, Gold Curator Note Box, Discount Badge & Integrated Synchronized Timer Bar
 */
function FeaturedHeroCard({ book }: { book: Book }) {
  const countdown = useCountdown(book.promo_end_date || undefined);
  const priceInfo = getEffectiveBookPrice(book);
  const hasDiscount = priceInfo.isPromo;
  const formattedOrig = priceInfo.originalPrice;
  const formattedPromo = priceInfo.promoPrice;
  const currentPrice = priceInfo.displayPrice;
  const discountPercent = priceInfo.discountPercentage || 0;

  const coverImage = book.coverUrl || book.cover_url || "/logo500x200_1.png";

  const bookIdentifier = book.id || book.slug || "";
  const targetUrl = bookIdentifier ? `/katalog/detail?id=${bookIdentifier}` : "/katalog";

  return (
    <div className="relative bg-white border border-amber-200/80 ring-1 ring-amber-400/20 rounded-3xl p-4 sm:p-8 shadow-[0_12px_32px_-12px_rgba(217,119,6,0.12)] flex flex-col justify-between h-full group">
      
      {/* Top Header Badge & Curated Highlight */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
          <Star size={12} fill="currentColor" className="text-white" />
          <span>★ PILIHAN EDITOR</span>
        </span>
        <Bookmark size={20} className="text-amber-500 fill-amber-500" />
      </div>

      {/* Center Showcase: 2-column layout inside */}
      <div className="flex flex-row sm:grid sm:grid-cols-12 gap-3.5 sm:gap-6 items-center my-3 sm:my-4 flex-1">
        {/* Book Cover (sm:col-span-5) */}
        <div className="w-24 sm:w-auto sm:col-span-5 flex-shrink-0 flex justify-center">
          <Link
            href={targetUrl}
            prefetch={false}
            className="w-full max-w-[220px] aspect-[2/3] rounded-xl sm:rounded-2xl drop-shadow-md sm:drop-shadow-xl hover:scale-105 transition-transform overflow-hidden shadow-md sm:shadow-lg block bg-gray-50 border border-gray-100 relative"
          >
            <Image
              src={coverImage}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </Link>
        </div>

        {/* Book Metadata (sm:col-span-7) */}
        <div className="sm:col-span-7 flex flex-col justify-center text-left min-w-0 flex-1">
          <span className="text-[10px] sm:text-xs font-bold text-[#E52E2D] uppercase tracking-wider">
            {book.category || ""}
          </span>
          <h3 className="text-base sm:text-2xl sm:text-3xl font-serif font-black text-gray-950 mt-0.5 leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
            <Link href={targetUrl} prefetch={false}>{book.title}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium truncate">{book.author}</p>

          {/* Conditional Featured Price Rendering */}
          <div className="text-lg sm:text-2xl sm:text-3xl font-black mt-1.5 sm:mt-3 flex items-baseline justify-start gap-1.5 sm:gap-2.5 flex-wrap">
            <span className={hasDiscount ? "text-[#E52E2D]" : "text-gray-900"}>
              {currentPrice}
            </span>
            {hasDiscount && (
              <>
                <span className="line-through text-gray-400 text-xs sm:text-sm font-normal">
                  {formattedOrig}
                </span>
                <span className="bg-red-50 text-[#E52E2D] font-bold text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-md border border-red-100 uppercase tracking-wide">
                  HEMAT {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Catatan Kurator (Curator Note Quote Box) */}
          <div className="bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl sm:rounded-r-2xl p-2.5 sm:p-4 mt-2.5 sm:mt-4 text-xs sm:text-sm text-gray-800 italic leading-relaxed text-left">
            <span className="not-italic font-bold text-amber-700 block text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5 sm:mb-1">
              Catatan Kurator
            </span>
            <p className="line-clamp-2 sm:line-clamp-3">
              &quot;{book.synopsis || "Karya literasi luar biasa yang menawarkan wawasan mendalam dan perspektif baru bagi pembaca."}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Integrated Synchronized Timer & Action Bottom Bar */}
      <div className="mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        {hasDiscount && (
          <div className="flex-1 min-w-0">
            <PromoStockBar
              timeLeft={countdown.hasMounted ? (countdown.isForever ? "Promo Berkelanjutan" : countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
              stockLabel="Promo Kurator"
              progressPercent={50}
              theme="light"
            />
          </div>
        )}

        <Link
          href={targetUrl}
          prefetch={false}
          className="w-full sm:w-auto self-end px-6 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer group/btn"
        >
          <span>Lihat Detail Buku</span>
          <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>

    </div>
  );
}

/** 
 * SIDE CURATED CARD ITEM (Right Column lg:col-span-5)
 * Clean white cards with thumbnail, discount badge, red price & minimalist timer/stock bar
 */
function RightHorizontalCard({ book }: { book: Book }) {
  const countdown = useCountdown(book.promo_end_date || undefined);
  const priceInfo = getEffectiveBookPrice(book);
  const hasDiscount = priceInfo.isPromo;
  const formattedOrig = priceInfo.originalPrice;
  const formattedPromo = priceInfo.promoPrice;
  const currentPrice = priceInfo.displayPrice;
  const discountPercent = priceInfo.discountPercentage || 0;

  const coverImage = book.coverUrl || book.cover_url || "/logo500x200_1.png";

  const bookIdentifier = book.id || book.slug || "";
  const targetUrl = bookIdentifier ? `/katalog/detail?id=${bookIdentifier}` : "/katalog";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all group relative overflow-hidden h-full flex-1">
      {/* Top Right Discount Badge Overlay */}
      {hasDiscount && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
          -{discountPercent}%
        </span>
      )}

      {/* Top Content: Thumbnail & Details */}
      <Link href={targetUrl} prefetch={false} className="flex items-center gap-4 group/item">
        {/* Thumbnail */}
        <div className="w-20 aspect-[2/3] rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 relative group-hover/item:scale-105 transition-transform block">
          <Image
            src={coverImage}
            alt={book.title}
            fill
            sizes="80px"
            loading="lazy"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center pr-10 sm:pr-12">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-xs font-bold text-[#E52E2D] uppercase tracking-wider truncate">
              {book.category || "LITERASI"}
            </span>
          </div>

          <h4 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover/item:text-[#E52E2D] transition-colors leading-snug">
            {book.title}
          </h4>
          <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>

          <div className={`text-sm sm:text-base font-black mt-1.5 flex items-baseline gap-2 ${hasDiscount ? "text-[#E52E2D]" : "text-gray-900"}`}>
            <span>{currentPrice}</span>
            {hasDiscount && (
              <span className="line-through text-gray-400 text-xs font-normal">
                {formattedOrig}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Bottom Container: Timer/Stock Bar (if promo) + Action Button on small screens */}
      <div className="mt-3 flex flex-col justify-end">
        {/* Standardized Stock & Timer Bar */}
        {hasDiscount && (
          <div className="pt-2 border-t border-gray-100/80">
            <PromoStockBar
              timeLeft={countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
              stockLabel="Stok Terbatas"
              progressPercent={50}
              theme="light"
            />
          </div>
        )}

        {/* Action Button: Red background with white font, shown on small screens / mobile */}
        <Link
          href={targetUrl}
          prefetch={false}
          className="mt-3 block lg:hidden w-full text-center py-2 px-3 bg-[#E53935] hover:bg-[#C12A26] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          LIHAT DETAIL
        </Link>
      </div>
    </div>
  );
}

export default function RecommendedSection({
  books = [],
  title = "Koleksi Pilihan Editor",
}: RecommendedSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState<Book[]>(books || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRecommendedItems(books);
    if (books.length > 0) setLoading(false);
  }, [books]);

  // Client-side revalidation on mount
  useEffect(() => {
    async function loadLatestRecommended() {
      try {
        const freshRec = await getRecommendedBooks();
        if (freshRec && freshRec.length > 0) {
          setRecommendedItems(freshRec);
        } else {
          const freshNew = await getNewBooks();
          if (freshNew && freshNew.length > 0) {
            setRecommendedItems(freshNew.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error revalidating recommended books on mount:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLatestRecommended();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!mounted || loading) {
    return (
      <section className="w-full py-8 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-8 bg-gray-200 rounded-full w-48 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 aspect-[4/3] bg-gray-100 rounded-3xl animate-pulse" />
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const safeRecItems = Array.isArray(recommendedItems) ? recommendedItems : [];
  if (safeRecItems.length === 0) return null;

  const featured = safeRecItems[0];
  const rightBooks = safeRecItems.slice(1, 4);

  return (
    <section className="w-full py-8 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200/80 gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] mb-1">
              <Star size={13} fill="currentColor" className="text-[#E52E2D]" />
              PILIHAN EDITOR
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
              Buku-buku terbaik kurasi editor pilihan bulan ini.
            </p>
          </div>
          <Link
            href="/katalog?category=rekomendasi"
            className="group inline-flex items-center gap-1 text-xs font-bold text-gray-950 hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-2xs hover:shadow-xs shrink-0"
          >
            <span>Lihat Semua</span>
            <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
          </Link>
        </div>

        {/* 2-Column Grid (Desktop) & Horizontal Scroll Snap Carousel (Mobile) — items-stretch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Featured Editorial Card */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full">
            {featured && <FeaturedHeroCard book={featured} />}
          </div>

          {/* Right Column: 3 Side Curated Cards */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col h-full">
            
            {/* Header / Control Row on Mobile */}
            <div className="flex items-center justify-between mt-2 mb-3 px-1 lg:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Buku Pilihan Lainnya
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  aria-label="Previous books"
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:text-[#E52E2D] hover:border-red-200 active:scale-95 shadow-2xs transition-all cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  aria-label="Next books"
                  className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:text-[#E52E2D] hover:border-red-200 active:scale-95 shadow-2xs transition-all cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Smooth Carousel Wrapper */}
            <div
              ref={scrollRef}
              className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-4 pt-1 pb-4 lg:py-0 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 h-full"
            >
              {rightBooks.map((book) => (
                <div
                  key={book.id}
                  className="min-w-[85vw] sm:min-w-[320px] lg:min-w-0 flex-1 flex-shrink-0 snap-center h-full flex flex-col"
                >
                  <RightHorizontalCard book={book} />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
