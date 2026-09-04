"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Tag,
  BookOpen,
  Truck,
} from "lucide-react";

import { SiteSettings } from "@/lib/api";

interface HeroBannerProps {
  settings?: SiteSettings | null;
  featuredBook?: any;
}

/** Helper to format price as Rp135.150 */
function formatDisplayPrice(price?: number | string | null): string {
  if (!price && price !== 0) return "Rp135.150";
  const num =
    typeof price === "number"
      ? price
      : parseInt(String(price).replace(/[^\d]/g, ""), 10);
  if (isNaN(num) || num <= 0) return "Rp135.150";
  return `Rp${num.toLocaleString("id-ID")}`;
}

/** Fallback parser if custom CMS headline is provided */
function renderParsedHeadline(headlineText: string) {
  if (!headlineText) return null;
  const words = headlineText.trim().split(/\s+/);

  if (words.length <= 1) {
    return (
      <span className="italic font-serif text-[#c12a26]">
        {headlineText}
      </span>
    );
  }

  const bermaknaIndex = words.findIndex((w) =>
    w.toLowerCase().includes("bermakna")
  );
  const highlightIndex = bermaknaIndex !== -1 ? bermaknaIndex : 1;

  const before = words.slice(0, highlightIndex).join(" ");
  const target = words[highlightIndex];
  const after = words.slice(highlightIndex + 1).join(" ");

  return (
    <>
      {before && <span className="block whitespace-nowrap">{before}</span>}
      <span className="block">
        <span className="italic font-serif text-[#c12a26]">{target}</span>
      </span>
      {after && <span className="block whitespace-nowrap">{after}</span>}
    </>
  );
}

export default function HeroBanner({ settings, featuredBook }: HeroBannerProps) {
  const headline = settings?.hero_headline || "Temukan Bacaan Bermakna untuk Jiwa";
  const subheadline =
    settings?.hero_subheadline ||
    "Menghadirkan karya-karya pemikiran, spiritualitas, sejarah, dan literasi bermutu untuk mencerdaskan serta menutrisi kedalaman batin pembaca.";

  // Book data for the Floating Card ('Pilihan Minggu Ini')
  const cardBook =
    featuredBook ||
    settings?.featured_book || {
      id: "c19f82ce-48ec-4b56-8af2-381c54134f61",
      title: "Filsafat Literasi Islam",
      author: "Prof. Dr. M. Quraish Shihab",
      price: 135150,
    };

  const effectivePrice =
    cardBook.is_promo && cardBook.promo_price
      ? cardBook.promo_price
      : cardBook.price || 135150;
  const formattedPrice = formatDisplayPrice(effectivePrice);

  const isDefaultHeadline =
    headline.trim().toLowerCase() === "temukan bacaan bermakna untuk jiwa";

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-16 lg:pb-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Text, CTAs, Categories */}
          <div className="w-full lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 space-y-6 z-10">
            {/* Top Badge: Solid Red Pill */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E52E2D] text-white text-xs font-semibold shadow-sm">
              <span>★</span>
              <span>PILIHAN UNTUKMU</span>
            </div>

            {/* 3-Line Headline Structure */}
            <h1 className="text-3xl sm:text-4xl lg:text-[54px] xl:text-[62px] font-serif font-bold tracking-tight leading-[1.2] lg:leading-[1.22] text-[#272522]">
              {isDefaultHeadline ? (
                <>
                  <span className="block whitespace-nowrap">Temukan Bacaan</span>
                  <span className="block">
                    <span className="italic font-serif text-[#c12a26] inline-block py-1">Bermakna</span>
                  </span>
                  <span className="block whitespace-nowrap">untuk Jiwa</span>
                </>
              ) : (
                renderParsedHeadline(headline)
              )}
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-base md:text-lg text-[#76716A] leading-relaxed max-w-md lg:max-w-lg font-sans">
              {subheadline}
            </p>

            {/* Action Buttons (CTA) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-1 w-full sm:w-auto">
              <Link
                href="/katalog"
                className="bg-[#E52E2D] hover:bg-[#c92423] text-white font-bold px-7 py-3.5 rounded-xl shadow-md uppercase text-sm tracking-wide inline-flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>JELAJAHI KOLEKSI</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <Link
                href="/katalog?filter=buku-baru"
                className="bg-white border-2 border-[#E52E2D] text-[#E52E2D] hover:bg-red-50 font-bold px-7 py-3.5 rounded-xl uppercase text-sm tracking-wide inline-flex items-center justify-center transition-all active:scale-98"
              >
                BUKU TERBARU
              </Link>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <Link
                href="/katalog?category=Fiksi+-+Romansa"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-100 hover:bg-rose-100 transition-colors shadow-2xs"
              >
                <span>❤️</span>
                <span>Romansa</span>
              </Link>
              <Link
                href="/katalog?category=Agama+%26+Filsafat+-+Agama+Islam"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-100 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <span>📖</span>
                <span>Agama & Filsafat</span>
              </Link>
              <Link
                href="/katalog?category=Buku+Anak+-+Cerita+Anak"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-100 hover:bg-cyan-100 transition-colors shadow-2xs"
              >
                <span>🧒</span>
                <span>Buku Anak</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="w-full lg:col-span-6 flex justify-center items-center relative order-2 mt-4 lg:mt-0 pt-6 lg:pt-0">
            <div className="relative w-full max-w-[360px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[750px] mx-auto flex items-center justify-center">
              
              {/* Illustration / Image Visual */}
              {settings?.hero_banner_url ? (
                <Image
                  src={settings.hero_banner_url}
                  alt={headline}
                  width={750}
                  height={500}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 750px"
                  priority
                  loading="eager"
                  style={{ height: "auto" }}
                  className="w-full object-contain scale-100 lg:scale-105 xl:scale-110 origin-center transition-transform duration-300"
                />
              ) : (
                <div className="relative flex items-center justify-center gap-3 sm:gap-6 w-full scale-100 lg:scale-105 xl:scale-110">
                  {/* Fallback Arch 1 */}
                  <div className="w-1/3 rounded-t-full rounded-b-xl bg-gray-50 p-3 sm:p-4 border border-gray-100 transform -rotate-6 translate-y-6">
                    <div className="bg-white rounded-t-full rounded-b-lg p-2.5 sm:p-3 border border-gray-100 flex flex-col items-center text-center space-y-3">
                      <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#C12A26] to-[#E52E2D] flex items-center justify-center text-white font-serif font-bold text-xl">
                        PI
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#E52E2D] tracking-wider block">
                          Tasawuf
                        </span>
                        <h4 className="font-serif text-xs font-bold text-[#272522] line-clamp-1">
                          Lentera Hati
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Fallback Arch 2 */}
                  <div className="w-1/3 rounded-t-full rounded-b-xl bg-gray-50 p-4 sm:p-5 border border-gray-100 z-10 transform -translate-y-2">
                    <div className="bg-white rounded-t-full rounded-b-lg p-3 sm:p-4 border border-gray-100 flex flex-col items-center text-center space-y-3">
                      <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#272522] to-[#E52E2D] flex flex-center items-center justify-center text-white font-serif font-bold text-2xl">
                        PI
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#E52E2D] tracking-widest block">
                          Pilihan Editor
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#272522] line-clamp-1">
                          Kedalaman Hikmah
                        </h4>
                        <p className="text-[10px] text-[#76716A] line-clamp-1">
                          M. Quraish Shihab
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fallback Arch 3 */}
                  <div className="w-1/3 rounded-t-full rounded-b-xl bg-gray-50 p-3 sm:p-4 border border-gray-100 transform rotate-6 translate-y-6">
                    <div className="bg-white rounded-t-full rounded-b-lg p-2.5 sm:p-3 border border-gray-100 flex flex-col items-center text-center space-y-3">
                      <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#76716A] to-[#C12A26] flex items-center justify-center text-white font-serif font-bold text-xl">
                        PI
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#E52E2D] tracking-wider block">
                          Filsafat
                        </span>
                        <h4 className="font-serif text-xs font-bold text-[#272522] line-clamp-1">
                          Cinta & Akal
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Price Badge ('Pilihan Minggu Ini') */}
              {cardBook && (
                <Link
                  href={`/katalog/${cardBook.id}`}
                  className="absolute -bottom-4 right-2 sm:right-6 md:right-10 lg:right-4 z-20 max-w-[180px] sm:max-w-[210px] p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl bg-white/95 backdrop-blur-md border border-gray-100 text-left hover:scale-105 transition-all duration-300 group block"
                >
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[#E52E2D] tracking-wider block mb-1">
                    ★ PILIHAN MINGGU INI
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#272522] line-clamp-1 group-hover:text-[#E52E2D] transition-colors">
                    {cardBook.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#76716A] line-clamp-1 mb-1.5">
                    {cardBook.author}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                    <span className="text-[10px] sm:text-xs text-[#76716A] font-semibold flex items-center gap-0.5 sm:gap-1">
                      <span className="text-amber-500">★</span> 4.9
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#E52E2D] tracking-tight">
                      {formattedPrice}
                    </span>
                  </div>
                </Link>
              )}

            </div>
          </div>

        </div>

        {/* Responsive Trust Badges Bar (Bottom of Hero) */}
        <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 sm:p-6 mx-auto mt-12 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-xs">
          {/* Item 1: BUKU PILIHAN */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200/80 text-pink-600 flex items-center justify-center shadow-xs shrink-0">
              <Award size={26} strokeWidth={2.2} className="text-pink-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#272522]">
                BUKU PILIHAN
              </h4>
              <p className="text-xs text-[#76716A] mt-0.5 leading-relaxed">
                Kurasi terbaik untuk bacaan bermakna.
              </p>
            </div>
          </div>

          {/* Item 2: PROMO MINGGUAN */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <Tag size={26} strokeWidth={2.2} className="text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#272522]">
                PROMO MINGGUAN
              </h4>
              <p className="text-xs text-[#76716A] mt-0.5 leading-relaxed">
                Penawaran spesial minggu ini, jangan terlewat!
              </p>
            </div>
          </div>

          {/* Item 3: BERAGAM GENRE */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 border border-teal-200/80 text-teal-600 flex items-center justify-center shadow-xs shrink-0">
              <BookOpen size={26} strokeWidth={2.2} className="text-teal-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#272522]">
                BERAGAM GENRE
              </h4>
              <p className="text-xs text-[#76716A] mt-0.5 leading-relaxed">
                Temukan bacaan dari berbagai genre favoritmu.
              </p>
            </div>
          </div>

          {/* Item 4: PENGIRIMAN NASIONAL */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-xs shrink-0">
              <Truck size={26} strokeWidth={2.2} className="text-rose-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#272522]">
                PENGIRIMAN NASIONAL
              </h4>
              <p className="text-xs text-[#76716A] mt-0.5 leading-relaxed">
                Kirim ke seluruh Indonesia dengan aman & cepat.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
