import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 rounded-full border border-emerald-800/50">
              Penerbit & Distro Buku Ilmiah
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Temukan Inspirasi &{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Pengetahuan Terkini
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Selamat datang di Pustaka Ilman. Kami menyajikan berbagai koleksi naskah terpilih, buku akademik, dan literasi umum bermutu untuk menunjang wawasan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/katalog"
                className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition-all shadow-lg shadow-emerald-600/30 text-center"
              >
                Jelajahi Katalog
              </Link>
              <Link
                href="/kirim-naskah"
                className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 border border-slate-700 transition-all text-center"
              >
                Terbitkan Naskah Anda
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md h-80 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/10 border border-emerald-500/20 p-8 flex flex-col justify-between shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-emerald-400 font-semibold tracking-widest">
                  Unggulan Bulan Ini
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Sejarah & Metodologi Sains
                </h3>
                <p className="text-sm text-slate-300">
                  Panduan komprehensif memahami perkembangan ilmu pengetahuan dari masa ke masa.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center text-sm">
                <span className="text-emerald-300 font-semibold">Pustaka Ilman Press</span>
                <span className="text-xs text-slate-400">Edisi 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
