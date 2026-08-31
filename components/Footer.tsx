import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#272522] text-[#FAF8F3] border-t border-[#8D5D20]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Editorial Mission Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-[#FAF8F3] px-3 py-1.5 rounded-xl shadow-sm inline-flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo500x200_1.png"
                  alt="Pustaka Iman Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-[#E7E1D8]/80 leading-relaxed max-w-sm font-sans">
              Penerbit & Penyedia Literasi berkualitas tinggi untuk mencerdaskan
              bangsa melalui karya-karya bermakna.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-[#B67A2D] font-semibold mb-4 text-xs uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E7E1D8]/80">
              <li>
                <Link href="/" className="hover:text-[#B67A2D] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#B67A2D] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#B67A2D] transition-colors">
                  Navigasi Buku
                </Link>
              </li>
              <li>
                <Link href="/warta" className="hover:text-[#B67A2D] transition-colors">
                  Warta Buku
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Services Column */}
          <div>
            <h3 className="text-[#B67A2D] font-semibold mb-4 text-xs uppercase tracking-wider">
              Layanan & Info
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E7E1D8]/80">
              <li>
                <Link href="/kirim-naskah" className="hover:text-[#B67A2D] transition-colors">
                  Kirim Naskah
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-[#B67A2D] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[#B67A2D] transition-colors">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* External Store & Social Links Column */}
          <div>
            <h3 className="text-[#B67A2D] font-semibold mb-4 text-xs uppercase tracking-wider">
              Official Store & Media
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E7E1D8]/80">
              <li>
                <a
                  href="https://mizanstore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-[#B67A2D] transition-colors"
                >
                  <span>Mizanstore Official</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B67A2D] transition-colors"
                >
                  Instagram @pustakaiman
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B67A2D] transition-colors"
                >
                  Facebook Pustaka Iman
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 border-t border-[#E7E1D8]/10 text-center text-xs text-[#E7E1D8]/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} Pustaka Iman. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[11px] text-[#E7E1D8]/40">
            Official Publisher Partner of Mizan Group
          </p>
        </div>
      </div>
    </footer>
  );
}
