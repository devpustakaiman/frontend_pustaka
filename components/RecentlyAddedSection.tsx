"use client";

import Link from "next/link";
import { Sparkle, ChevronRight, ChevronLeft } from "lucide-react";
import { Book } from "./BookGrid";
import { useScrollCarousel } from "./ScrollCarousel";

interface RecentlyAddedSectionProps {
  books?: Book[];
}

function formatPrice(price: string | number | undefined): string | null {
  if (price === null || price === undefined || price === "") return null;
  if (typeof price === "number") return `Rp ${price.toLocaleString("id-ID")}`;
  return String(price);
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
            {books.map((book, idx) => {
              const price = formatPrice(book.price);
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={book.id}
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
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#B67A2D] text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow">
                      Baru
                    </span>
                  </Link>

                  {/* Card body */}
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-[#B67A2D] uppercase tracking-wider">
                      {book.category || "Literasi"}
                    </span>
                    <h3 className="font-serif font-bold text-[13px] text-[#272522] mt-1 leading-snug line-clamp-2 group-hover:text-[#B67A2D] transition-colors">
                      <Link href={`/katalog/${book.id}`}>{book.title}</Link>
                    </h3>
                    <p className="text-[11px] text-[#76716A] mt-0.5 truncate">{book.author}</p>

                    <div className="mt-3 pt-2.5 border-t border-[#E7E1D8]">
                      {price ? (
                        <span className="font-bold text-[#B67A2D] text-sm block">{price}</span>
                      ) : (
                        <span className="text-xs text-[#76716A] italic">Hubungi Kami</span>
                      )}
                      <Link
                        href={`/katalog/${book.id}`}
                        className="mt-2 w-full block text-center px-2 py-1.5 text-[11px] font-semibold bg-[#F1E8D8] hover:bg-[#B67A2D] rounded-md text-[#B67A2D] hover:text-white transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#B67A2D] uppercase tracking-wide"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
