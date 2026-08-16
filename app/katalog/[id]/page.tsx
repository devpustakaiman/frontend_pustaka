import Link from "next/link";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;

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
            {/* Book Cover Placeholder */}
            <div className="w-full aspect-[3/4] bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-6 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-3">
                #{id}
              </div>
              <span className="text-sm font-semibold text-slate-400">
                Placeholder Sampul Buku
              </span>
            </div>

            {/* Book Details & Synopsis */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  Detail Buku
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Judul Buku Placeholder #{id}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Penulis: <span className="text-slate-200 font-medium">Penulis Pustaka Ilman</span>
                </p>
              </div>

              <div className="border-t border-b border-slate-800 py-4 space-y-2">
                <h2 className="text-lg font-bold text-slate-200">Sinopsis</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Ini adalah placeholder sinopsis buku ID #{id}. Buku ini membahas topik-topik ilmiah dan literasi mendalam yang diterbitkan oleh Pustaka Ilman. Menyajikan argumen terstruktur, riset mendalam, serta panduan praktis bagi para pembaca dan akademisi.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Harga Buku</span>
                  <span className="text-2xl font-bold text-emerald-400">Rp 95.000</span>
                </div>
                <button
                  type="button"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-center"
                >
                  Beli Buku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
