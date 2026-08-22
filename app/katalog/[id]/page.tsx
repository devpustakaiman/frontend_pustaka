import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooks, getBookById } from "@/lib/api";

export const dynamicParams = false;

export async function generateStaticParams() {
  const books = await getBooks();

  if (!books || books.length === 0) {
    return [];
  }

  return books.map((book) => ({
    id: String(book.id),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const coverUrl = book.coverUrl || book.cover_url;
  const pdfPreviewUrl = book.pdfPreviewUrl || book.pdf_preview_url;
  const mizanstoreUrl = book.mizanstoreUrl || book.mizanstore_url;

  return (
    <div className="bg-slate-950 min-h-screen py-12 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/katalog"
            className="inline-flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            &larr; Kembali ke Katalog
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Book Cover */}
            <div className="w-full aspect-[3/4] bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg flex items-center justify-center">
              {coverUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-slate-400 text-sm font-semibold">
                  Sampul Tidak Tersedia
                </div>
              )}
            </div>

            {/* Book Details & Synopsis */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  {book.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {book.title}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Penulis: <span className="text-slate-200 font-medium">{book.author}</span>
                </p>
              </div>

              <div className="border-t border-b border-slate-800 py-4 space-y-2">
                <h2 className="text-lg font-bold text-slate-200">Sinopsis</h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {book.synopsis}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Harga Buku</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {book.price ? (typeof book.price === "number" ? `Rp ${book.price.toLocaleString("id-ID")}` : book.price) : "Rp 95.000"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {pdfPreviewUrl && (
                    <a
                      href={pdfPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 border border-slate-700 rounded-xl transition-all text-center text-sm inline-block"
                    >
                      Pratinjau Bab 1
                    </a>
                  )}
                  {mizanstoreUrl && (
                    <a
                      href={mizanstoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-center text-sm inline-block"
                    >
                      Beli Buku
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


