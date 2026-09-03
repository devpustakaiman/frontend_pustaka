"use client";

import Link from "next/link";
import { Star, ChevronRight, Bookmark, Clock } from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";

interface RecommendedSectionProps {
  books?: Book[];
  title?: string;
}

/** 
 * MAIN FEATURED EDITORIAL CARD (Left Column lg:col-span-7)
 * Premium Gold & Signature Red theme, Gold Curator Note Box, Discount Badge & Integrated Synchronized Timer Bar
 */
function FeaturedHeroCard({ book }: { book: Book }) {
  const countdown = useCountdown();
  const hasDiscount = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const currentPrice = hasDiscount ? formattedPromo : formattedOrig;

  const numPrice = Number(book.price) || 0;
  const numPromo = Number(book.promo_price) || 0;
  const discountPercent = hasDiscount && numPrice > 0 && numPromo > 0
    ? Math.round(((numPrice - numPromo) / numPrice) * 100)
    : 0;

  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="relative bg-white border border-amber-200/80 ring-1 ring-amber-400/20 rounded-3xl p-6 sm:p-8 shadow-[0_12px_32px_-12px_rgba(217,119,6,0.12)] flex flex-col justify-between h-full group">
      
      {/* Header & Badge */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm inline-flex items-center gap-1.5">
          <Star size={12} fill="currentColor" className="text-white" />
          <span>★ PILIHAN EDITOR</span>
        </span>
        <Bookmark size={20} className="text-amber-500 fill-amber-500" />
      </div>

      {/* Center Showcase: 2-column layout inside */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-4 flex-1">
        {/* Book Cover (sm:col-span-5) */}
        <div className="sm:col-span-5 flex justify-center">
          <Link
            href={`/katalog/${book.id}`}
            className="w-full max-w-[220px] mx-auto rounded-2xl drop-shadow-xl hover:scale-105 transition-transform overflow-hidden shadow-lg block bg-gray-50 border border-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={book.title}
              className="w-full h-auto object-cover"
            />
          </Link>
        </div>

        {/* Book Metadata (sm:col-span-7) */}
        <div className="sm:col-span-7 flex flex-col justify-center text-center sm:text-left min-w-0">
          <span className="text-xs font-bold text-[#E52E2D] uppercase tracking-wider">
            {book.category || "PEMIKIRAN ISLAM"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-black text-gray-950 mt-1 leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-sm text-gray-600 mt-1 font-medium truncate">{book.author}</p>

          {/* Conditional Featured Price Rendering */}
          <div className="text-2xl sm:text-3xl font-black mt-3 flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
            <span className={hasDiscount ? "text-[#E52E2D]" : "text-gray-900"}>
              {currentPrice}
            </span>
            {hasDiscount && (
              <>
                <span className="line-through text-gray-400 text-sm font-normal">
                  {formattedOrig}
                </span>
                <span className="bg-red-50 text-[#E52E2D] font-bold text-xs px-2.5 py-0.5 rounded-md border border-red-100 uppercase tracking-wide">
                  HEMAT {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Catatan Kurator (Curator Note Quote Box) */}
          <div className="bg-amber-50/70 border-l-4 border-amber-500 rounded-r-2xl p-4 mt-4 text-xs sm:text-sm text-gray-800 italic leading-relaxed text-left">
            <span className="not-italic font-bold text-amber-700 block text-[11px] uppercase tracking-wider mb-1">
              Catatan Kurator
            </span>
            <p className="line-clamp-3">
              &quot;{book.synopsis || "Karya literasi luar biasa yang menawarkan wawasan mendalam dan perspektif baru bagi pembaca."}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Integrated Synchronized Timer & Action Bottom Bar (Conditional on hasDiscount) */}
      <div className="mt-6 pt-4 border-t border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {hasDiscount ? (
          <>
            {/* Left: Timer & Stock Progress Bar */}
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-gray-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#E52E2D]" />
                  Sisa Waktu: <strong className="text-gray-900 font-extrabold whitespace-nowrap">{countdown.formatted || "Promo Berakhir"}</strong>
                </span>
                <span className="text-[11px] font-bold text-[#E52E2D] bg-red-50 px-2 py-0.5 rounded">
                  Promo Kurator
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-[#E52E2D] h-full w-[65%] rounded-full" />
              </div>
            </div>

            {/* Right: CTA Button */}
            <Link
              href={`/katalog/${book.id}`}
              className="bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap text-sm group/btn"
            >
              <span>Lihat Detail Buku</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </>
        ) : (
          <Link
            href={`/katalog/${book.id}`}
            className="w-full bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm group/btn"
          >
            <span>Lihat Detail Buku</span>
            <span className="group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        )}
      </div>

    </div>
  );
}

/** 
 * SIDE CURATED CARD ITEM (Right Column lg:col-span-5)
 * Clean white cards with thumbnail, discount badge, red price & minimalist timer/stock bar
 */
function RightHorizontalCard({ book }: { book: Book }) {
  const countdown = useCountdown();
  const hasDiscount = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const currentPrice = hasDiscount ? formattedPromo : formattedOrig;

  const numPrice = Number(book.price) || 0;
  const numPromo = Number(book.promo_price) || 0;
  const discountPercent = hasDiscount && numPrice > 0 && numPromo > 0
    ? Math.round(((numPrice - numPromo) / numPrice) * 100)
    : 0;

  const coverImage =
    book.coverUrl ||
    book.cover_url ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all group relative overflow-hidden h-full flex-1">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <Link
          href={`/katalog/${book.id}`}
          className="w-20 h-28 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 block group-hover:scale-105 transition-transform relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-[#E52E2D] uppercase tracking-wider truncate">
              {book.category || "LITERASI"}
            </span>
            {hasDiscount && (
              <span className="bg-red-50 text-[#E52E2D] font-bold text-[10px] px-1.5 py-0.5 rounded border border-red-100 shrink-0">
                -{discountPercent}%
              </span>
            )}
          </div>

          <h4 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors mt-0.5 leading-snug">
            <Link href={`/katalog/${book.id}`}>{book.title}</Link>
          </h4>
          <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>

          <div className={`text-sm sm:text-base font-black mt-1 flex items-baseline gap-2 ${hasDiscount ? "text-[#E52E2D]" : "text-gray-900"}`}>
            <span>{currentPrice}</span>
            {hasDiscount && (
              <span className="line-through text-gray-400 text-xs font-normal">
                {formattedOrig}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Minimalist Stock & Timer Bar under price (Conditional on hasDiscount) */}
      {hasDiscount && (
        <div className="mt-2.5 pt-2 border-t border-gray-100/80">
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E52E2D]" /> {countdown.formatted || "Promo Berakhir"}
            </span>
            <span className="text-red-500 font-semibold text-[10px]">Stok Terbatas</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#E52E2D] h-full w-[45%] rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecommendedSection({
  books = [],
  title = "Koleksi Pilihan Editor",
}: RecommendedSectionProps) {
  if (!books || books.length === 0) return null;

  const featured = books[0];
  const rightBooks = books.slice(1, 4);

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
          <div className="lg:col-span-5 xl:col-span-5 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-4 pt-2 pb-4 lg:py-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 h-full">
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
    </section>
  );
}
