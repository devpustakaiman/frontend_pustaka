import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-slate-950 min-h-screen py-24 flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-emerald-500/20">
          !
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Buku Tidak Ditemukan
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Maaf, buku yang Anda cari tidak ditemukan atau telah dihapus dari katalog kami.
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
}
