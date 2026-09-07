"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  ChevronRight,
  BookOpen,
  X,
  Clock,
} from "lucide-react";
import { parseRichTextToPlainText, formatIndonesianDate } from "@/lib/utils";
import { Article, MediaVideo, getArticles, getMediaVideos } from "@/lib/api";
import { getYouTubeEmbedUrl } from "@/components/WartaSection";

interface WartaPageClientProps {
  articles?: Article[];
  videos?: MediaVideo[];
}

export default function WartaPageClient({ articles = [], videos = [] }: WartaPageClientProps) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [articleItems, setArticleItems] = useState<Article[]>(articles);
  const [videoItems, setVideoItems] = useState<MediaVideo[]>(videos);

  useEffect(() => {
    setArticleItems(articles);
  }, [articles]);

  useEffect(() => {
    setVideoItems(videos);
  }, [videos]);

  // Client-side revalidation on mount
  useEffect(() => {
    async function loadLatestWartaData() {
      try {
        const freshArticles = await getArticles();
        if (freshArticles && freshArticles.length > 0) {
          setArticleItems(freshArticles);
        }
        const freshVideos = await getMediaVideos();
        if (freshVideos && freshVideos.length > 0) {
          setVideoItems(freshVideos);
        }
      } catch (err) {
        console.error("Error revalidating warta data on mount:", err);
      }
    }
    loadLatestWartaData();
  }, []);

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

  // Separate featured video and next videos slice(0, 4)
  const featuredVideo = videoItems.find((v) => v.is_featured) || videoItems[0] || null;
  const nextVideos = featuredVideo
    ? videoItems.filter((v) => v.id !== featuredVideo.id).slice(0, 4)
    : [];

  const openVideo = (video: MediaVideo) => {
    const rawUrl = video.youtube_url || video.video_url;
    setSelectedVideoUrl(getYouTubeEmbedUrl(rawUrl));
  };

  const featuredArticle = articleItems[0] || null;
  const sideArticles = articleItems.length > 1 ? articleItems.slice(1, 4) : [];

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 text-[#272522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Back Navigation Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SECTION 1: MEDIA & CERITA — Cerita dalam Sorotan           */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 mb-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-2">
                <Play size={12} fill="currentColor" className="text-[#E52E2D]" />
                MEDIA &amp; CERITA
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#272522] tracking-tight">
                Cerita <span className="text-[#C12A26] italic font-serif">dalam Sorotan</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Kumpulan video wawancara, liputan eksklusif, dan cerita di balik karya.
              </p>
            </div>

            <Link
              href="/warta/video"
              prefetch={false}
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Lihat Semua Video</span>
              <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>

          {/* Balanced Max 4XL Cinematic Video Player Showcase */}
          <div
            onClick={() => openVideo(featuredVideo)}
            className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-black aspect-video relative my-4 flex items-center justify-center cursor-pointer group"
          >
            {/* Thumbnail Image */}
            <Image
              src={
                featuredVideo.image_url ||
                featuredVideo.thumbnail_url ||
                "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=1200"
              }
              alt={featuredVideo.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Soft Gradient Overlay at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Floating Top-Left Badge */}
            <span className="absolute top-4 sm:top-5 left-4 sm:left-5 bg-[#E52E2D] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md z-10">
              {featuredVideo.category || "LIPUTAN UTAMA"}
            </span>

            {/* Floating Center Red Play Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openVideo(featuredVideo);
              }}
              aria-label="Tonton Video"
              className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E52E2D] hover:bg-[#C12A26] flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
            >
              <Play size={24} fill="currentColor" className="ml-1" />
            </button>

            {/* Floating Bottom-Left Title & Duration */}
            <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-10">
              <h2 className="text-lg sm:text-2xl font-serif font-black text-white drop-shadow-md line-clamp-2 max-w-2xl">
                {featuredVideo.title}
              </h2>
              {featuredVideo.duration && (
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg shrink-0 w-fit flex items-center gap-1.5 border border-white/10">
                  <Clock size={12} />
                  <span>{featuredVideo.duration}</span>
                </span>
              )}
            </div>
          </div>

          {/* 'Video Berikutnya' Bar */}
          <div className="pt-2">
            <h3 className="font-serif text-lg font-bold text-[#272522] mb-3">Video Berikutnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nextVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => openVideo(vid)}
                  className="bg-white border border-gray-200/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-red-200 transition-all cursor-pointer group"
                >
                  <div className="relative w-full aspect-video rounded-xl bg-gray-950 overflow-hidden mb-3 border border-gray-100">
                    <Image
                      src={
                        vid.image_url ||
                        vid.thumbnail_url ||
                        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={vid.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {vid.duration && (
                      <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {vid.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#E52E2D] uppercase tracking-wider block mb-0.5">
                      {vid.category || "DOKUMENTER"}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#272522] leading-snug line-clamp-2 group-hover:text-[#E52E2D] transition-colors">
                      {vid.title}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-100 text-xs font-bold text-[#E52E2D]">
                    <span>Tonton Video</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SECTION 2: JURNAL PUSTAKA — Warta, Gagasan & Pengumuman    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-gray-100 pb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 mb-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-2">
                <BookOpen size={12} className="text-[#E52E2D]" />
                JURNAL PUSTAKA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#272522] tracking-tight">
                Warta, Gagasan &amp; <span className="text-[#C12A26] italic font-serif">Pengumuman</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Artikel opini, warta pers, dan kabar publikasi dari Pustaka Iman.
              </p>
            </div>

            <Link
              href="/warta/berita"
              prefetch={false}
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0"
            >
              <span>Lihat Semua Artikel</span>
              <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>

          {/* Editorial Grid: Left Major Card (7 cols) + Right Stacked Cards (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Major Card (Featured Article) */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <Link
                href={`/warta/${featuredArticle.slug || featuredArticle.id}`}
                prefetch={false}
                className="h-full flex flex-col justify-between bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs hover:shadow-md hover:border-red-200 transition-all group block"
              >
                <div>
                  {/* Large Image */}
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 mb-5 border border-gray-100 relative">
                    <Image
                      src={
                        featuredArticle.imageUrl ||
                        featuredArticle.image_url ||
                        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={featuredArticle.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Badge */}
                  <span className="bg-red-50 text-[#E52E2D] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-red-100">
                    {featuredArticle.category || "MEDIA INTERNASIONAL"}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-snug group-hover:text-[#E52E2D] transition-colors">
                    {featuredArticle.title}
                  </h3>

                  {/* Caption snippet */}
                  <p className="text-xs sm:text-sm text-[#76716A] mt-2.5 line-clamp-3 leading-relaxed">
                    {parseRichTextToPlainText(featuredArticle.content || featuredArticle.summary) ||
                      "Liputan khusus mengenai respon positif media luar negeri terhadap terbitan karya-karya pemikiran Islam klasik dan kontemporer dari Pustaka Iman."}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {formatIndonesianDate(featuredArticle.created_at || featuredArticle.date)}
                  </span>
                  <span className="text-xs font-bold text-[#E52E2D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Baca Selengkapnya</span>
                    <span>&rarr;</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Stacked Side Cards (5 cols) — 3 Cards neatly balanced with Left Featured Card */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5 h-full">
              {sideArticles.map((art) => {
                const rawDate = art.created_at || art.date;
                const displayDate = formatIndonesianDate(rawDate);
                const imgUrl =
                  art.imageUrl ||
                  art.image_url ||
                  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400";

                const parsed = parseRichTextToPlainText(art.content || art.summary);
                const excerptText =
                  parsed && parsed.trim().length > 10 && parsed.trim().toLowerCase() !== "tes"
                    ? parsed
                    : "Simak ulasan lengkap, gagasan mendalam, dan telaah literasi seputar perkembangan isu terkini di dunia perbukuan.";

                return (
                  <Link
                    key={art.id}
                    href={`/warta/${art.slug || art.id}`}
                    prefetch={false}
                    className="bg-white border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 group block flex-1"
                  >
                    {/* Left: Prominent Thumbnail */}
                    <div className="w-full sm:w-28 md:w-32 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-2xs relative">
                      <Image
                        src={imgUrl}
                        alt={art.title}
                        fill
                        sizes="130px"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Right: Content Column */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 space-y-1.5 w-full">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#E52E2D] uppercase tracking-wider block mb-0.5">
                          {art.category || "OPINI & GAGASAN"}
                        </span>
                        <h3 className="text-xs sm:text-sm font-serif font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E52E2D] transition-colors">
                          {art.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 leading-relaxed mt-0.5">
                          {excerptText}
                        </p>
                      </div>

                      {/* Bottom Meta Row */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100 text-[11px] sm:text-xs">
                        <span className="text-gray-400 font-medium">{displayDate}</span>
                        <span className="font-bold text-[#E52E2D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Baca</span>
                          <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

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
    </div>
  );
}
