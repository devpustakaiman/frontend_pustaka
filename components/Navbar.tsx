"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  tree.sort((a, b) => a.name.localeCompare(b.name));
  return tree;
}

export const CATEGORY_TREE = buildMizanCategoryTree();

export interface NavLinkItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { name: "BERANDA", href: "/" },
  { name: "KOLEKSI", href: "/shop", hasDropdown: true },
  { name: "PRE-ORDER", href: "/pre-order" },
  { name: "WARTA", href: "/warta" },
  { name: "TENTANG", href: "/tentang" },
  { name: "KONTAK", href: "/kontak" },
];

interface SearchResultItem {
  id: string;
  title: string;
  author?: string;
  cover_url?: string;
  price?: number;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  // Determine active route state dynamically
  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop") return pathname.startsWith("/shop") || pathname.startsWith("/katalog");
    if (href === "/tentang") return pathname.startsWith("/tentang") || pathname.startsWith("/tentang-kami");
    if (href === "/kontak") return pathname.startsWith("/kontak") || pathname.startsWith("/contact");
    return pathname.startsWith(href);
  };

  // 1. Scroll State Listener (window.scrollY > 20)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
    setActiveMobileSub(null);
    setShowDropdown(false);
  }, [pathname]);

  // Click outside to close instant search popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live autocomplete search with debounce
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("books")
          .select("id, title, author, cover_url, price")
          .is("deleted_at", null)
          .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
          .limit(4);

        if (!error && data) {
          setSearchResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Instant search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`sticky z-50 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
        isScrolled ? "top-3 sm:top-4" : "top-0"
      }`}
    >
      {/* Dynamic Animated Container */}
      <div
        className={`relative mx-auto flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-md max-w-6xl mt-2 sm:mt-3 px-6 h-[52px] sm:h-14 rounded-full"
            : "bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xs max-w-7xl mt-2 px-5 h-14 sm:h-16 rounded-full sm:rounded-2xl"
        }`}
      >
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 focus:outline-none rounded-md group py-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo500x200_1.png"
            alt="PUSTAKA IMaN"
            className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Center Navigation Links (Desktop Dynamic Mapping) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs tracking-wider self-stretch h-full">
          {NAV_LINKS.map((item) => {
            const isActive = isItemActive(item.href);

            if (item.hasDropdown) {
              return (
                <div
                  key={item.name}
                  className="relative group self-stretch flex items-center py-1"
                >
                  <Link
                    href={item.href}
                    className={`relative self-stretch flex items-center gap-1 uppercase transition-colors ${
                      isActive
                        ? "text-[#E52E2D] font-bold"
                        : "text-gray-700 hover:text-gray-950 font-semibold"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 group-hover:rotate-180 ${
                        isActive
                          ? "text-[#E52E2D]"
                          : "text-gray-500 group-hover:text-gray-950"
                      }`}
                    />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[5px] w-7 rounded-t-full bg-[#E52E2D]" />
                    )}
                  </Link>

                  {/* Category Dropdown Flyout Menu */}
                  <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                    <div className="w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 overflow-visible">
                      <Link
                        href="/katalog"
                        className="px-4 py-2 text-xs font-bold text-[#E52E2D] bg-red-50/50 hover:bg-red-50 border-b border-gray-100 transition-colors flex items-center justify-between"
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
                                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors flex items-center justify-between"
                              >
                                <span className="truncate pr-2">{cat.name}</span>
                                {hasSub && (
                                  <ChevronRight
                                    size={13}
                                    className="text-gray-400 shrink-0 group-hover/sub:text-gray-950"
                                  />
                                )}
                              </Link>

                              {/* Nested Sub-Category Flyout Menu */}
                              {hasSub && (
                                <div className="absolute left-full top-0 pl-1 hidden group-hover/sub:block z-50">
                                  <div className="w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2">
                                    <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 mb-1">
                                      <span className="text-[10px] font-bold text-[#E52E2D] uppercase tracking-wider block">
                                        Sub-Kategori
                                      </span>
                                      <span className="text-xs font-serif font-bold text-gray-900 truncate block">
                                        {cat.name}
                                      </span>
                                    </div>
                                    {cat.subcategories.map((sub) => (
                                      <Link
                                        key={sub.full}
                                        href={`/katalog?category=${encodeURIComponent(sub.name)}`}
                                        className="block px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative self-stretch flex items-center py-1 transition-colors uppercase ${
                  isActive
                    ? "text-[#E52E2D] font-bold"
                    : "text-gray-700 hover:text-gray-950 font-semibold"
                }`}
              >
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[5px] w-7 rounded-t-full bg-[#E52E2D]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-Side: Search Bar + Kirim Naskah Button (Clean: Profile & Cart icons removed) */}
        <div className="flex items-center gap-3">
          {/* Smart Search Input with Autocomplete Popup */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center border rounded-full px-3.5 py-1.5 text-xs focus-within:border-gray-400 w-40 lg:w-48 xl:w-52 transition-all ${
                isScrolled
                  ? "bg-gray-50 border-gray-200/80 focus-within:bg-white"
                  : "bg-white/90 border-gray-200 focus-within:bg-white shadow-2xs"
              }`}
            >
              <button
                type="submit"
                aria-label="Cari"
                className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
              >
                <Search size={14} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder="Cari buku..."
                className="bg-transparent text-gray-800 placeholder-gray-400 text-xs focus:outline-none w-full ml-1.5"
              />
              {isSearching && (
                <div className="animate-spin w-3 h-3 border-2 border-gray-300 border-t-[#E52E2D] rounded-full shrink-0" />
              )}
            </form>

            {/* Instant Autocomplete Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
                  <span>Hasil Pencarian</span>
                  <span>{searchResults.length} Buku</span>
                </div>
                <div className="py-1 divide-y divide-gray-50">
                  {searchResults.map((book) => (
                    <Link
                      key={book.id}
                      href={`/katalog/${book.id}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      {book.cover_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-9 h-12 object-cover rounded shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-12 bg-amber-50 rounded flex items-center justify-center text-amber-600 shrink-0">
                          <BookOpen size={14} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 group-hover:text-[#E52E2D] transition-colors truncate">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {book.author || "Pustaka Iman"}
                        </p>
                        {book.price && (
                          <span className="text-xs font-bold text-[#E52E2D] block mt-0.5">
                            Rp{book.price.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/katalog?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setShowDropdown(false)}
                  className="mt-1 w-full py-2 px-3 text-xs font-bold text-center text-[#E52E2D] bg-red-50/60 hover:bg-red-50 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat semua hasil untuk &ldquo;{searchQuery}&rdquo;</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* CTA Button ('KIRIM NASKAH') */}
          <Link
            href="/kirim-naskah"
            className="hidden sm:inline-flex items-center justify-center border border-[#E52E2D] text-[#E52E2D] hover:bg-red-50 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide transition-colors whitespace-nowrap active:scale-95"
          >
            KIRIM NASKAH
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-1.5 text-gray-700 hover:text-black rounded-full lg:hidden hover:bg-gray-100 transition-colors"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto bg-white/98 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Mobile Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs w-full"
          >
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari buku..."
              className="bg-transparent text-gray-800 placeholder-gray-400 text-xs focus:outline-none w-full ml-2"
            />
          </form>

          {/* Mobile Dynamic Links */}
          <nav className="space-y-2 text-xs uppercase tracking-wider">
            {NAV_LINKS.map((item) => {
              const isActive = isItemActive(item.href);

              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="border-t border-gray-100 pt-2">
                    <button
                      type="button"
                      onClick={() => setMobileShopOpen(!mobileShopOpen)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs uppercase tracking-wider ${
                        isActive
                          ? "bg-red-50 text-[#E52E2D] font-bold"
                          : "text-gray-700 hover:bg-gray-50 font-semibold"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          mobileShopOpen ? "rotate-180 text-[#E52E2D]" : ""
                        }`}
                      />
                    </button>

                    {mobileShopOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1 text-xs">
                        <Link
                          href="/katalog"
                          className="block py-1.5 px-3 font-bold text-[#E52E2D] bg-red-50/50 rounded-lg"
                        >
                          Semua Produk &rarr;
                        </Link>
                        {CATEGORY_TREE.map((cat) => {
                          const isSubOpen = activeMobileSub === cat.name;
                          const hasSub = cat.subcategories && cat.subcategories.length > 0;
                          return (
                            <div key={cat.name} className="py-0.5">
                              <div className="flex items-center justify-between">
                                <Link
                                  href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                                  className="py-1 px-3 text-gray-700 hover:text-gray-950 truncate block"
                                >
                                  {cat.name}
                                </Link>
                                {hasSub && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveMobileSub(isSubOpen ? null : cat.name)
                                    }
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <ChevronDown
                                      size={13}
                                      className={`transition-transform duration-200 ${
                                        isSubOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>
                              {hasSub && isSubOpen && (
                                <div className="pl-4 py-1 space-y-1 border-l border-gray-100 ml-3">
                                  {cat.subcategories.map((sub) => (
                                    <Link
                                      key={sub.full}
                                      href={`/katalog?category=${encodeURIComponent(sub.name)}`}
                                      className="block py-1 text-[11px] text-gray-500 hover:text-gray-900"
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
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 px-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-red-50 text-[#E52E2D] font-bold"
                      : "text-gray-700 hover:bg-gray-50 font-semibold"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/kirim-naskah"
                className="w-full inline-flex items-center justify-center border border-[#E52E2D] text-[#E52E2D] hover:bg-red-50 text-xs font-bold py-2.5 rounded-full uppercase tracking-wide transition-colors"
              >
                KIRIM NASKAH
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
