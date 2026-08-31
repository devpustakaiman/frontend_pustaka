import Link from "next/link";
import { formatBookPrice } from "@/lib/utils";

export interface Book {
  id: string | number;
  title: string;
  author: string;
  category?: string;
  coverUrl?: string;
  cover_url?: string;
  price?: string | number;
  synopsis?: string;
}

interface BookCardProps {
  book?: Book;
}

const DEFAULT_BOOK: Book = {
  id: "1",
  title: "Filsafat Literasi Islam",
  author: "Prof. Dr. M. Quraish Shihab",
  category: "Literasi Utama",
  coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  price: 95000,
};

export default function BookCard({ book = DEFAULT_BOOK }: BookCardProps) {
  const currentBook = book || DEFAULT_BOOK;
  const formattedPrice = formatBookPrice(currentBook.price);
  const isFallbackPrice = formattedPrice === "Lihat Harga di Mizanstore";
  const coverImage = currentBook.coverUrl || currentBook.cover_url || DEFAULT_BOOK.coverUrl;

  return (
    <div className="bg-white border border-[#E7E1D8] rounded-xl overflow-hidden hover:border-[#B67A2D]/50 hover:shadow-lg transition-all duration-200 group flex flex-col h-full">
      {/* Cover */}
      <Link
        href={`/katalog/${currentBook.id}`}
        className="block overflow-hidden bg-[#F1E8D8] aspect-[3/4] relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={currentBook.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-[10px] font-bold text-[#B67A2D] uppercase tracking-wider">
          {currentBook.category || "Literasi"}
        </span>
        <h3 className="font-serif font-bold text-[15px] text-[#272522] mt-1 group-hover:text-[#B67A2D] transition-colors leading-snug line-clamp-2">
          <Link href={`/katalog/${currentBook.id}`}>{currentBook.title}</Link>
        </h3>
        <p className="text-xs text-[#76716A] mt-1 font-medium">
          {currentBook.author}
        </p>

        {/* Price */}
        <div className="mt-3 flex-1 flex items-end">
          {isFallbackPrice ? (
            <span className="text-xs text-[#B67A2D] font-semibold italic">
              {formattedPrice}
            </span>
          ) : (
            <span className="font-bold text-[#B67A2D] text-base tracking-tight">
              {formattedPrice}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-[#E7E1D8]">
          <Link
            href={`/katalog/${currentBook.id}`}
            className="w-full block text-center px-3 py-2 text-xs font-semibold bg-[#B67A2D] hover:bg-[#8D5D20] rounded-md text-white transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B67A2D] uppercase tracking-wider shadow-sm hover:shadow-md"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
