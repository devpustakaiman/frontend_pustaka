import Link from "next/link";

export interface Book {
  id: string | number;
  title: string;
  author: string;
  category: string;
  coverUrl?: string;
  cover_url?: string;
  price?: string | number;
}

interface BookGridProps {
  books?: Book[];
}

export default function BookGrid({ books = [] }: BookGridProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 my-4">
        <p className="text-slate-400 text-lg font-medium">Katalog buku belum tersedia</p>
      </div>
    );
  }

  return (
    <section className="py-8 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <Link href={`/katalog/${book.id}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.coverUrl || book.cover_url || ""}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 bg-slate-800 group-hover:opacity-90 transition-opacity"
                  />
                </Link>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {book.category}
                </span>
                <h3 className="font-bold text-lg text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  <Link href={`/katalog/${book.id}`}>
                    {book.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{book.author}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                {book.price ? (
                  <span className="font-semibold text-slate-200">{book.price}</span>
                ) : (
                  <span />
                )}
                <Link
                  href={`/katalog/${book.id}`}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 rounded-md text-white transition-colors"
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
