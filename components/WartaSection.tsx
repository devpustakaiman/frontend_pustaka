"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronRight, BookOpen, X, Clock } from "lucide-react";
import { parseRichTextToPlainText, formatIndonesianDate } from "@/lib/utils";
import { Article, MediaVideo } from "@/lib/api";

interface WartaSectionProps {
  articles?: Article[];
  videos?: MediaVideo[];
}

export function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return "https://www.youtube.com/embed/t_cWQkwBDps?autoplay=1";
  if (url.includes("embed/")) {
    return url.includes("autoplay=") ? url : `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
  }
  return url;
}

export default function WartaSection({ articles = [], videos = [] }: WartaSectionProps) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  // Close modal on Escape key press
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

  // Video Datasets
  const defaultVideo: MediaVideo = {
    id: "vid-1",
    title: "Mengenal Sosok Syekh Nawawi Al-Bantani: Mahaguru Ulama Nusantara",
    category: "LIPUTAN UTAMA",
    duration: "08:42",
    youtube_url: "https://www.youtube.com/embed/t_cWQkwBDps?autoplay=1",
    image_url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
  };

  const featuredVideo = videos.find((v) => v.is_featured) || videos[0] || defaultVideo;

  const displayArticles = articles.length >= 2 ? articles.slice(0, 2) : [
    {
      id: "art-1",
      title: "Diapresiasi Tiga Media Raksasa Iran, Pustaka Iman Dorong Literasi Keislaman Global",
      category: "MEDIA INTERNASIONAL",
      date: "2026-08-14",
      image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "art-2",
      title: "Siswa Bukan Sekadar Cari Nilai: Pentingnya Literasi Kritis di Sekolah",
      category: "WAWANCARA",
      date: "2026-08-10",
      image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const handlePlayVideo = (video: MediaVideo) => {
    const rawUrl = video.youtube_url || video.video_url;
    setSelectedVideoUrl(getYouTubeEmbedUrl(rawUrl));
  };

  return (
    <section className="w-full bg-white py-10 md:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Side-by-Side Preview Container (2 Columns on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN (lg:col-span-6): MEDIA & CERITA                */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-4">
            {/* Header */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] mb-1">
                <Play size={12} fill="currentColor" className="text-[#E52E2D]" />
                MEDIA &amp; CERITA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#272522] tracking-tight">
                Cerita <span className="text-[#C12A26] italic font-serif">dalam Sorotan</span>
              </h2>
            </div>

            {/* Single Cinematic Standalone Video Card */}
            <div
              onClick={() => handlePlayVideo(featuredVideo)}
              className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md bg-black group cursor-pointer border border-gray-100"
            >
              {/* Thumbnail Image */}
              <Image
                src={
                  featuredVideo.image_url ||
                  featuredVideo.thumbnail_url ||
                  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800"
                }
                alt={featuredVideo.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Red Pill Badge Top-Left */}
              <span className="absolute top-4 left-4 bg-[#E52E2D] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md z-10">
                {featuredVideo.category || "LIPUTAN UTAMA"}
              </span>

              {/* Center Floating Red Play Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayVideo(featuredVideo);
                }}
                aria-label="Tonton Video"
                className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E52E2D] hover:bg-[#C12A26] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
              >
                <Play size={24} fill="currentColor" className="ml-1" />
              </button>

              {/* Bottom Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-5 flex items-end justify-between gap-4 pointer-events-none">
                <h3 className="text-base sm:text-lg font-serif font-black text-white line-clamp-2 drop-shadow max-w-xl">
                  {featuredVideo.title}
                </h3>
                {featuredVideo.duration && (
                  <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md shrink-0 border border-white/10 flex items-center gap-1">
                    <Clock size={12} />
                    <span>{featuredVideo.duration}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN (lg:col-span-6): JURNAL PUSTAKA               */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] mb-1">
                  <BookOpen size={12} className="text-[#E52E2D]" />
                  JURNAL PUSTAKA
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#272522] tracking-tight">
                  Warta, Gagasan &amp; <span className="text-[#C12A26] italic font-serif">Pengumuman</span>
                </h2>
              </div>

              <Link
                href="/warta"
                className="group inline-flex items-center gap-1 text-xs font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-3.5 py-2 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0"
              >
                <span>Lihat Semua Warta</span>
                <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
              </Link>
            </div>

            {/* Two Stacked Horizontal Article Preview Cards */}
            <div className="space-y-4">
              {displayArticles.map((item) => {
                const rawDate = item.created_at || item.date;
                const displayDate = formatIndonesianDate(rawDate);
                const imgUrl =
                  item.imageUrl ||
                  item.image_url ||
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";

                const parsed = parseRichTextToPlainText(item.content || item.summary);
                const excerptText =
                  parsed && parsed.trim().length > 10 && parsed.trim().toLowerCase() !== "tes"
                    ? parsed
                    : "Kabar terbaru dan catatan literasi mendalam seputar perbukuan.";

                return (
                  <Link
                    key={item.id}
                    href={`/warta/${item.id}`}
                    className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col sm:flex-row items-center gap-4 sm:gap-5 group block"
                  >
                    {/* Thumbnail Left */}
                    <div className="w-full sm:w-36 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                      <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        sizes="144px"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col justify-between flex-1 w-full h-full min-w-0 space-y-2">
                      <div>
                        <span className="text-[11px] font-bold text-[#E52E2D] uppercase tracking-wider block mb-1">
                          {item.category || "WARTA UTAMA"}
                        </span>
                        <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {excerptText}
                        </p>
                      </div>

                      {/* Bottom Meta Row */}
                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-400 font-medium">{displayDate}</span>
                        <span className="text-[#E52E2D] font-bold text-sm flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          <span>Baca &rarr;</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Video Modal (Lightbox) */}
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
    </section>
  );
}
