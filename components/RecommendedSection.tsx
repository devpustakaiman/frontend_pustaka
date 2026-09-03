"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Quote,
  Timer,
  HeartHandshake,
  Tag,
  Clock,
  BookOpen,
  Users,
} from "lucide-react";
import { Book, formatBookPrice, isActivePromo } from "@/lib/utils";
import { usePromoTimer } from "@/lib/promoTimer";

interface RecommendedSectionProps {
  books?: Book[];
  title?: string;
}

/** Left Featured Hero Spotlight Card */
function FeaturedHeroCard({ book }: { book: Book }) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && hasPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="bg-[#2B161B] text-white rounded-3xl p-5 sm:p-7 relative overflow-hidden flex flex-col shadow-xl h-full group border border-red-900/30">
      {/* Ribbon */}
      <div className="absolute top-0 right-8 w-5 h-8 bg-[#E52E2D] rounded-b-md flex items-center justify-center shadow-md z-10">
        <Bookmark size={12} className="text-white fill-white" />
      </div>

      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/20 text-red-200 text-[10px] uppercase font-bold tracking-wider rounded-full mb-3 w-fit">
        <Star size={10} fill="currentColor" className="text-[#E52E2D]" />
        EDITOR&apos;S PICK
      </span>

      {/* Two-col: cover left, info right */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Cover */}
        <Link href={`/katalog/${book.id}`} className="w-24 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 block group-hover:scale-105 transition-transform duration-300 self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={book.title} className="w-full h-full object-cover aspect-[3/4]" />
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-0.5">{book.category || "ROMANSA"}</p>
            <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-red-200 transition-colors">
              <Link href={`/katalog/${book.id}`}>{book.title}</Link>
            </h3>
            <p className="text-[11px] text-white/60 mt-0.5 truncate">{book.author}</p>

            <div className="flex flex-wrap items-baseline gap-1.5 mt-2">
              <span className="font-black text-white text-sm sm:text-base tracking-tight">{formattedPromo}</span>
              <span className="line-through text-white/40 text-[10px]">{formattedOrig}</span>
              {hasPromo && (
                <span className="bg-[#E52E2D] text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">HEMAT {discountPct}%</span>
              )}
            </div>
          </div>

          {/* Editor note */}
          <div className="bg-white/5 border-l-2 border-[#E52E2D] px-2.5 py-2 rounded-r-lg">
            <div className="flex items-center gap-1 text-red-300 text-[9px] font-bold mb-0.5">
              <Quote size={9} className="fill-red-300" />
              <span>Catatan Editor</span>
            </div>
            <p className="text-[10px] text-white/80 italic leading-relaxed line-clamp-2">
              {book.synopsis || "Karya literasi yang emosional dengan penceritaan yang indah."}
            </p>
          </div>
        </div>
      </div>

      {/* Timer + CTA pinned to bottom */}
      <div className="mt-4 space-y-2">
        <div className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
          <Timer size={12} className="text-amber-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-white truncate" suppressHydrationWarning>{timer.formattedText}</span>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-[#E52E2D] to-orange-400 rounded-full transition-all duration-500" style={{ width: `${timer.progressPercent}%` }} />
            </div>
          </div>
        </div>
        <Link
          href={`/katalog/${book.id}`}
          className="w-full py-2.5 px-4 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>Lihat Detail Buku</span>
          <ChevronRight size={13} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}

/** Right Side Horizontal Card Item */
function RightHorizontalCard({ book, index }: { book: Book; index: number }) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
  const timer = usePromoTimer(book.created_at, book.promo_end_date);

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && hasPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  const pastelStyles = [
    { bg: "bg-red-50/70", catText: "text-[#E52E2D]" },
    { bg: "bg-orange-50/80", catText: "text-orange-700" },
    { bg: "bg-rose-50/70", catText: "text-rose-600" },
  ];
  const style = pastelStyles[index % pastelStyles.length];

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-3 flex items-center gap-3 hover:shadow-md hover:border-[#FCA5A5] transition-all duration-200 relative overflow-hidden group h-full">
      <span className="absolute top-2.5 right-2.5 bg-[#E52E2D] text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full z-10">-{discountPct}%</span>

      <Link href={`/katalog/${book.id}`} className={`w-16 sm:w-20 aspect-[3/4] rounded-lg ${style.bg} p-1.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverImage} alt={book.title} className="w-full h-full object-cover rounded-md shadow-sm" />
      </Link>

      <div className="flex flex-col justify-center min-w-0 flex-1 pr-4">
        <span className={`text-[9px] font-bold uppercase tracking-wider truncate ${style.catText}`}>{book.category || "LITERASI"}</span>
        <h4 className="font-serif font-bold text-xs text-[#272522] leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors mt-0.5">
          <Link href={`/katalog/${book.id}`}>{book.title}</Link>
        </h4>
        <p className="text-[10px] text-[#76716A] truncate">{book.author}</p>

        <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
          <span className="font-extrabold text-[#E52E2D] text-xs">{formattedPromo}</span>
          <span className="line-through text-gray-400 text-[10px]">{formattedOrig}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500">
          <Clock size={10} className="text-[#E52E2D] shrink-0" />
          <span className="truncate" suppressHydrationWarning>{timer.formattedText}</span>
        </div>
        <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden mt-1">
          <div className="bg-[#E52E2D] h-full rounded-full transition-all duration-500" style={{ width: `${timer.progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Mobile horizontal carousel */
function MobileRecommendedCarousel({ featured, rightBooks }: { featured: Book; rightBooks: Book[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const allBooks = [featured, ...rightBooks];

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - 16, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0, minDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(closest);
  }, []);

  return (
    <div>
      <div ref={trackRef} onScroll={handleScroll} className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
        <div className="min-w-[88vw] max-w-[360px] flex-shrink-0 snap-center"><FeaturedHeroCard book={featured} /></div>
        {rightBooks.map((book, idx) => (
          <div key={book.id} className="min-w-[82vw] max-w-[340px] flex-shrink-0 snap-center">
            <RightHorizontalCard book={book} index={idx} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <button onClick={() => scrollToIndex(Math.max(0, activeIdx - 1))} disabled={activeIdx === 0} className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#E52E2D] disabled:opacity-30 hover:bg-red-50 active:scale-95 transition-all">
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-1.5">
          {allBooks.map((_, i) => (
            <button key={i} onClick={() => scrollToIndex(i)} className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-4 h-1.5 bg-[#E52E2D]" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"}`} />
          ))}
        </div>
        <button onClick={() => scrollToIndex(Math.min(allBooks.length - 1, activeIdx + 1))} disabled={activeIdx === allBooks.length - 1} className="w-8 h-8 rounded-full bg-[#E52E2D] shadow-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-[#c12a26] active:scale-95 transition-all">
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-1">{activeIdx + 1} / {allBooks.length}</p>
    </div>
  );
}

export default function RecommendedSection({
  books = [],
  title = "Koleksi Pilihan Editor",
}: RecommendedSectionProps) {
  if (!books || books.length === 0) return null;

  const [featured, ...rest] = books;
  const rightBooks = rest.slice(0, 3);

  return (
    <section className="w-full py-8 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-xs relative overflow-hidden">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200/70 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E52E2D] mb-1">
                <Star size={12} fill="currentColor" className="text-[#E52E2D]" />
                PILIHAN EDITOR
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#272522] tracking-tight">{title}</h2>
              <p className="text-[11px] sm:text-xs text-[#76716A] mt-0.5 font-medium">
                Buku terbaik pilihan kami sebelum promonya berakhir.
              </p>
            </div>
            <Link
              href="/katalog?category=rekomendasi"
              className="group inline-flex items-center gap-1 text-xs font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-3.5 py-2 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>

          {/* MOBILE: horizontal swipe carousel */}
          <div className="lg:hidden mb-6">
            <MobileRecommendedCarousel featured={featured} rightBooks={rightBooks} />
          </div>

          {/* DESKTOP: 2-column grid */}
          <div className="hidden lg:grid grid-cols-12 gap-6 items-stretch">
            <div className="col-span-7 flex flex-col"><FeaturedHeroCard book={featured} /></div>
            <div className="col-span-5 flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#76716A] uppercase tracking-wider mb-1">
                <span className="text-[#E52E2D]">✨</span>
                <span>Pilihan Lainnya Untukmu</span>
              </div>
              {rightBooks.map((book, idx) => (
                <RightHorizontalCard key={book.id} book={book} index={idx} />
              ))}
            </div>
          </div>

          {/* Benefit bar — compact on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-5 border-t border-gray-200/70 mt-6">
            {[
              { icon: <HeartHandshake size={14} />, color: "bg-red-100/80 text-[#E52E2D]", title: "Dipilih dengan Hati", desc: "Kualitas & kedalaman nilai baca." },
              { icon: <Tag size={14} />, color: "bg-rose-100/80 text-rose-700", title: "Harga Spesial", desc: "Diskon eksklusif, berlaku terbatas." },
              { icon: <Clock size={14} />, color: "bg-orange-100/80 text-orange-700", title: "Promo Terbatas", desc: "Penawaran berlaku beberapa hari." },
              { icon: <BookOpen size={14} />, color: "bg-red-100/80 text-[#E52E2D]", title: "Beragam Genre", desc: "Dari fiksi hingga sains & pikiran." },
              { icon: <Users size={14} />, color: "bg-red-100/80 text-[#E52E2D]", title: "Semua Pembaca", desc: "Dari anak hingga dewasa.", extra: "col-span-2 md:col-span-1" },
            ].map(({ icon, color, title: t, desc, extra }, i) => (
              <div key={i} className={`flex items-start gap-2 ${extra ?? ""}`}>
                <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0 mt-0.5`}>{icon}</div>
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wide text-[#272522]">{t}</h5>
                  <p className="text-[10px] text-[#76716A] leading-normal mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
