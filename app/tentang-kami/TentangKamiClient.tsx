"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Send,
  MessageCircle,
  ArrowLeft,
  Building2,
  Target,
  Eye,
  BookOpen,
  Award,
  Sparkles,
  Heart,
  Users,
  Compass,
  FileCheck2,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_ABOUT_INFO = {
  headline: "Penerbitan Bermakna, Menginspirasi Peradaban",
  description:
    "Didirikan sejak tahun 2001, Pustaka Iman hadir sebagai rumah penerbitan profesional yang mendedikasikan diri untuk mencerdaskan kehidupan bangsa melalui literasi berkualitas tinggi, baik karya penulis tanah air maupun karya terjemahan dari Bahasa Arab dan Inggris.",
  stats: [
    { value: "2001", label: "Tahun Berdiri Resmi", isRed: true },
    { value: "500+", label: "Judul Buku Diterbitkan", isRed: false },
    { value: "100%", label: "Kualitas Keilmuan Kurasi", isRed: true },
    { value: "Top Best-Seller", label: "Kategori Buku Favorit", isRed: false },
  ],
  vision:
    "Ikut berpartisipasi aktif membangun kebudayaan, memperkaya khazanah pemikiran Islam dan umum, serta memperkokoh pendidikan manusia Indonesia yang beradab dan berpengetahuan luas.",
  mission:
    "Menerbitkan buku-buku berkualitas tinggi yang memberikan kontribusi nyata bagi pendidikan, pembentukan karakter nasional, dan penyebaran literasi yang mencerahkan seluruh lapisan masyarakat.",
  pillars: [
    {
      title: "Kurasi Naskah Ketat",
      description:
        "Setiap naskah yang diterbitkan melalui proses penyuntingan, verifikasi sumber, dan kurasi substansi yang mendalam.",
      icon: "FileCheck2",
    },
    {
      title: "Jembatan Bahasa & Budaya",
      description:
        "Menerjemahkan khazanah pemikiran terbaik berbahasa Arab dan Inggris agar dapat diakses dengan lugas oleh pembaca Indonesia.",
      icon: "BookOpen",
    },
    {
      title: "Best-Seller Berkualitas",
      description:
        "Menghasilkan karya-karya bermutu tinggi yang terus dicetak ulang dan menjadi referensi utama akademisi serta publik.",
      icon: "Award",
    },
  ],
};

const PILLAR_ICONS: Record<string, any> = {
  FileCheck2,
  BookOpen,
  Award,
  Sparkles,
  Heart,
  Users,
  Compass,
  Building2,
  Target,
  Eye,
};

export default function TentangKamiClient() {
  const pageUrl = "https://pustakaiiman.com/tentang-kami";
  const shareText = "Pustaka Iman - Penerbit Profesional & Berpengalaman di Indonesia";

  const [aboutInfo, setAboutInfo] = useState(DEFAULT_ABOUT_INFO);

  useEffect(() => {
    async function fetchAboutSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("about_headline, about_description, about_stats, about_vision, about_mission, about_pillars")
          .eq("id", "default")
          .maybeSingle();

        if (!error && data) {
          setAboutInfo({
            headline: data.about_headline || DEFAULT_ABOUT_INFO.headline,
            description: data.about_description || DEFAULT_ABOUT_INFO.description,
            stats:
              Array.isArray(data.about_stats) && data.about_stats.length > 0
                ? data.about_stats
                : DEFAULT_ABOUT_INFO.stats,
            vision: data.about_vision || DEFAULT_ABOUT_INFO.vision,
            mission: data.about_mission || DEFAULT_ABOUT_INFO.mission,
            pillars:
              Array.isArray(data.about_pillars) && data.about_pillars.length > 0
                ? data.about_pillars
                : DEFAULT_ABOUT_INFO.pillars,
          });
        }
      } catch (err) {
        console.error("Error fetching about info from site_settings:", err);
      }
    }
    fetchAboutSettings();
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 text-[#272522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-50 border border-red-100 text-xs font-bold text-[#E52E2D] rounded-full uppercase tracking-wider">
              <Building2 size={13} />
              Profil & Identitas Penerbit
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272522] leading-tight tracking-tight">
              {aboutInfo.headline}
            </h1>
            <p className="text-sm sm:text-base text-[#76716A] leading-relaxed font-sans">
              {aboutInfo.description}
            </p>
          </div>

          {/* Dynamic Milestones Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            {aboutInfo.stats.map((statItem: any, idx: number) => {
              const val = statItem.value || statItem.number || statItem.count || "-";
              const lbl = statItem.label || statItem.title || statItem.description || "";
              const isRed = statItem.isRed ?? statItem.is_red ?? (idx % 2 === 0);

              return (
                <div key={idx} className="p-4 bg-gray-50/80 border border-gray-200/60 rounded-2xl">
                  <div
                    className={`text-2xl sm:text-3xl font-black font-serif ${
                      isRed ? "text-[#E52E2D]" : "text-[#272522]"
                    }`}
                  >
                    {val}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">{lbl}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Visi Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#E52E2D]/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E52E2D] flex items-center justify-center border border-red-100 shadow-2xs">
                <Eye size={24} strokeWidth={2} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E52E2D] block mb-1">
                  Arah & Pandangan
                </span>
                <h2 className="font-serif text-2xl font-bold text-gray-900">Visi Kami</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {aboutInfo.vision}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-500">
              <Sparkles size={14} className="text-[#E52E2D]" />
              <span>Landasan Karya & Publikasi Utama</span>
            </div>
          </div>

          {/* Misi Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#E52E2D]/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E52E2D] flex items-center justify-center border border-red-100 shadow-2xs">
                <Target size={24} strokeWidth={2} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E52E2D] block mb-1">
                  Komitmen Utama
                </span>
                <h2 className="font-serif text-2xl font-bold text-gray-900">Misi Kami</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {aboutInfo.mission}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-500">
              <Compass size={14} className="text-[#E52E2D]" />
              <span>Pedoman Operasional & Kurasi Naskah</span>
            </div>
          </div>

        </div>

        {/* Core Values / Pillars Section */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E52E2D]">
              Prinsip & Nilai Dasar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Pilar Keunggulan Pustaka Iman
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aboutInfo.pillars.map((pillar: any, idx: number) => {
              const pTitle = pillar.title || pillar.name || "Pilar Utama";
              const pDesc = pillar.description || pillar.desc || "";
              const iconKey = pillar.icon || pillar.iconName || "";
              const IconComp = PILLAR_ICONS[iconKey] || [FileCheck2, BookOpen, Award][idx % 3];

              return (
                <div key={idx} className="space-y-2 p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] flex items-center justify-center shadow-2xs mb-3 border border-gray-200">
                    <IconComp size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{pTitle}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{pDesc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner: Menerbitkan Naskah bersama kami */}
        <div className="bg-gradient-to-r from-gray-900 via-[#272522] to-gray-900 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 uppercase tracking-wider">
              <Sparkles size={12} />
              Kirimkan Karya Terbaik Anda
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Ingin Menerbitkan Naskah Bersama Pustaka Iman?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Kami selalu terbuka untuk berkolaborasi dengan para penulis, cendekiawan, dan peneliti Indonesia untuk menerbitkan karya yang menginspirasi.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/kirim-naskah"
              className="w-full sm:w-auto text-center px-6 py-3 bg-[#E52E2D] hover:bg-[#C12A26] text-white text-xs font-bold rounded-xl uppercase tracking-wide transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Kirim Naskah</span>
              <ChevronRight size={15} />
            </Link>
            <Link
              href="/katalog"
              className="w-full sm:w-auto text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl uppercase tracking-wide transition-all border border-white/20"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>

        {/* Share Section Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">
            <Share2 size={15} className="text-[#E52E2D]" />
            <span>Bagikan Halaman Profil Ini:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Twitter / X</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${pageUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95"
            >
              <MessageCircle size={16} fill="currentColor" />
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold rounded-xl shadow-2xs transition-all active:scale-95"
            >
              <Send size={16} />
              <span>Telegram</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
