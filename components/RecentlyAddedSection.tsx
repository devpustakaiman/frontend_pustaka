"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkle, ChevronRight, ChevronLeft } from "lucide-react";
import { Book, formatBookPrice, isActivePromo, getEffectiveBookPrice } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScrollCarousel } from "./ScrollCarousel";
import PromoStockBar from "./PromoStockBar";
import { getNewBooks } from "@/lib/api";
import { generateSlug } from "@/lib/slugify";

interface RecentlyAddedSectionProps {
  books?: Book[];
}

export default function RecentlyAddedSection({ books = [] }: RecentlyAddedSectionProps) {
  const { scrollRef, scroll } = useScrollCarousel();
  const [mounted, setMounted] = useState(false);
  const [newItems, setNewItems] = useState<Book[]>(books || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setNewItems(books);
    if (books.length > 0) setLoading(false);
  }, [books]);

  // Client-side revalidation on mount
  useEffect(() => {
    async function loadLatestNewBooks() {
      try {
        const freshNew = await getNewBooks();
        if (freshNew && freshNew.length > 0) {
          setNewItems(freshNew);
        }
      } catch (err) {
        console.error("Error revalidating new books on mount:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLatestNewBooks();
  }, []);

  if (!mounted || loading) {
    return (
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-8 bg-gray-200 rounded-full w-48 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3 space-y-3 animate-pulse">
                <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!newItems || newItems.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E52E2D] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-100 mb-2">
              <Sparkle size={13} className="text-[#E52E2D]" />
              <span>KOLEKSI TERBARU</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#272522] tracking-tight">
              ✨ Buku <span className="text-[#E52E2D] italic font-serif">Baru Terbit</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium hidden sm:block">
              Temukan karya terbitan terbaru dari penulis pilihan Pustaka Iman
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll Kiri"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll Kanan"
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pt-3 pb-5 snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 lg:scroll-px-0 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {newItems.map((book) => (
            <NewArrivalCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivalCard({ book }: { book: Book }) {
  const priceInfo = getEffectiveBookPrice(book);
  const isPromo = priceInfo.isPromo;
  const countdown = useCountdown(book.promo_end_date || undefined);

  const formattedOrig = priceInfo.originalPrice;
  const formattedPromo = priceInfo.promoPrice;
  const discountPct = priceInfo.discountPercentage || 0;

  const coverImage =
    (book.coverUrl && book.coverUrl.trim().length > 0 ? book.coverUrl : null) ||
    (book.cover_url && book.cover_url.trim().length > 0 ? book.cover_url : null) ||
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";

  const target = book.slug || generateSlug(book.title) || book.id;
  const targetUrl = target ? `/katalog/${target}` : "/katalog";

  return (
    <div className="snap-start flex-shrink-0 w-44 sm:w-56 bg-white border border-gray-100 rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all duration-300 h-full self-stretch">
      {/* Cover */}
      <Link
        href={targetUrl}
        prefetch={false}
        className="block relative overflow-hidden bg-gray-100 aspect-[2/3] rounded-t-2xl sm:rounded-2xl flex-shrink-0"
      >
        <Image
          src={coverImage}
          alt={book.title || ""}
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
        <div className="flex flex-col gap-1">
          {/* Category: Strict 1-line truncation */}
          <span className="text-[10px] sm:text-xs font-bold text-[#E52E2D] uppercase tracking-wider truncate block">
            {book.category || ""}
          </span>

          {/* Book Title: Locked 2-line height reservation */}
          <h4
            className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2 h-9 sm:h-10 overflow-hidden"
            title={book.title}
          >
            <Link href={targetUrl} prefetch={false}>{book.title}</Link>
          </h4>

          {/* Author Name: Strict 1-line truncation */}
          <p className="text-xs text-gray-500 truncate block mt-1">
            {book.author}
          </p>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col justify-between">
          {/* Standardized Price Area: Fixed 2-row vertical stack */}
          <div className="flex flex-col min-h-[44px] justify-center mt-1.5">
            {/* Main Active / Discounted Price */}
            <span className={`text-base font-bold tracking-tight ${isPromo ? 'text-red-600' : 'text-gray-900'}`}>
              {isPromo ? formattedPromo : (book.price ? formatBookPrice(book.price) : formattedOrig)}
            </span>

            {/* Original Strikethrough Price */}
            {isPromo ? (
              <span className="text-xs text-gray-400 line-through">
                {formattedOrig}
              </span>
            ) : (
              <span className="text-xs text-transparent select-none">&#160;</span>
            )}
          </div>

          {/* Reusable Stock / Timer Progress Bar */}
          <div className="min-h-[38px] sm:min-h-[42px] flex items-center my-1.5 w-full">
            {isPromo ? (
              <PromoStockBar
                timeLeft={countdown.hasMounted ? (countdown.isForever ? "Promo Berkelanjutan" : countdown.formatted || "Promo Berakhir") : "Memuat promo..."}
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
            href={targetUrl}
            prefetch={false}
            className="w-full bg-[#E53935] hover:bg-[#C12A26] text-white text-xs font-bold py-2 rounded-xl block text-center transition-all duration-200 active:scale-95 uppercase tracking-wider shadow-xs"
          >
            LIHAT DETAIL
          </Link>
        </div>
      </div>
    </div>
  );
}
