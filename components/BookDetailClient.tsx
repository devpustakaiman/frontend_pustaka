"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import BookGrid, { Book } from "./BookGrid";

interface BookDetailClientProps {
  book: {
    id: string | number;
    title: string;
    author: string;
    category?: string;
    synopsis?: string;
    coverUrl?: string;
    cover_url?: string;
    price?: string | number;
    pdfPreviewUrl?: string;
    pdf_preview_url?: string;
    mizanstoreUrl?: string;
    mizanstore_url?: string;
  };
  relatedBooks?: Book[];
}

export default function BookDetailClient({ book, relatedBooks = [] }: BookDetailClientProps) {
  const mainCover = book.coverUrl || book.cover_url || "";
  const pdfUrl = book.pdfPreviewUrl || book.pdf_preview_url;
  const mizanUrl = book.mizanstoreUrl || book.mizanstore_url || "https://www.mizanstore.com";

  // Gallery state: mock 4 thumbnails derived from cover or placeholders
  const galleryImages = [
    mainCover,
    mainCover,
    mainCover,
    mainCover,
  ];

  const [activeImage, setActiveImage] = useState<string>(mainCover);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);

  const formattedPrice = book.price
    ? typeof book.price === "number"
      ? `Rp ${book.price.toLocaleString("id-ID")}`
      : String(book.price)
    : "Rp 95.000";

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 text-[#272522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Navigation */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#272522] bg-white border border-[#EAE5D9] rounded-full hover:bg-white/80 hover:border-[#B67A2D]/40 shadow-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Top Section: 2 Columns Above the Fold */}
        <div className="bg-white border border-[#EAE5D9] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Book Cover + Multi-Image Gallery */}
            <div className="md:col-span-5 space-y-4">
              {/* Main Active Cover Image */}
              <div className="w-full aspect-[3/4] bg-[#F1E8D8] rounded-xl border border-[#EAE5D9] overflow-hidden shadow flex items-center justify-center relative group">
                {activeImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-6 text-center text-[#76716A] text-sm font-semibold">
                    Sampul Tidak Tersedia
                  </div>
                )}
              </div>

              {/* Multi-Image Gallery UI (4 Thumbnails) */}
              <div>
                <p className="text-[11px] font-semibold text-[#76716A] uppercase tracking-wider mb-2">
                  Galeri Sampul & Detail
                </p>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => {
                    const isSelected = activeImage === img && idx === 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        type="button"
                        className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-[#D32F2F] ring-2 ring-[#D32F2F]/20 shadow-md scale-105"
                            : "border-[#EAE5D9] hover:border-[#B67A2D]/60 opacity-80 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${book.title} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Book Details & Prominent CTA Immediately Below Price */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-[#FAF8F3] border border-[#EAE5D9] text-xs font-bold text-[#D32F2F] rounded-md uppercase tracking-wider">
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
              <div className="bg-[#FAF8F3] border border-[#EAE5D9] rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-xs text-[#76716A] uppercase font-bold tracking-wider block mb-1">
                    Harga Resmi
                  </span>
                  <span className="text-3xl font-black text-[#D32F2F]">
                    {formattedPrice}
                  </span>
                </div>

                {/* Immediately Below Price: Beli di Mizanstore Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={mizanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-center"
                  >
                    <span>Beli di Mizanstore</span>
                    <ExternalLink size={16} strokeWidth={1.5} />
                  </a>

                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-white hover:bg-gray-50 border border-[#EAE5D9] text-[#272522] font-semibold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm text-center"
                    >
                      <BookOpen size={16} strokeWidth={1.5} className="text-[#B67A2D]" />
                      <span>Pratinjau Bab 1</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Synopsis Section with Toggle */}
              {book.synopsis && (
                <div className="border-t border-[#EAE5D9] pt-5 space-y-3">
                  <h2 className="font-serif text-xl font-bold text-[#272522]">Sinopsis Buku</h2>
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D32F2F] hover:underline focus:outline-none pt-1"
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
          <div className="border-b border-[#EAE5D9] pb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#272522]">Buku Terkait</h2>
            <Link
              href="/katalog"
              className="text-xs font-bold text-[#D32F2F] hover:underline"
            >
              Lihat Seluruh Katalog &rarr;
            </Link>
          </div>

          <BookGrid books={relatedBooks.slice(0, 4)} />
        </div>

      </div>
    </div>
  );
}
