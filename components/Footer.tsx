import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C1819] text-gray-100 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Editorial Mission Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <div className="bg-white px-3.5 py-2 rounded-2xl shadow-sm inline-flex items-center justify-center">
                <Image
                  src="/logo500x200_1.png"
                  alt="PUSTAKA IMaN"
                  width={500}
                  height={200}
                  loading="lazy"
                  style={{ width: "auto" }}
                  className="h-9 object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm font-sans">
              Penerbit & Penyedia Literasi bermutu tinggi untuk mencerdaskan
              bangsa melalui karya-karya pemikiran dan spiritualitas yang bermakna.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#E52E2D] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#E52E2D] transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/katalog?filter=pre-order" className="hover:text-[#E52E2D] transition-colors">
                  Pre-Order Buku
                </Link>
              </li>
              <li>
                <Link href="/warta" className="hover:text-[#E52E2D] transition-colors">
                  Warta Buku
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Services Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Layanan & Info
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/kirim-naskah" className="hover:text-[#E52E2D] transition-colors">
                  Kirim Naskah
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-[#E52E2D] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[#E52E2D] transition-colors">
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* External Store & Social Links Column */}
          <div>
            <h3 className="text-[#E52E2D] font-bold mb-4 text-xs uppercase tracking-wider">
              Official Store & Media
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <a
                  href="https://mizanstore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-[#E52E2D] transition-colors"
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
                  className="hover:text-[#E52E2D] transition-colors"
                >
                  Instagram @pustakaiman
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E52E2D] transition-colors"
                >
                  Facebook Pustaka Iman
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} Pustaka Iman. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[11px] text-gray-500">
            Official Publisher Partner of Mizan Group
          </p>
        </div>
      </div>
    </footer>
  );
}
