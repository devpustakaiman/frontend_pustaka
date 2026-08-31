import Link from "next/link";
import { Star, ChevronRight, ArrowUpRight } from "lucide-react";
import { Book } from "./BookGrid";

interface RecommendedSectionProps {
  books?: Book[];
}

function formatPrice(price: string | number | undefined): string | null {
  if (price === null || price === undefined || price === "") return null;
  if (typeof price === "number") return `Rp ${price.toLocaleString("id-ID")}`;
  return String(price);
}

/** Large hero spotlight card — left side */
function SpotlightCard({ book }: { book: Book }) {
  const price = formatPrice(book.price);
  return (
    <Link
      href={`/katalog/${book.id}`}
      className="group relative overflow-hidden rounded-2xl block h-full min-h-[480px]"
    >
      {/* Full-bleed cover image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={book.coverUrl || book.cover_url || ""}
        alt={book.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Dark gradient overlay — bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Top badge */}
      <div className="absolute top-5 left-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B67A2D] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
          <Star size={10} strokeWidth={2} fill="currentColor" />
          Pilihan Redaksi
        </span>
      </div>

      {/* Bottom info panel — frosted glass */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[10px] font-bold text-[#B67A2D] uppercase tracking-widest mb-1.5">
          {book.category || "Literasi"}
        </p>
        <h3 className="font-serif text-2xl font-bold text-white leading-snug line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-white/70 mb-3">{book.author}</p>

        <div className="flex items-center justify-between">
          {price ? (
            <span className="font-bold text-amber-400 text-lg">{price}</span>
          ) : (
            <span className="text-sm text-white/50 italic">Hubungi Kami</span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-white text-xs font-semibold transition-all duration-200 border border-white/20">
            Lihat Detail
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Numbered editorial list item — right side */
function EditorialItem({
  book,
  rank,
}: {
  book: Book;
  rank: number;
}) {
  const price = formatPrice(book.price);
  const rankStr = String(rank).padStart(2, "0");

  return (
    <Link
      href={`/katalog/${book.id}`}
      className="group flex items-stretch gap-4 p-4 rounded-xl bg-white border border-[#EAE5D9] hover:border-[#B67A2D]/50 hover:shadow-lg transition-all duration-200"
    >
      {/* Large decorative rank number */}
      <div className="flex-shrink-0 w-14 flex items-center justify-center">
        <span
          className="font-serif font-black text-4xl leading-none select-none transition-colors duration-200"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px #E7E1D8",
          }}
        >
          {rankStr}
        </span>
      </div>

      {/* Book cover thumbnail */}
      <div className="flex-shrink-0 w-16 overflow-hidden rounded-lg bg-[#F1E8D8] self-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverUrl || book.cover_url || ""}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <p className="text-[9px] font-bold text-[#B67A2D] uppercase tracking-widest mb-0.5">
          {book.category || "Literasi"}
        </p>
        <h3 className="font-serif font-bold text-[14px] text-[#272522] leading-snug line-clamp-2 group-hover:text-[#B67A2D] transition-colors">
          {book.title}
        </h3>
        <p className="text-[11px] text-[#76716A] mt-0.5 truncate">{book.author}</p>
        <div className="mt-2">
          {price ? (
            <span className="font-bold text-[#B67A2D] text-sm">{price}</span>
          ) : (
            <span className="text-[11px] text-[#76716A] italic">Hubungi Kami</span>
          )}
        </div>
      </div>

      {/* Chevron arrow — revealed on hover */}
      <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
        <ArrowUpRight size={16} strokeWidth={1.5} className="text-[#B67A2D]" />
      </div>
    </Link>
  );
}

export default function RecommendedSection({
  books = [],
}: RecommendedSectionProps) {
  if (!books || books.length === 0) return null;

  const [featured, ...rest] = books;

  return (
    <section className="w-full bg-[#FEFDF7] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 border-b border-[#EAE5D9] pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#B67A2D] mb-2">
              <Star size={13} strokeWidth={1.5} />
              Pilihan Redaksi
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
              Buku Rekomendasi
            </h2>
          </div>
          <Link
            href="/katalog?category=rekomendasi"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#272522] hover:text-[#B67A2D] transition-colors mt-4 sm:mt-0"
          >
            Lihat Semua
            <ChevronRight
              size={16}
              strokeWidth={1.5}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Main layout: spotlight left + numbered editorial list right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Spotlight card — takes 2/5 width on desktop */}
          <div className="lg:col-span-2">
            <SpotlightCard book={featured} />
          </div>

          {/* Numbered editorial list — takes 3/5 width on desktop */}
          <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
            {rest.slice(0, 3).map((book, idx) => (
              <EditorialItem key={book.id} book={book} rank={idx + 2} />
            ))}

            {/* Decorative "explore more" row */}
            <Link
              href="/katalog?category=rekomendasi"
              className="group flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-[#D4C9B5] hover:border-[#B67A2D] hover:bg-[#F1E8D8]/40 transition-all duration-200 mt-1"
            >
              <span className="text-sm font-medium text-[#76716A] group-hover:text-[#B67A2D] transition-colors">
                Temukan lebih banyak buku pilihan redaksi
              </span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="text-[#76716A] group-hover:text-[#B67A2D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
