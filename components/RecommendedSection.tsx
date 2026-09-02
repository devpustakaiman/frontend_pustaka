"use client";

import Link from "next/link";
import {
  Star,
  ChevronRight,
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
import { useCountdown } from "@/lib/hooks/useCountdown";

interface RecommendedSectionProps {
  books?: Book[];
  title?: string;
}

/** Left Featured Hero Spotlight Card (Dark Burgundy Magazine Spotlight) */
function FeaturedHeroCard({ book }: { book: Book }) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
  const timer = useCountdown(book.promo_end_date);

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && hasPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  return (
    <div className="bg-[#341822] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl h-full group">
      {/* Top Right Ribbon Bookmark Accent */}
      <div className="absolute top-0 right-8 w-6 h-10 bg-[#B67A2D] rounded-b-md flex items-center justify-center shadow-md z-10">
        <Bookmark size={14} className="text-white fill-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 z-10">
        {/* Left: Book Cover Image & CTA Button */}
        <div className="md:col-span-5 flex flex-col items-center">
          <Link
            href={`/katalog/${book.id}`}
            className="w-full aspect-[3/4] max-w-[210px] bg-[#1A0B11] rounded-xl overflow-hidden shadow-2xl border border-white/10 block group-hover:scale-105 transition-transform duration-300 relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Golden CTA Button below cover */}
          <Link
            href={`/katalog/${book.id}`}
            className="w-full max-w-[210px] mt-4 py-3 px-4 bg-[#C58B38] hover:bg-[#A9742B] text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 text-center"
          >
            <span>Lihat Detail Buku</span>
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Right: Book Meta & Details */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-3">
          <div>
            {/* Top Badge Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-amber-200 text-[10px] uppercase font-bold tracking-wider rounded-full mb-3">
              <Star size={11} fill="currentColor" className="text-amber-300" />
              EDITOR'S PICK OF THE WEEK
            </span>

            <p className="text-[10px] font-bold text-amber-300/90 uppercase tracking-widest mb-1">
              {book.category || "ROMANCE"}
            </p>
            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight mb-1 group-hover:text-amber-200 transition-colors line-clamp-2">
              <Link href={`/katalog/${book.id}`}>{book.title}</Link>
            </h3>
            <p className="text-xs text-white/70 font-medium mb-3">
              {book.author}
            </p>
          </div>

          {/* Editor's Note Quote Box */}
          <div className="bg-white/5 border-l-2 border-amber-400/80 p-3 rounded-r-xl">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
              <Quote size={12} className="fill-amber-300" />
              <span>Editor's Note</span>
            </div>
            <p className="text-xs text-white/90 italic leading-relaxed line-clamp-3">
              {book.synopsis || "Sebuah kisah romance yang emosional dengan penceritaan yang indah dan edisi buku kolektibel yang memikat."}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="pt-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-black text-white text-xl sm:text-2xl tracking-tight">
                {formattedPromo}
              </span>
              <span className="line-through text-white/40 text-xs font-normal">
                {formattedOrig}
              </span>
              <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm tracking-tight">
                HEMAT {discountPct}%
              </span>
            </div>
          </div>

          {/* Dark FOMO Countdown Box Driven by useCountdown */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-200">
              <span className="flex items-center gap-1.5">
                <Timer size={13} className="text-amber-400" />
                <span>PROMO BERAKHIR</span>
              </span>
              <span className="font-mono text-amber-200 font-bold" suppressHydrationWarning>
                {timer.isExpired ? "EXPIRED" : timer.formattedTime}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 rounded-full w-[70%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Right Side Horizontal Card Item */
function RightHorizontalCard({
  book,
  index,
}: {
  book: Book;
  index: number;
}) {
  const hasPromo = isActivePromo(book);
  const formattedOrig = formatBookPrice(book.price);
  const formattedPromo = formatBookPrice(book.promo_price);
  const coverImage = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
  const timer = useCountdown(book.promo_end_date);

  let discountPct = book.promo_percentage || 15;
  if (!book.promo_percentage && hasPromo && typeof book.price === "number" && typeof book.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  // Soft Pastel Cover Wrappers from reference
  const pastelStyles = [
    { bg: "bg-[#FCEAE6]", catText: "text-rose-600" },
    { bg: "bg-[#FBF3D5]", catText: "text-amber-700" },
    { bg: "bg-[#E5F5F8]", catText: "text-sky-700" },
  ];

  const style = pastelStyles[index % pastelStyles.length];

  return (
    <div className="bg-white border border-[#EAE3D2] rounded-2xl p-3.5 flex items-center gap-4 hover:shadow-md hover:border-[#B67A2D]/40 transition-all duration-200 relative overflow-hidden group">
      {/* Top Right Red Discount Badge */}
      <span className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-2xs z-10">
        -{discountPct}%
      </span>

      {/* Pastel Cover Container */}
      <Link
        href={`/katalog/${book.id}`}
        className={`w-24 sm:w-28 aspect-[3/4] rounded-xl ${style.bg} p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 relative`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={book.title}
          className="w-full h-full object-cover rounded-lg shadow-sm"
        />
      </Link>

      {/* Right Info Details */}
      <div className="flex flex-col justify-center min-w-0 flex-1 pr-8">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${style.catText}`}>
          {book.category || "LITERASI"}
        </span>
        <h4 className="font-serif font-bold text-sm text-[#272522] leading-snug line-clamp-1 group-hover:text-[#B67A2D] transition-colors mt-0.5">
          <Link href={`/katalog/${book.id}`}>{book.title}</Link>
        </h4>
        <p className="text-xs text-[#76716A] truncate mt-0.5">{book.author}</p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-extrabold text-red-600 text-sm">
            {formattedPromo}
          </span>
          <span className="line-through text-gray-400 text-xs font-normal">
            {formattedOrig}
          </span>
        </div>

        {/* Compact FOMO Countdown Box Driven by useCountdown */}
        <div className="mt-2 bg-[#FFF8F6] border border-orange-200/60 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-orange-950">
            <span suppressHydrationWarning>⏳ {timer.isExpired ? "EXPIRED" : timer.formattedTime}</span>
          </div>
          <div className="w-full h-1 bg-red-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full w-[65%]" />
          </div>
        </div>
      </div>
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
    <section className="w-full py-8 md:py-12 bg-[#FEFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Warm Parchment Outer Container */}
        <div className="bg-[#FAF7F0] border border-[#EAE3D2] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-[#EAE3D2] gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B67A2D] mb-1">
                <Star size={14} fill="currentColor" className="text-[#B67A2D]" />
                PILIHAN EDITOR
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Buku-buku terbaik pilihan kami, untuk dibaca sekarang sebelum promonya berakhir.
              </p>
            </div>

            <Link
              href="/katalog?category=rekomendasi"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#B67A2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-[#EAE3D2] shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Lihat Semua Pilihan Editor</span>
              <ChevronRight size={15} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Main 2-Column Showcase: Featured Hero (Left 7 cols) + 3 Horizontal Cards (Right 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Featured Hero Spotlight */}
            <div className="lg:col-span-7 flex flex-col">
              <FeaturedHeroCard book={featured} />
            </div>

            {/* Right Column: Pilihan Lainnya Untukmu Stack */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#76716A] uppercase tracking-wider">
                <span className="text-amber-600">✨</span>
                <span>Pilihan Lainnya Untukmu</span>
              </div>

              <div className="flex flex-col gap-3.5 justify-between flex-1">
                {rightBooks.map((book, idx) => (
                  <RightHorizontalCard key={book.id} book={book} index={idx} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom 5-Feature Benefit Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-8 border-t border-[#EAE3D2] mt-8 text-[#272522]">
            {/* Feature 1 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                <HeartHandshake size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#272522]">DIPILIH DENGAN HATI</h5>
                <p className="text-[11px] text-[#76716A] leading-normal mt-0.5">Buku dipilih oleh editor berdasarkan kualitas, dan nilai baca.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Tag size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#272522]">HARGA SPESIAL</h5>
                <p className="text-[11px] text-[#76716A] leading-normal mt-0.5">Dapatkan diskon eksklusif untuk buku pilihan editor, berlaku terbatas.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#272522]">PROMO TERBATAS</h5>
                <p className="text-[11px] text-[#76716A] leading-normal mt-0.5">Penawaran menarik hanya berlaku beberapa hari. Jangan sampai terlewat!</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#272522]">BERAGAM GENRE</h5>
                <p className="text-[11px] text-[#76716A] leading-normal mt-0.5">Dari fiksi hingga komik, temukan bacaan yang paling cocok untukmu.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <Users size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#272522]">UNTUK SEMUA PEMBACA</h5>
                <p className="text-[11px] text-[#76716A] leading-normal mt-0.5">Buku bagus untuk segala usia, dari anak hingga dewasa.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}





