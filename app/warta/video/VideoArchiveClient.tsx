"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  Search,
  Clock,
  X,
  ChevronRight,
  Filter,
  Film,
} from "lucide-react";
import { formatIndonesianDate } from "@/lib/utils";
import { MediaVideo, getMediaVideos } from "@/lib/api";
import { getYouTubeEmbedUrl } from "@/components/WartaSection";

interface VideoArchiveClientProps {
  initialVideos?: MediaVideo[];
}

const ITEMS_PER_PAGE = 8;

export default function VideoArchiveClient({ initialVideos = [] }: VideoArchiveClientProps) {
  const [videos, setVideos] = useState<MediaVideo[]>(initialVideos);
  const [loading, setLoading] = useState(initialVideos.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Client-side revalidation on mount
  useEffect(() => {
    async function loadVideos() {
      try {
        const fresh = await getMediaVideos();
        if (fresh && fresh.length > 0) {
          setVideos(fresh);
        }
      } catch (err) {
        console.error("Gagal memuat arsip video:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideoUrl(null);
      }
    };
    if (selectedVideoUrl) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVideoUrl]);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => {
      if (v.category && v.category.trim()) {
        set.add(v.category.trim());
      }
    });
    return ["Semua", ...Array.from(set)];
  }, [videos]);

  // Filtered video list
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchCat =
        selectedCategory === "Semua" ||
        (v.category && v.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        v.title.toLowerCase().includes(query) ||
        (v.description && v.description.toLowerCase().includes(query)) ||
        (v.speaker_name && v.speaker_name.toLowerCase().includes(query)) ||
        (v.category && v.category.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  const visibleVideos = filteredVideos.slice(0, displayCount);
  const hasMore = displayCount < filteredVideos.length;

  const handleOpenVideo = (v: MediaVideo) => {
    const rawUrl = v.youtube_url || v.video_url;
    setSelectedVideoUrl(getYouTubeEmbedUrl(rawUrl));
  };

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
            <span className="text-[#272522] font-semibold">Arsip Video</span>
          </div>

          <div className="border-b border-gray-100 pb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-2">
              <Film size={12} className="text-[#E52E2D]" />
              ARSIP MEDIA &amp; VIDEO
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#272522] tracking-tight">
              Galeri Video <span className="text-[#C12A26] italic font-serif">Pustaka Iman</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium max-w-2xl">
              Tonton dokumenter eksklusif, wawancara penulis, bedah buku, dan liputan kegiatan literasi Islami.
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
                placeholder="Cari judul video, topik, atau penceramah..."
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
              Menampilkan <span className="font-bold text-[#272522]">{filteredVideos.length}</span> video
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Filter size={12} /> Filter:
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

        {/* Video Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-red-50 text-[#E52E2D] rounded-full flex items-center justify-center mx-auto">
              <Film size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#272522]">Video Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-[#76716A] max-w-md mx-auto">
              Tidak ada video yang cocok dengan kata kunci kata pencarian atau filter yang dipilih.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleVideos.map((vid) => {
                const imgUrl =
                  vid.image_url ||
                  vid.thumbnail_url ||
                  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600";

                const dateText = vid.created_at ? formatIndonesianDate(vid.created_at) : null;

                return (
                  <div
                    key={vid.id}
                    onClick={() => handleOpenVideo(vid)}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Video Thumbnail with Hover Overlay & Play Button */}
                      <div className="relative aspect-video bg-black overflow-hidden border-b border-gray-100">
                        <Image
                          src={imgUrl}
                          alt={vid.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          loading="lazy"
                          className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Top Left Category Pill */}
                        <span className="absolute top-2.5 left-2.5 bg-[#E52E2D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                          {vid.category || "LIPUTAN"}
                        </span>

                        {/* Hover Overlay Play Icon */}
                        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#E52E2D] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 z-10">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>

                        {/* Duration Pill Bottom Right */}
                        {vid.duration && (
                          <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10 border border-white/10">
                            <Clock size={10} />
                            <span>{vid.duration}</span>
                          </span>
                        )}
                      </div>

                      {/* Video Info Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#272522] leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
                          {vid.title}
                        </h3>

                        {vid.speaker_name && (
                          <p className="text-xs text-[#76716A]">
                            Narasumber: <span className="font-semibold text-[#272522]">{vid.speaker_name}</span>
                            {vid.speaker_role ? ` (${vid.speaker_role})` : ""}
                          </p>
                        )}

                        {vid.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {vid.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E52E2D]">
                      <span className="text-gray-400 font-normal">{dateText || "Pustaka Iman"}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Putar Video</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
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
                  Muat Lebih Banyak Video ({filteredVideos.length - displayCount} tersisa)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Modal / Lightbox */}
      {selectedVideoUrl && (
        <div
          onClick={() => setSelectedVideoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/20"
          >
            <button
              type="button"
              onClick={() => setSelectedVideoUrl(null)}
              aria-label="Tutup Video"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-white hover:text-black flex items-center justify-center transition-colors cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>
            <iframe
              className="w-full h-full"
              src={selectedVideoUrl}
              title="Media Video Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
