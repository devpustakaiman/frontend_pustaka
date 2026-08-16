import Link from "next/link";

const dummyBooks = [
  {
    id: 1,
    title: "Pengantar Filsafat Ilmu",
    author: "Dr. Ahmad Fali",
    category: "Filsafat & Sains",
    price: "Rp 85.000",
  },
  {
    id: 2,
    title: "Metodologi Penelitian Sosial",
    author: "Prof. Handoko",
    category: "Pendidikan",
    price: "Rp 95.000",
  },
  {
    id: 3,
    title: "Sejarah Peradaban Islam",
    author: "Drs. M. Ridwan",
    category: "Sejarah",
    price: "Rp 110.000",
  },
  {
    id: 4,
    title: "Logika & Penalaran Kritis",
    author: "Siti Rahma, M.A.",
    category: "Filsafat",
    price: "Rp 78.000",
  },
];

export default function BookGrid() {
  return (
    <section className="py-8 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyBooks.map((book) => (
            <div
              key={book.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-48 bg-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-500 group-hover:bg-slate-800/80 transition-colors">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sampul Buku #{book.id}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {book.category}
                </span>
                <h3 className="font-bold text-lg text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{book.author}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-200">{book.price}</span>
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
