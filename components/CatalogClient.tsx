"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Filter, Check, Layers } from "lucide-react";
import BookGrid, { Book } from "@/components/BookGrid";
import { CATEGORY_TREE, MizanCategoryGroup } from "@/components/Navbar";

interface CatalogClientProps {
  books: Book[];
}

type SortOption =
  | "all"
  | "rekomendasi"
  | "bestseller"
  | "price-asc"
  | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "all", label: "Urutan Default" },
  { value: "rekomendasi", label: "Buku Rekomendasi" },
  { value: "bestseller", label: "Best Seller" },
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

  // Sync state with URL ?category= search parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const decoded = decodeURIComponent(categoryParam);
      if (decoded === "rekomendasi") {
        setSort("rekomendasi");
      } else if (decoded === "bestseller") {
        setSort("bestseller");
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

  // 1. Filter books by Category / Subcategory
  const filteredBooks = books.filter((book) => {
    if (selectedCategory === "Semua Kategori") return true;

    const bookCat = (book.category || "").toLowerCase();
    const selectedNorm = selectedCategory.toLowerCase();

    // Direct match with category or full format (e.g. "Biografi" or "Social Science - Biografi")
    if (bookCat === selectedNorm || bookCat.includes(selectedNorm) || selectedNorm.includes(bookCat)) {
      return true;
    }

    // If selected category is a parent category, include books in any of its subcategories
    if (activeParentGroup && activeParentGroup.name.toLowerCase() === selectedNorm) {
      if (activeParentGroup.subcategories) {
        const isSubMatch = activeParentGroup.subcategories.some((sub) => {
          const subNameNorm = sub.name.toLowerCase();
          const fullNorm = sub.full.toLowerCase();
          return bookCat.includes(subNameNorm) || bookCat.includes(fullNorm);
        });
        if (isSubMatch) return true;
      }
    }

    return false;
  });

  // 2. Sort filtered books
  const processed = [...filteredBooks].sort((a, b) => {
    if (sort === "price-asc") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "price-desc") return parsePrice(b.price) - parsePrice(a.price);
    return 0;
  });

  const selectedSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Urutan Default";

  return (
    <div className="space-y-6">
      
      {/* Category Pills & Sub-category Bar */}
      <div className="space-y-4">
        {/* Main Category Pills */}
        <div className="bg-white border border-[#EAE5D9] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#76716A] uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={14} className="text-[#B67A2D]" />
              <span>Filter Kategori Utama</span>
            </span>

            {selectedCategory !== "Semua Kategori" && (
              <button
                onClick={() => handleCategorySelect("Semua Kategori")}
                className="text-xs font-bold text-[#D32F2F] hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Top Level Category Pills - Wrapping without horizontal scrollbars */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleCategorySelect("Semua Kategori")}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "Semua Kategori"
                  ? "bg-[#D32F2F] text-white shadow-md scale-105"
                  : "bg-[#FAF8F3] text-[#272522] border border-[#EAE5D9] hover:border-[#B67A2D]/60 hover:bg-white"
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isParentActive
                      ? "bg-[#D32F2F] text-white shadow-md scale-105"
                      : "bg-[#FAF8F3] text-[#272522] border border-[#EAE5D9] hover:border-[#B67A2D]/60 hover:bg-white"
                  }`}
                >
                  {isParentActive && <Check size={12} strokeWidth={2.5} />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Category Pills Bar (Shown dynamically when a parent category is selected) */}
          {activeParentGroup && activeParentGroup.subcategories && activeParentGroup.subcategories.length > 0 && (
            <div className="pt-3 border-t border-[#EAE5D9] space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#B67A2D] font-bold">
                <Layers size={13} />
                <span>Sub-Kategori {activeParentGroup.name}:</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {/* Option to show all within this parent category */}
                <button
                  onClick={() => handleCategorySelect(activeParentGroup.name)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedCategory.toLowerCase() === activeParentGroup.name.toLowerCase()
                      ? "bg-[#B67A2D] text-white font-semibold shadow-sm"
                      : "bg-white border border-[#EAE5D9] text-[#76716A] hover:text-[#272522] hover:bg-[#FAF8F3]"
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isSubActive
                          ? "bg-[#B67A2D] text-white font-semibold shadow-sm"
                          : "bg-white border border-[#EAE5D9] text-[#76716A] hover:text-[#272522] hover:bg-[#FAF8F3]"
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
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E1D8] rounded-xl text-xs sm:text-sm font-medium text-[#272522] hover:border-[#B67A2D] transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#B67A2D] shadow-sm justify-between min-w-[180px] cursor-pointer"
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
                  className="absolute z-30 mt-1.5 right-0 sm:left-0 w-56 bg-white border border-[#E7E1D8] rounded-xl shadow-xl py-1.5 overflow-hidden"
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
                          ? "bg-[#F1E8D8] text-[#B67A2D] font-semibold"
                          : "text-[#272522] hover:bg-[#FAF8F3]"
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
              <span> dalam kategori <span className="text-[#D32F2F] font-bold">"{selectedCategory}"</span></span>
            )}
          </div>
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
