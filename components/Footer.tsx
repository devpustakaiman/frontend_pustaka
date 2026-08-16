import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-lg">
                PI
              </div>
              <span className="font-bold text-lg text-white">Pustaka Ilman</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Penerbit & Penyedia Literasi berkualitas tinggi untuk mencerdaskan
              bangsa melalui karya-karya bermakna.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-emerald-400 transition-colors">
                  Katalog Buku
                </Link>
              </li>
              <li>
                <Link href="/kirim-naskah" className="hover:text-emerald-400 transition-colors">
                  Kirim Naskah
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h3>
            <p className="text-sm text-slate-400">Email: info@pustakailman.com</p>
            <p className="text-sm text-slate-400 mt-1">Jakarta, Indonesia</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Pustaka Ilman. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
}
