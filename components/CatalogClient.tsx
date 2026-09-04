"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  SlidersHorizontal,
  Filter,
  Check,
  Layers,
  Search,
  X,
  Flame,
  Star,
  Sparkles,
} from "lucide-react";
import BookGrid, { Book } from "@/components/BookGrid";
import { CATEGORY_TREE, MizanCategoryGroup } from "@/components/Navbar";
import { isActivePromo } from "@/lib/utils";

interface CatalogClientProps {
  books: Book[];
}

type SortOption =
  | "all"
  | "terbaru"
  | "rekomendasi"
  | "price-asc"
  | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "all", label: "Urutan Default" },
  { value: "terbaru", label: "Buku Baru (Terbaru)" },
  { value: "rekomendasi", label: "Buku Rekomendasi" },
  { value: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { value: "price-desc", label: "Harga: Tinggi ke Rendah" },
];

function parsePrice(price: string | number | undefined): number {
  if (price === undefined || price === null || price === "") return 0;
  if (typeof price === "number") return price;
  const cleaned = String(price).replace(/[Rp.\s]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export default function CatalogClient({ books }: CatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori");
  const [sort, setSort] = useState<SortOption>("all");
  const [isOpen, setIsOpen] = useState(false);

  // 1. Smart Search State with Debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 2. Tri-State Toggles (0 = All/Default, 1 = Active Only, 2 = Inactive Only)
  const [promoFilter, setPromoFilter] = useState<number>(0);
  const [recommendedFilter, setRecommendedFilter] = useState<number>(0);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync state with URL search parameters (?category=, ?sort=, ?filter=, ?search=)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const sortParam = searchParams.get("sort");
    const filterParam = searchParams.get("filter");
    const searchParam = searchParams.get("search") || searchParams.get("q");

    if (searchParam) {
      const decoded = decodeURIComponent(searchParam);
      setSearchQuery(decoded);
      setDebouncedQuery(decoded);
    }

    if (
      sortParam === "terbaru" ||
      sortParam === "new" ||
      filterParam === "buku-baru" ||
      filterParam === "terbaru"
    ) {
      setSort("terbaru");
    } else if (
      sortParam === "price-asc" ||
      sortParam === "price-desc" ||
      sortParam === "rekomendasi"
    ) {
      setSort(sortParam);
    }

    if (categoryParam) {
      const decoded = decodeURIComponent(categoryParam);
      if (decoded === "rekomendasi") {
        setRecommendedFilter(1);
      } else if (decoded === "promo") {
        setPromoFilter(1);
      } else if (decoded === "terbaru" || decoded === "buku-baru") {
        setSort("terbaru");
      } else {
        setSelectedCategory(decoded);
      }
    } else {
      setSelectedCategory("Semua Kategori");
    }
  }, [searchParams]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === "Semua Kategori") {
      router.push("/katalog", { scroll: false });
    } else {
      router.push(`/katalog?category=${encodeURIComponent(categoryName)}`, { scroll: false });
    }
  };

  // Cycle Tri-State: 0 (Default/All) -> 1 (Active) -> 2 (Inactive) -> 0
  const cyclePromoFilter = () => {
    setPromoFilter((prev) => (prev + 1) % 3);
  };

  const cycleRecommendedFilter = () => {
    setRecommendedFilter((prev) => (prev + 1) % 3);
  };

  const resetAllFilters = () => {
    setSelectedCategory("Semua Kategori");
    setSearchQuery("");
    setDebouncedQuery("");
    setPromoFilter(0);
    setRecommendedFilter(0);
    setSort("all");
    router.push("/katalog", { scroll: false });
  };

  // Find active parent category group if selectedCategory is a parent OR a subcategory
  const activeParentGroup: MizanCategoryGroup | undefined = CATEGORY_TREE.find((parent) => {
    if (parent.name.toLowerCase() === selectedCategory.toLowerCase()) return true;
    if (
      parent.subcategories &&
      parent.subcategories.some(
        (sub) =>
          sub.name.toLowerCase() === selectedCategory.toLowerCase() ||
          sub.full.toLowerCase() === selectedCategory.toLowerCase()
      )
    ) {
      return true;
    }
    return false;
  });

  // Combine Category, Smart Search, & Tri-State Toggle Filters
  const filteredBooks = books.filter((book) => {
    // A. Filter by Category
    if (selectedCategory !== "Semua Kategori") {
      const bookCat = (book.category || "").toLowerCase();
      const selectedNorm = selectedCategory.toLowerCase();

      let catMatch =
        bookCat.includes(selectedNorm) ||
        (book.tags && book.tags.some((t: string) => t.toLowerCase().includes(selectedNorm)));

      if (!catMatch && activeParentGroup) {
        if (activeParentGroup.subcategories) {
          catMatch = activeParentGroup.subcategories.some((sub) =>
            bookCat.includes(sub.name.toLowerCase()) ||
            bookCat.includes(sub.full.toLowerCase())
          );
        }
      }

      if (!catMatch) return false;
    }

    // B. Smart Search Filter (Title, Author, Category)
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      const titleMatch = (book.title || "").toLowerCase().includes(q);
      const authorMatch = (book.author || "").toLowerCase().includes(q);
      const catMatch = (book.category || "").toLowerCase().includes(q);
      if (!titleMatch && !authorMatch && !catMatch) return false;
    }

    // C. Promo Tri-State Filter
    if (promoFilter === 1 && !isActivePromo(book)) return false;
    if (promoFilter === 2 && isActivePromo(book)) return false;

    // D. Rekomendasi Tri-State Filter
    const isRec = book.is_recommended || book.is_featured;
    if (recommendedFilter === 1 && !isRec) return false;
    if (recommendedFilter === 2 && isRec) return false;

    return true;
  });

  // Sorting
  const processed = [...filteredBooks].sort((a, b) => {
    if (sort === "terbaru") {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    }
    if (sort === "price-asc") {
      return parsePrice(a.price) - parsePrice(b.price);
    }
    if (sort === "price-desc") {
      return parsePrice(b.price) - parsePrice(a.price);
    }
    if (sort === "rekomendasi") {
      return (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0);
    }
    return 0;
  });

  const selectedSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Urutan Default";

  const hasActiveFilters =
    selectedCategory !== "Semua Kategori" ||
    searchQuery.trim().length > 0 ||
    promoFilter !== 0 ||
    recommendedFilter !== 0 ||
    sort !== "all";

  return (
    <div className="space-y-6">
      {/* Top Filter Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        
        {/* Row 1: Smart Search + Tri-State Toggle Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Smart Search Input with Live Reset */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#76716A]">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul buku atau nama penulis..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-xs sm:text-sm text-[#272522] placeholder-[#76716A] focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#E52E2D] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Tri-State Toggle Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Promo Tri-State Button */}
            <button
              onClick={cyclePromoFilter}
              type="button"
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                promoFilter === 1
                  ? "bg-[#E52E2D] text-white border-[#C12A26] shadow-md ring-2 ring-red-300"
                  : promoFilter === 2
                  ? "bg-slate-200 text-slate-700 border-slate-300 line-through opacity-80"
                  : "bg-gray-50 text-[#272522] border-gray-200 hover:bg-white hover:border-[#E52E2D]/60"
              }`}
            >
              <Flame size={14} className={promoFilter === 1 ? "fill-amber-300 text-amber-300" : "text-[#E52E2D]"} />
              <span>
                {promoFilter === 0 && "Promo: Semua"}
                {promoFilter === 1 && "🔥 Promo: Aktif ✓"}
                {promoFilter === 2 && "Promo: Non-Promo ✗"}
              </span>
            </button>

            {/* Rekomendasi Tri-State Button */}
            <button
              onClick={cycleRecommendedFilter}
              type="button"
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                recommendedFilter === 1
                  ? "bg-[#E52E2D] text-white border-[#C12A26] shadow-md ring-2 ring-red-200"
                  : recommendedFilter === 2
                  ? "bg-slate-200 text-slate-700 border-slate-300 line-through opacity-80"
                  : "bg-gray-50 text-[#272522] border-gray-200 hover:bg-white hover:border-[#E52E2D]/60"
              }`}
            >
              <Star size={14} className={recommendedFilter === 1 ? "fill-white text-white" : "text-[#E52E2D]"} />
              <span>
                {recommendedFilter === 0 && "Rekomendasi: Semua"}
                {recommendedFilter === 1 && "⭐ Rekomendasi: Aktif ✓"}
                {recommendedFilter === 2 && "Rekomendasi: Standar ✗"}
              </span>
            </button>

            {/* Buku Baru (New Arrivals) Filter Button */}
            <button
              onClick={() => {
                if (sort === "terbaru") {
                  setSort("all");
                  router.push("/katalog", { scroll: false });
                } else {
                  setSort("terbaru");
                  router.push("/katalog?filter=buku-baru", { scroll: false });
                }
              }}
              type="button"
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                sort === "terbaru"
                  ? "bg-[#E52E2D] text-white border-[#C12A26] shadow-md ring-2 ring-red-300"
                  : "bg-gray-50 text-[#272522] border-gray-200 hover:bg-white hover:border-[#E52E2D]/60"
              }`}
            >
              <Sparkles size={14} className={sort === "terbaru" ? "fill-white text-white" : "text-[#E52E2D]"} />
              <span>
                {sort === "terbaru" ? "✨ Buku Baru ✓" : "Buku Baru"}
              </span>
            </button>

          </div>
        </div>

        {/* Category Pills Header & Reset All Button */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#76716A] uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={13} className="text-[#E52E2D]" />
              <span>Kategori Utama</span>
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[#E52E2D] hover:underline cursor-pointer flex items-center gap-1"
              >
                <X size={13} />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          {/* Top Level Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect("Semua Kategori")}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "Semua Kategori"
                  ? "bg-[#E52E2D] text-white shadow-md scale-105"
                  : "bg-gray-50 text-[#272522] border border-gray-200 hover:border-[#E52E2D]/60 hover:bg-white"
              }`}
            >
              {selectedCategory === "Semua Kategori" && <Check size={12} strokeWidth={2.5} />}
              <span>Semua Kategori</span>
            </button>

            {CATEGORY_TREE.map((cat) => {
              const isParentActive =
                activeParentGroup?.name.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isParentActive
                      ? "bg-[#E52E2D] text-white shadow-md scale-105"
                      : "bg-gray-50 text-[#272522] border border-gray-200 hover:border-[#E52E2D]/60 hover:bg-white"
                  }`}
                >
                  {isParentActive && <Check size={12} strokeWidth={2.5} />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Category Pills Bar */}
        {activeParentGroup && activeParentGroup.subcategories && activeParentGroup.subcategories.length > 0 && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#E52E2D] font-bold">
              <Layers size={13} />
              <span>Sub-Kategori {activeParentGroup.name}:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect(activeParentGroup.name)}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory.toLowerCase() === activeParentGroup.name.toLowerCase()
                    ? "bg-[#E52E2D] text-white font-bold shadow-sm"
                    : "bg-white border border-gray-200 text-[#76716A] hover:text-[#272522] hover:bg-gray-50"
                }`}
              >
                Semua {activeParentGroup.name}
              </button>

              {activeParentGroup.subcategories.map((sub) => {
                const isSubActive =
                  selectedCategory.toLowerCase() === sub.name.toLowerCase() ||
                  selectedCategory.toLowerCase() === sub.full.toLowerCase();
                return (
                  <button
                    key={sub.full}
                    onClick={() => handleCategorySelect(sub.name)}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isSubActive
                        ? "bg-[#E52E2D] text-white font-bold shadow-sm"
                        : "bg-white border border-gray-200 text-[#76716A] hover:text-[#272522] hover:bg-gray-50"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Sort & Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <SlidersHorizontal
            size={16}
            strokeWidth={1.5}
            className="text-[#76716A]"
          />
          <span className="text-xs sm:text-sm text-[#76716A] font-medium">
            Urutkan Berdasarkan:
          </span>

          {/* Custom Sort Dropdown */}
          <div className="relative">
            <button
              id="catalog-sort-btn"
              onClick={() => setIsOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-[#272522] hover:border-[#E52E2D] transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#E52E2D] shadow-sm justify-between min-w-[180px] cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span>{selectedSortLabel}</span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={`text-[#76716A] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <ul
                role="listbox"
                className="absolute z-30 mt-1.5 right-0 sm:left-0 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-1.5 overflow-hidden"
              >
                {SORT_OPTIONS.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={sort === option.value}
                    onClick={() => {
                      setSort(option.value);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-150 ${
                      sort === option.value
                        ? "bg-red-50 text-[#E52E2D] font-bold"
                        : "text-[#272522] hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Result Count */}
        <div className="text-xs text-[#76716A] font-medium">
          Menampilkan <strong className="text-[#272522]">{processed.length}</strong> buku
          {selectedCategory !== "Semua Kategori" && (
            <span> dalam kategori <span className="text-[#E52E2D] font-bold">"{selectedCategory}"</span></span>
          )}
          {debouncedQuery && (
            <span> dengan pencarian <span className="text-[#E52E2D] font-bold">"{debouncedQuery}"</span></span>
          )}
        </div>
      </div>

      {/* Click-outside handler for sort dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Book Grid */}
      <BookGrid books={processed} />
    </div>
  );
}
