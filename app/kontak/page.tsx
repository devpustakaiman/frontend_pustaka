"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telpon: "",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: "", email: "", telpon: "", pesan: "" });
    }, 4000);
  };

  const recentPosts = [
    {
      title: "Pustaka Iman Meluncurkan Inisiatif Literasi Digital Nusantara",
      href: "/warta",
    },
    {
      title: "Rekomendasi Buku Islam Kontemporer Terbaik Tahun Ini",
      href: "/warta",
    },
    {
      title: "Mengenal Lebih Dekat Karya-Karya Pilihan Penerbit Mizan",
      href: "/warta",
    },
    {
      title: "Tips Memilih Buku Bacaan Islami untuk Keluarga & Anak",
      href: "/warta",
    },
    {
      title: "Panduan Lengkap Pengiriman Naskah ke Redaksi Pustaka Iman",
      href: "/kirim-naskah",
    },
  ];

  const categories = [
    { name: "Agama & Filsafat", href: "/katalog?category=Agama%20%26%20Filsafat" },
    { name: "Fiksi & Novel", href: "/katalog?category=Fiksi" },
    { name: "Buku Anak & Komik", href: "/katalog?category=Buku%20Anak" },
    { name: "Non Fiksi & Biografi", href: "/katalog?category=Non%20Fiksi" },
    { name: "Pengembangan Diri", href: "/katalog?category=Pengembangan%20Diri" },
    { name: "Warta Utama", href: "/warta" },
  ];

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back to Home Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-[#EAE5D9] rounded-full hover:bg-white/80 hover:border-[#B67A2D]/40 shadow-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#EAE5D9] pb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D]">
            Layanan Pelanggan
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Kontak Kami
          </h1>
          <p className="text-sm text-[#76716A] mt-2">
            Ada pertanyaan, saran, atau kerja sama? Silakan kirimkan pesan Anda melalui formulir di bawah ini.
          </p>
        </div>

        {/* Responsive 2-Column Grid (Left: Form + Share, Right: Sidebar) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Contact Form & Share Section */}
          <div className="bg-white border border-[#EAE5D9] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
            
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-emerald-900">
                  Pesan Anda Berhasil Terkirim!
                </h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                  Terima kasih telah menghubungi Pustaka Iman. Tim kami akan segera menanggapi pesan Anda melalui alamat email yang diberikan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap Anda..."
                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#EAE5D9] focus:border-[#B67A2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#B67A2D]/20 transition-all"
                  />
                </div>

                {/* Alamat Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Alamat Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@contoh.com..."
                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#EAE5D9] focus:border-[#B67A2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#B67A2D]/20 transition-all"
                  />
                </div>

                {/* Telpon */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Telpon
                  </label>
                  <input
                    type="tel"
                    value={formData.telpon}
                    onChange={(e) => setFormData({ ...formData, telpon: e.target.value })}
                    placeholder="Nomor telepon / WhatsApp..."
                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#EAE5D9] focus:border-[#B67A2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#B67A2D]/20 transition-all"
                  />
                </div>

                {/* Komentar / Pertanyaan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Komentar / Pertanyaan <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    placeholder="Tuliskan komentar atau pertanyaan Anda di sini..."
                    className="w-full px-4 py-3 bg-[#FAF8F3] border border-[#EAE5D9] focus:border-[#B67A2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#B67A2D]/20 transition-all resize-y"
                  />
                </div>

                {/* Simple Outline Button for 'Kirim' */}
                <div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-transparent hover:bg-[#272522] text-[#272522] hover:text-white border-2 border-[#272522] rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs inline-flex items-center gap-2"
                  >
                    <span>Kirim</span>
                    <Send size={15} strokeWidth={2} />
                  </button>
                </div>

              </form>
            )}

            {/* SHARE SECTION: Below Form with 5 Solid Colored Social Media Icons */}
            <div className="pt-6 border-t border-[#EAE5D9] flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold text-[#272522] uppercase tracking-wider">
                Share:
              </span>
              <div className="flex items-center gap-2.5">
                
                {/* 1. Facebook (#1877F2) */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Facebook"
                  className="w-9 h-9 bg-[#1877F2] text-white rounded-md flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* 2. Twitter / X (#000000) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Twitter/X"
                  className="w-9 h-9 bg-black text-white rounded-md flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* 3. WhatsApp (#25D366) */}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via WhatsApp"
                  className="w-9 h-9 bg-[#25D366] text-white rounded-md flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>

                {/* 4. Telegram (#229ED9) */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Telegram"
                  className="w-9 h-9 bg-[#229ED9] text-white rounded-md flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>

                {/* 5. Line (#00C300) */}
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Line"
                  className="w-9 h-9 bg-[#00C300] text-white rounded-md flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63h-2.425v1.125h2.425c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-3.056c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63h3.056c.349 0 .63.285.63.63 0 .349-.281.63-.63.63h-2.425v1.125h2.425zm-6.787-2.385c.345 0 .63.285.63.63v4.773c0 .344-.285.629-.63.629-.349 0-.63-.285-.63-.629V8.108c0-.345.281-.63.63-.63zm-2.458 0c.349 0 .63.285.63.63v4.773c0 .344-.281.629-.63.629-.17 0-.324-.067-.44-.177L6.87 8.92v3.951c0 .344-.285.629-.63.629-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.17 0 .324.067.44.177l2.81 4.394V8.108c0-.345.285-.63.63-.63zM3.488 8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.773h2.425c.349 0 .63.283.63.63 0 .344-.281.629-.63.629H4.118c-.345 0-.63-.285-.63-.629V8.108z"/>
                  </svg>
                </a>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Pos-pos Terbaru & Kategori) */}
          <div className="bg-white border border-[#EAE5D9] rounded-2xl p-6 shadow-sm space-y-8">
            
            {/* Section 1: Pos-pos Terbaru */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#272522] pb-2 border-b border-[#EAE5D9]">
                Pos-pos Terbaru
              </h3>
              <ul className="space-y-3">
                {recentPosts.map((post, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 group">
                    <span className="w-2 h-2 rounded-full border border-[#107B75] bg-transparent shrink-0 mt-1.5 group-hover:bg-[#107B75] transition-colors" />
                    <Link
                      href={post.href}
                      className="text-xs sm:text-sm font-medium text-[#107B75] hover:text-[#0D635E] hover:underline leading-snug transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Kategori */}
            <div className="space-y-4 pt-4 border-t border-[#EAE5D9]">
              <h3 className="font-serif text-lg font-bold text-[#272522] pb-2 border-b border-[#EAE5D9]">
                Kategori
              </h3>
              <ul className="space-y-2.5">
                {categories.map((cat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 group">
                    <span className="w-2 h-2 rounded-full border border-[#107B75] bg-transparent shrink-0 group-hover:bg-[#107B75] transition-colors" />
                    <Link
                      href={cat.href}
                      className="text-xs sm:text-sm font-medium text-[#107B75] hover:text-[#0D635E] hover:underline transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
