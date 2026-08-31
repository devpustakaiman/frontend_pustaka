import Link from "next/link";
import BookCard, { Book } from "./BookCard";

export type { Book };

interface BookGridProps {
  books?: Book[];
}

export default function BookGrid({ books = [] }: BookGridProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-[#E7E1D8] my-4 shadow-sm">
        <p className="text-[#76716A] text-sm font-medium">
          Katalog buku belum tersedia
        </p>
      </div>
    );
  }

  return (
    <section className="py-4 text-[#272522]">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

