"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkle, ChevronRight, ChevronLeft } from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollCarousel } from "./ScrollCarousel";
import PromoStockBar from "./PromoStockBar";

interface RecentlyAddedSectionProps {
  books?: Book[];
}

export default function RecentlyAddedSection({ books = [] }: RecentlyAddedSectionProps) {
  const { scrollRef, scroll } = useScrollCarousel();

  if (!books || books.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#E52E2D] mb-2 px-3 py-1 bg-red-50 rounded-full border border-red-200/80">
              <Sparkle size={13} strokeWidth={2} />
              Koleksi Rilisan Terbaru
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#272522] tracking-tight">
              ✨ Buku <span className="text-[#C12A26] italic font-serif">Terbaru</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
              Temukan karya-karya pemikiran &amp; literasi bermutu paling hangat terbitan Pustaka Iman.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                aria-label="Geser ke kiri"
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#E52E2D] hover:border-red-200 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Geser ke kanan"
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#E52E2D] hover:border-red-200 flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              href="/katalog?sort=terbaru"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {books.map((book) => (
            <RecentlyAddedCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentlyAddedCard({ book }: { book: Book }) {
  const isPromo = isActivePromo(book);
  const countdown = useCountdown(book.promo_end_date || undefined);

  const numPrice = typeof book.price === "number" ? book.price : parseFloat(String(book.price || 0));
  const numPromo = typeof book.promo_price === "number" ? book.promo_price : parseFloat(String(book.promo_price || 0));

  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && isPromo && numPrice > 0 && numPromo > 0) {
    discountPct = Math.round(((numPrice - numPromo) / numPrice) * 100);
  }

  const coverImage =
    (book.coverUrl && book.coverUrl.trim().length > 0 ? book.coverUrl : null) ||
    (book.cover_url && book.cover_url.trim().length > 0 ? book.cover_url : null) ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="snap-start flex-shrink-0 w-44 sm:w-56 bg-white border border-gray-100 rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-300 h-full self-stretch">
      {/* Cover */}
      <Link
        href={`/katalog/${book.id}`}
        className="block relative overflow-hidden bg-gray-100 aspect-[2/3] rounded-t-2xl sm:rounded-2xl flex-shrink-0"
      >
        <Image
          src={coverImage}
          alt={book.title || "Cover Buku"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Left "Baru" Badge */}
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#E52E2D] text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-xs">
          Baru
        </span>

        {/* Top Right Red Discount Badge if Promo */}
        {isPromo && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-[#E53935] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
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
          {/* Price & Strikethrough */}
          <div className="min-h-[44px] flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-sm sm:text-base font-black ${isPromo ? 'text-[#E52E2D]' : 'text-gray-900'}`}>
                {isPromo ? formattedPromo : (book.price ? formatBookPrice(book.price) : "Hubungi Kami")}
              </span>
              {isPromo && discountPct ? (
                <span className="bg-red-50 text-[#E53935] border border-red-200 font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
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

          {/* Reusable Stock / Timer Progress Bar */}
          <div className="min-h-[38px] sm:min-h-[42px] flex items-center my-1.5 w-full">
            {isPromo ? (
              <PromoStockBar
                timeLeft={countdown.hasMounted ? (countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
                stockLabel="Stok Terbatas"
                progressPercent={70}
                theme="light"
              />
            ) : (
              <div className="w-full h-full invisible select-none pointer-events-none" />
            )}
          </div>

          {/* Action Button */}
          <Link
            href={`/katalog/${book.id}`}
            className="w-full bg-[#E53935] hover:bg-[#C12A26] text-white text-xs font-bold py-2 rounded-xl block text-center transition-all duration-200 active:scale-95 uppercase tracking-wider shadow-xs"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
