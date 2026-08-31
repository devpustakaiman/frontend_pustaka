"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export interface MizanCategorySubItem {
  name: string;
  full: string;
}

export interface MizanCategoryGroup {
  name: string;
  slug: string;
  subcategories: MizanCategorySubItem[];
}

export const MIZAN_CATEGORIES_RAW = [
  'Agama & Filsafat - Agama Islam',
  'Agama & Filsafat - Filsafat',
  'Agama & Filsafat - Religi & Spiritual',
  'Al-Quran',
  'Bisnis & Ekonomi - Manajemen',
  'Bisnis & Ekonomi - Bisnis & Ekonomi',
  'Bisnis & Ekonomi - Investasi & Keuangan',
  'Buku Anak - Boardbook',
  'Buku Anak - Komik Anak',
  'Buku Anak - Cerita Anak',
  'Buku Anak - Aktivitas Anak',
  'Buku Anak - Pengetahuan & Sains Anak',
  'Diet & Health - Kesehatan, Kebugaran & Diet',
  'Diet & Health - Buku Resep & Makanan',
  'Fiksi - Action, Crime & Thrillers',
  'Fiksi - Fantasi',
  'Fiksi - Klasik',
  'Fiksi - Romansa',
  'Fiksi - Novel Sejarah & Filsafat',
  'Fiksi - Puisi, Prosa & Kumcer',
  'Fiksi - Novel Populer',
  'Fiksi - Sastra',
  'Fiksi - Komik',
  'Filsafat, Sejarah, Sastra Dan Budaya',
  'Lain-Lain',
  'Learning - Learning & Teaching',
  'Learning - Metode Pendidikan',
  'Mainan Edukatif - Boardgame',
  'Mainan Edukatif - Poster & Puzzle',
  'Mainan Edukatif - Flash Card',
  'Mainan Edukatif - Vcd Dan Aplikasi',
  'Mainan Edukatif - Merchandise',
  'Mainan Edukatif - Flip Card',
  'Non Fiksi',
  'Parenting & Child Development - Kehamilan Dan Kelahiran',
  'Parenting & Child Development - Bayi Dan Balita',
  'Parenting & Child Development - General Parenting',
  'Pengembangan Diri & Karier - Inspirasi & Motivasi',
  'Pengembangan Diri & Karier - Hobi',
  'Pengembangan Diri & Karier - Leadership',
  'Pengembangan Diri & Karier - Traveling',
  'Pengembangan Diri & Karier - Karier',
  'Psikologi - Psikologi Populer',
  'Psikologi - Self-Help',
  'Reference & Dictionary - Reference & Dictionary',
  'Reference & Dictionary - Ensiklopedia',
  'Schoolbook',
  'Social Science - Biografi',
  'Social Science - Memoar',
  'Social Science - Politik & Hukum',
  'Social Science - Bahasa',
  'Social Science - Sejarah & Sosial Budaya',
  'Social Science - Natural Science'
];

/** Parse backend Mizanstore categories into hierarchical tree structure */
export function buildMizanCategoryTree(): MizanCategoryGroup[] {
  const map = new Map<string, MizanCategorySubItem[]>();

  MIZAN_CATEGORIES_RAW.forEach((item) => {
    if (item.includes(" - ")) {
      const parts = item.split(" - ");
      const parentName = parts[0].trim();
      const subName = parts.slice(1).join(" - ").trim();

      if (!map.has(parentName)) {
        map.set(parentName, []);
      }
      map.get(parentName)?.push({ name: subName, full: item });
    } else {
      if (!map.has(item)) {
        map.set(item, []);
      }
    }
  });

  const tree: MizanCategoryGroup[] = [];
  map.forEach((subcategories, name) => {
    tree.push({
      name,
      slug: name,
      subcategories,
    });
  });

  // Sort alphabetically by parent category name for clean list order
  tree.sort((a, b) => a.name.localeCompare(b.name));

  return tree;
}

export const CATEGORY_TREE = buildMizanCategoryTree();

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
    setActiveMobileSub(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E7E1D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Anchor */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#D32F2F] rounded-md p-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo500x200_1.png"
              alt="Pustaka Iman Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider text-[#272522]">
            <Link
              href="/"
              className={`hover:text-[#B67A2D] transition-colors uppercase ${
                pathname === "/" ? "text-[#B67A2D]" : ""
              }`}
            >
              BERANDA
            </Link>

            {/* Shop Hover Flyout Dropdown (Narrow Column + Flyout Submenu to the right, NO SCROLLBARS) */}
            <div className="relative group py-6">
              <Link
                href="/katalog"
                className={`flex items-center space-x-1 uppercase hover:text-[#B67A2D] transition-colors ${
                  pathname.startsWith("/katalog") ? "text-[#B67A2D]" : ""
                }`}
              >
                <span>SHOP</span>
                <ChevronDownIcon />
              </Link>

              {/* Main Category Dropdown Column (No overflow hidden/auto to allow flyout projection) */}
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white border border-[#EAE5D9] rounded-xl shadow-xl py-1.5 z-50 transition-all duration-200">
                {/* Bold Highlighted 'Semua Produk' Link */}
                <Link
                  href="/katalog"
                  className="px-3.5 py-2 text-xs font-bold text-[#D32F2F] bg-[#FAF8F3] hover:bg-[#F1E8D8] border-b border-[#EAE5D9] transition-colors flex items-center justify-between"
                >
                  <span>SEMUA PRODUK</span>
                  <span>&rarr;</span>
                </Link>

                <div className="py-1">
                  {CATEGORY_TREE.map((cat) => {
                    const hasSub = cat.subcategories && cat.subcategories.length > 0;
                    return (
                      <div key={cat.name} className="relative group/sub">
                        <Link
                          href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                          className="px-3.5 py-2 text-xs font-medium text-[#272522] hover:bg-[#F1E8D8]/70 hover:text-[#B67A2D] border-b border-[#F7F4EC] transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate pr-2">{cat.name}</span>
                          {hasSub && (
                            <ChevronRight size={13} className="text-[#76716A] flex-shrink-0 group-hover/sub:text-[#B67A2D]" />
                          )}
                        </Link>

                        {/* Sub-Category Flyout Menu on Hover (Opens directly to the right, NO scrollbars) */}
                        {hasSub && (
                          <div className="absolute left-full top-0 hidden group-hover/sub:block w-64 bg-white border border-[#EAE5D9] rounded-xl shadow-2xl py-1.5 ml-1 z-50">
                            <div className="px-3.5 py-1.5 bg-[#FAF8F3] border-b border-[#EAE5D9] mb-1">
                              <span className="text-[10px] font-bold text-[#B67A2D] uppercase tracking-wider block">
                                Sub-Kategori
                              </span>
                              <span className="text-xs font-serif font-bold text-[#272522]">
                                {cat.name}
                              </span>
                            </div>
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.full}
                                href={`/katalog?category=${encodeURIComponent(sub.name)}`}
                                className="block px-3.5 py-1.5 text-xs font-medium text-[#272522] hover:bg-[#FAF8F3] hover:text-[#B67A2D] border-b border-[#F7F4EC] transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Warta Buku */}
            <Link
              href="/warta"
              className={`hover:text-[#B67A2D] transition-colors uppercase ${
                pathname.startsWith("/warta") ? "text-[#B67A2D]" : ""
              }`}
            >
              WARTA BUKU
            </Link>

            {/* Tentang Kami */}
            <Link
              href="/tentang-kami"
              className={`hover:text-[#B67A2D] transition-colors uppercase ${
                pathname === "/tentang-kami" ? "text-[#B67A2D]" : ""
              }`}
            >
              TENTANG KAMI
            </Link>

            {/* Kontak */}
            <Link
              href="/kontak"
              className={`hover:text-[#B67A2D] transition-colors uppercase ${
                pathname === "/kontak" ? "text-[#B67A2D]" : ""
              }`}
            >
              KONTAK
            </Link>

            {/* Primary Action Button: Kirim Naskah */}
            <Link
              href="/kirim-naskah"
              className="ml-2 px-4 py-2 rounded-md bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F] uppercase tracking-wider"
            >
              KIRIM NASKAH
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-[#272522] hover:bg-[#F1E8D8] focus:outline-none focus:ring-2 focus:ring-[#B67A2D] transition-all duration-200 active:scale-95"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F3] border-b border-[#E7E1D8] px-4 pt-2 pb-6 space-y-3 shadow-lg max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            className="block py-2 text-sm font-semibold uppercase tracking-wider text-[#272522] hover:text-[#B67A2D]"
          >
            Beranda
          </Link>

          {/* Shop Mobile Accordion */}
          <div className="border-t border-[#E7E1D8] pt-2">
            <button
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase tracking-wider text-[#272522] hover:text-[#B67A2D]"
            >
              <span>SHOP</span>
              <ChevronDownIcon isOpen={mobileShopOpen} />
            </button>
            {mobileShopOpen && (
              <div className="pl-4 space-y-2 py-1 text-sm text-[#76716A]">
                <Link
                  href="/katalog"
                  className="block py-1 font-bold text-[#D32F2F] hover:text-[#B71C1C]"
                >
                  Semua Produk &rarr;
                </Link>
                {CATEGORY_TREE.map((cat) => {
                  const isSubOpen = activeMobileSub === cat.name;
                  const hasSub = cat.subcategories && cat.subcategories.length > 0;
                  return (
                    <div key={cat.name} className="py-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                          className="hover:text-[#B67A2D] font-medium"
                        >
                          {cat.name}
                        </Link>
                        {hasSub && (
                          <button
                            onClick={() => setActiveMobileSub(isSubOpen ? null : cat.name)}
                            type="button"
                            className="p-1 text-[#76716A] hover:text-[#B67A2D]"
                          >
                            <ChevronDownIcon isOpen={isSubOpen} />
                          </button>
                        )}
                      </div>
                      {hasSub && isSubOpen && (
                        <div className="pl-3 mt-1.5 space-y-1.5 border-l-2 border-[#E7E1D8] text-xs">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.full}
                              href={`/katalog?category=${encodeURIComponent(sub.name)}`}
                              className="block py-1 text-[#76716A] hover:text-[#B67A2D]"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/warta"
            className="block py-2 text-sm font-semibold uppercase tracking-wider text-[#272522] hover:text-[#B67A2D] border-t border-[#E7E1D8] pt-2"
          >
            WARTA BUKU
          </Link>

          <Link
            href="/tentang-kami"
            className="block py-2 text-sm font-semibold uppercase tracking-wider text-[#272522] hover:text-[#B67A2D] border-t border-[#E7E1D8] pt-2"
          >
            TENTANG KAMI
          </Link>

          <Link
            href="/kontak"
            className="block py-2 text-sm font-semibold uppercase tracking-wider text-[#272522] hover:text-[#B67A2D] border-t border-[#E7E1D8] pt-2"
          >
            KONTAK
          </Link>

          <div className="pt-3 border-t border-[#E7E1D8]">
            <Link
              href="/kirim-naskah"
              className="block w-full text-center py-2.5 rounded-md bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-medium uppercase tracking-wider text-xs shadow transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D32F2F]"
            >
              KIRIM NASKAH
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen?: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${
        isOpen ? "rotate-180 text-[#B67A2D]" : "text-[#76716A] group-hover:text-[#B67A2D]"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
