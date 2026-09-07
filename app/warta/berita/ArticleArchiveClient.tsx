"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Search,
  ChevronRight,
  Filter,
  X,
  Calendar,
} from "lucide-react";
import { parseRichTextToPlainText, formatIndonesianDate } from "@/lib/utils";
import { Article, getArticles } from "@/lib/api";

interface ArticleArchiveClientProps {
  initialArticles?: Article[];
}

const ITEMS_PER_PAGE = 9;

export default function ArticleArchiveClient({ initialArticles = [] }: ArticleArchiveClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Client-side revalidation on mount
  useEffect(() => {
    async function loadArticles() {
      try {
        const fresh = await getArticles();
        if (fresh && fresh.length > 0) {
          setArticles(fresh);
        }
      } catch (err) {
        console.error("Gagal memuat arsip artikel:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return ["Semua", ...Array.from(set)];
  }, [articles]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        selectedCategory === "Semua" ||
        (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const parsedContent = parseRichTextToPlainText(a.content || a.summary || "");
      const matchSearch =
        !query ||
        a.title.toLowerCase().includes(query) ||
        parsedContent.toLowerCase().includes(query) ||
        (a.category && a.category.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const visibleArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 text-[#272522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back Navigation Button */}
        <div>
          <Link
            href="/warta"
            prefetch={false}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Warta</span>
          </Link>
        </div>

        {/* Breadcrumb & Navigation Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#76716A]">
            <Link href="/" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
              Beranda
            </Link>
            <ChevronRight size={12} />
            <Link href="/warta" prefetch={false} className="hover:text-[#E52E2D] transition-colors">
              Warta
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#272522] font-semibold">Arsip Berita &amp; Artikel</span>
          </div>

          <div className="border-b border-gray-100 pb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-2">
              <BookOpen size={12} className="text-[#E52E2D]" />
              JURNAL PUSTAKA
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#272522] tracking-tight">
              Arsip Berita &amp; <span className="text-[#C12A26] italic font-serif">Artikel Warta</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium max-w-2xl">
              Jelajahi seluruh kumpulan opini, warta pers, ulasan literasi, dan pengumuman publikasi resmi dari Pustaka Iman.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul artikel, topik, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(ITEMS_PER_PAGE);
                }}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E52E2D] text-[#272522] placeholder:text-gray-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-[#76716A] font-medium shrink-0">
              Menampilkan <span className="font-bold text-[#272522]">{filteredArticles.length}</span> artikel
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Filter size={12} /> Kategori:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setDisplayCount(ITEMS_PER_PAGE);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#E52E2D] text-white shadow-xs"
                        : "bg-white border border-gray-200 text-[#76716A] hover:border-gray-300 hover:text-[#272522]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Article Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 rounded-xl" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-red-50 text-[#E52E2D] rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#272522]">Artikel Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-[#76716A] max-w-md mx-auto">
              Tidak ada artikel yang cocok dengan kata pencarian atau kategori yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#E52E2D] hover:bg-[#C12A26] rounded-full shadow-xs transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleArticles.map((art) => {
                const rawDate = art.created_at || art.date;
                const displayDate = formatIndonesianDate(rawDate);
                const imgUrl =
                  art.imageUrl ||
                  art.image_url ||
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600";

                const parsed = parseRichTextToPlainText(art.content || art.summary);
                const excerptText =
                  parsed && parsed.trim().length > 10 && parsed.trim().toLowerCase() !== "tes"
                    ? parsed
                    : "Simak ulasan lengkap, gagasan mendalam, dan warta literasi seputar karya terbitan Pustaka Iman.";

                return (
                  <Link
                    key={art.id}
                    href={`/warta/${art.slug || art.id}`}
                    prefetch={false}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group block"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden border-b border-gray-100">
                        <Image
                          src={imgUrl}
                          alt={art.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-[#E52E2D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                          {art.category || "WARTA"}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Calendar size={13} className="text-[#E52E2D]" />
                          <span>{displayDate}</span>
                        </div>

                        <h3 className="font-serif font-black text-base sm:text-lg text-[#272522] leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
                          {art.title}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {excerptText}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E52E2D]">
                      <span>Baca Selengkapnya</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-3 bg-white border border-gray-200 hover:border-[#E52E2D] hover:text-[#E52E2D] text-[#272522] text-xs sm:text-sm font-bold rounded-full shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  Muat Lebih Banyak Artikel ({filteredArticles.length - displayCount} tersisa)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
