"use client";

import Link from "next/link";
import { TrendingUp, ChevronRight, ChevronLeft } from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { useScrollCarousel } from "./ScrollCarousel";

interface BestSellerSectionProps {
  books?: Book[];
}

function formatPrice(price: string | number | undefined): string | null {
  if (price === null || price === undefined || price === "") return null;
  if (typeof price === "number") return `Rp ${price.toLocaleString("id-ID")}`;
  return String(price);
}

export default function BestSellerSection({ books = [] }: BestSellerSectionProps) {
  const { scrollRef, canLeft, canRight, scroll } = useScrollCarousel();

  return (
    <section className="w-full bg-[#1A2B3C] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — clean, no arrows here */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-amber-400 mb-2">
              <TrendingUp size={13} strokeWidth={1.5} />
              Paling Banyak Dibaca
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Best Seller
            </h2>
          </div>
          <Link
            href="/katalog?category=bestseller"
            className="group inline-flex items-center gap-1 text-sm font-medium text-white/60 hover:text-amber-400 transition-colors mt-4 sm:mt-0"
          >
            Lihat Semua Best Seller
            <ChevronRight size={15} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel wrapper with overlay arrows */}
        {books.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">Belum ada data best seller.</p>
        ) : (
          <div className="relative">
            {/* Left arrow + dark fade */}
            <div
              className={`absolute left-0 top-0 bottom-3 z-10 flex items-center transition-opacity duration-200 ${
                canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1A2B3C] to-transparent pointer-events-none" />
              <button
                onClick={() => scroll("left")}
                aria-label="Sebelumnya"
                className="relative ml-1 w-10 h-10 rounded-full bg-white/10 border border-white/20 shadow-md flex items-center justify-center text-white hover:bg-amber-400 hover:text-[#1A2B3C] hover:border-amber-400 hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1A2B3C]"
              >
                <ChevronLeft size={17} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {books.map((book, idx) => {
                const price = formatPrice(book.price);
                const hasPromo = isActivePromo(book);
                return (
                  <div
                    key={book.id}
                    className="snap-start flex-shrink-0 w-[155px] sm:w-[185px] lg:w-[210px] bg-white rounded-xl overflow-hidden group flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Cover + badges */}
                    <div className="relative">
                      <Link
                        href={`/katalog/${book.id}`}
                        className="block overflow-hidden aspect-[3/4] bg-[#F1E8D8]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={book.coverUrl || book.cover_url || ""}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <span className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-amber-400 text-[#1A2B3C] text-[11px] font-black flex items-center justify-center shadow-lg">
                        #{idx + 1}
                      </span>
                      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold uppercase tracking-wide shadow">
                        🔥
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-3 flex flex-col flex-1">
                      <span className="text-[9px] font-bold text-[#B67A2D] uppercase tracking-wider">
                        {book.category || "Literasi"}
                      </span>
                      <h3 className="font-serif font-bold text-[13px] text-[#272522] mt-1 leading-snug line-clamp-2 group-hover:text-[#B67A2D] transition-colors flex-1">
                        <Link href={`/katalog/${book.id}`}>{book.title}</Link>
                      </h3>
                      <p className="text-[10px] text-[#76716A] mt-0.5 truncate">{book.author}</p>

                      <div className="mt-2.5 pt-2.5 border-t border-[#E7E1D8] flex items-center justify-between gap-1">
                        {hasPromo ? (
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#D32F2F] text-xs sm:text-sm leading-none">{formatBookPrice(book.promo_price)}</span>
                            <span className="line-through text-gray-400 text-[10px]">{formatBookPrice(book.price)}</span>
                          </div>
                        ) : price ? (
                          <span className="font-bold text-[#B67A2D] text-sm leading-none">{price}</span>
                        ) : (
                          <span className="text-[10px] text-[#76716A] italic">Hubungi Kami</span>
                        )}
                        <Link
                          href={`/katalog/${book.id}`}
                          className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold bg-[#1A2B3C] hover:bg-[#0F1C28] rounded-md text-white transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#B67A2D] uppercase tracking-wide"
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex-shrink-0 w-1" aria-hidden="true" />
            </div>

            {/* Right arrow + dark fade */}
            <div
              className={`absolute right-0 top-0 bottom-3 z-10 flex items-center transition-opacity duration-200 ${
                canRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#1A2B3C] to-transparent pointer-events-none" />
              <button
                onClick={() => scroll("right")}
                aria-label="Berikutnya"
                className="relative mr-1 w-10 h-10 rounded-full bg-white/10 border border-white/20 shadow-md flex items-center justify-center text-white hover:bg-amber-400 hover:text-[#1A2B3C] hover:border-amber-400 hover:shadow-lg transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#1A2B3C]"
              >
                <ChevronRight size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
