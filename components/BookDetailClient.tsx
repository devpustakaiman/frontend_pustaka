"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, BookOpen, Clock, Tag } from "lucide-react";
import BookGrid from "./BookGrid";
import { Book, formatBookPrice, isActivePromo, getPromoDaysRemaining } from "@/lib/utils";

interface BookDetailClientProps {
  book: Book;
  relatedBooks?: Book[];
}

export default function BookDetailClient({ book, relatedBooks = [] }: BookDetailClientProps) {
  const mainCover = book.cover_url || book.coverUrl || "/placeholder-book.png";
  const pdfUrl = book.pdfPreviewUrl || book.pdf_preview_url;
  const mizanUrl = book.mizanstoreUrl || book.mizanstore_url || "https://www.mizanstore.com";

  // Support all possible gallery column names from Supabase
  const rawGallery = Array.isArray(book.gallery_urls) && book.gallery_urls.length > 0
    ? book.gallery_urls
    : Array.isArray(book.gallery_images) && book.gallery_images.length > 0
    ? book.gallery_images
    : Array.isArray(book.galleryUrls) && book.galleryUrls.length > 0
    ? book.galleryUrls
    : Array.isArray(book.galleryImages) && book.galleryImages.length > 0
    ? book.galleryImages
    : [book.gallery_url_1, book.gallery_url_2, book.gallery_url_3, book.gallery_url_4].filter(
        (url): url is string => typeof url === "string" && url.trim().length > 0
      );

  // Combine cover and gallery items, filter nulls/empties, and remove duplicates
  const allImages = Array.from(
    new Set([mainCover, ...rawGallery].filter((img): img is string => typeof img === "string" && img.trim().length > 0))
  );

  const [activeImage, setActiveImage] = useState<string>(mainCover);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (mainCover) {
      setActiveImage(mainCover);
    }
  }, [book, mainCover]);

  // Active promo calculations
  const hasActivePromo = isActivePromo(book);
  const formattedOriginalPrice = formatBookPrice(book.price);
  const formattedPromoPrice = formatBookPrice(book.promo_price);
  const daysRemaining = getPromoDaysRemaining(book.promo_end_date);

  let discountPct = book.promo_percentage;
  if (!discountPct && hasActivePromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="bg-white min-h-screen py-10 text-[#272522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Navigation */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Top Section: 2 Columns Above the Fold */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Book Cover + Multi-Image Gallery */}
            <div className="md:col-span-5 space-y-4">
              {/* Main Active Cover Image Showcase */}
              <div className="relative w-full aspect-[3/4] max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-xl bg-gray-50 flex items-center justify-center p-4">
                {activeImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeImage}
                    alt={book.title}
                    className="w-full h-full object-contain drop-shadow-md transition-all duration-300"
                  />
                ) : (
                  <div className="p-6 text-center text-[#76716A] text-sm font-semibold">
                    Sampul Tidak Tersedia
                  </div>
                )}
                {hasActivePromo && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-[#E52E2D] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      <Tag size={13} />
                      <span>PROMO</span>
                      {discountPct && <span>-{discountPct}%</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Multi-Image Gallery Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="mt-4">
                  <p className="text-[11px] font-bold text-[#76716A] uppercase tracking-wider mb-2">
                    PRATINJAU SAMPUL & DETAIL GALERI
                  </p>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-gray-50 cursor-pointer ${
                          activeImage === imgUrl
                            ? "border-[#E52E2D] ring-2 ring-red-200 shadow-sm scale-105"
                            : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`${book.title} preview ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Book Details & Prominent Pricing / CTA */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-red-50 border border-red-200/60 text-xs font-bold text-[#E52E2D] rounded-full uppercase tracking-wider">
                  {book.category || "Literasi Utama"}
                </span>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] leading-tight">
                  {book.title}
                </h1>

                <p className="text-sm text-[#76716A]">
                  Penulis: <span className="text-[#272522] font-semibold text-base">{book.author}</span>
                </p>
              </div>

              {/* Price & CTA Section (Instant Visibility Above Fold) */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                
                {/* FOMO Countdown Banner if Promo Active */}
                {hasActivePromo && (
                  <div className="bg-red-50/80 border border-red-200/70 rounded-xl p-3 flex items-center gap-2.5 text-red-950 text-xs sm:text-sm font-semibold shadow-2xs">
                    <span className="text-lg animate-bounce">🔥</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-[#E52E2D] flex-shrink-0" />
                      <span>
                        {daysRemaining > 1
                          ? `Promo berakhir dalam ${daysRemaining} hari`
                          : "Promo berakhir hari ini!"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Pricing UI */}
                <div>
                  <span className="text-xs text-[#76716A] uppercase font-bold tracking-wider block mb-1">
                    {hasActivePromo ? "Harga Promo Spesial" : "Harga Resmi Publisher"}
                  </span>
                  
                  {hasActivePromo ? (
                    <div className="flex items-baseline flex-wrap gap-2.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#E52E2D]">
                        {formattedPromoPrice}
                      </span>
                      <span className="line-through text-gray-400 text-lg font-normal">
                        {formattedOriginalPrice}
                      </span>
                      {discountPct && (
                        <span className="bg-[#E52E2D] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-3xl font-black text-[#E52E2D]">
                      {formattedOriginalPrice}
                    </span>
                  )}

                  {/* Required Price Disclaimer */}
                  <p className="text-[11px] sm:text-xs text-gray-500 italic mt-2 block leading-normal">
                    Harga estimasi. Ketersediaan dan harga final dapat berubah sewaktu-waktu mengikuti kebijakan Mizanstore.
                  </p>
                </div>

                {/* Immediately Below Price: Beli di Mizanstore Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={mizanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-center"
                  >
                    <span>Beli di Mizanstore</span>
                    <ExternalLink size={16} strokeWidth={2} />
                  </a>

                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-4 bg-white hover:bg-red-50 border border-[#E52E2D] text-[#E52E2D] font-bold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm text-center"
                    >
                      <BookOpen size={16} strokeWidth={2} className="text-[#E52E2D]" />
                      <span>Pratinjau Bab 1</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Synopsis Section with Toggle */}
              {book.synopsis && (
                <div className="border-t border-gray-200 pt-5 space-y-3">
                  <h2 className="font-serif text-xl font-bold text-[#272522]">Deskripsi Buku</h2>
                  <div className="relative">
                    <p
                      className={`text-[#272522]/90 text-sm leading-relaxed whitespace-pre-line transition-all ${
                        isSynopsisExpanded ? "" : "line-clamp-4"
                      }`}
                    >
                      {book.synopsis}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E52E2D] hover:underline focus:outline-none pt-1"
                  >
                    <span>{isSynopsisExpanded ? "Tutup" : "Lihat Selengkapnya"}</span>
                    {isSynopsisExpanded ? (
                      <ChevronUp size={14} strokeWidth={2} />
                    ) : (
                      <ChevronDown size={14} strokeWidth={2} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Books Section ('Buku Terkait') */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#272522]">
              Buku <span className="text-[#C12A26] italic font-serif">Terkait</span>
            </h2>
            <Link
              href="/katalog"
              className="text-xs font-bold text-[#E52E2D] hover:underline flex items-center gap-1"
            >
              <span>Lihat Seluruh Katalog</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <BookGrid books={relatedBooks.slice(0, 4)} />
        </div>

      </div>
    </div>
  );
}
