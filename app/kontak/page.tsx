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
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back to Home Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <span className="text-xs uppercase tracking-wider font-bold text-[#E52E2D]">
            Layanan Pelanggan
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Kontak <span className="text-[#C12A26] italic font-serif">Kami</span>
          </h1>
          <p className="text-sm text-[#76716A] mt-2">
            Ada pertanyaan, saran, atau kerja sama? Silakan kirimkan pesan Anda melalui formulir di bawah ini.
          </p>
        </div>

        {/* Responsive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Contact Form & Share Section */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
            
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
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
                    Nama Lengkap <span className="text-[#E52E2D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap Anda..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                  />
                </div>

                {/* Alamat Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Alamat Email <span className="text-[#E52E2D]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@contoh.com..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                  />
                </div>

                {/* Komentar / Pertanyaan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#272522] uppercase tracking-wider">
                    Komentar / Pertanyaan <span className="text-[#E52E2D]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    placeholder="Tuliskan komentar atau pertanyaan Anda di sini..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all resize-y"
                  />
                </div>

                {/* Solid Red Button for 'Kirim' */}
                <div>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#E52E2D] hover:bg-[#C12A26] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-md inline-flex items-center gap-2"
                  >
                    <span>Kirim Pesan</span>
                    <Send size={15} strokeWidth={2} />
                  </button>
                </div>

              </form>
            )}

            {/* SHARE SECTION */}
            <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold text-[#272522] uppercase tracking-wider">
                Share:
              </span>
              <div className="flex items-center gap-2.5">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Facebook"
                  className="w-9 h-9 bg-[#1877F2] text-white rounded-xl flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* 2. Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Twitter/X"
                  className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* 3. WhatsApp */}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via WhatsApp"
                  className="w-9 h-9 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>

                {/* 4. Telegram */}
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share via Telegram"
                  className="w-9 h-9 bg-[#229ED9] text-white rounded-xl flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Pos-pos Terbaru & Kategori) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-8">
            
            {/* Section 1: Pos-pos Terbaru */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#272522] pb-2 border-b border-gray-200">
                Pos-pos Terbaru
              </h3>
              <ul className="space-y-3">
                {recentPosts.map((post, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 group">
                    <span className="w-2 h-2 rounded-full border border-[#E52E2D] bg-transparent shrink-0 mt-1.5 group-hover:bg-[#E52E2D] transition-colors" />
                    <Link
                      href={post.href}
                      className="text-xs sm:text-sm font-medium text-[#272522] group-hover:text-[#E52E2D] hover:underline leading-snug transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Kategori */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-serif text-lg font-bold text-[#272522] pb-2 border-b border-gray-200">
                Kategori
              </h3>
              <ul className="space-y-2.5">
                {categories.map((cat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 group">
                    <span className="w-2 h-2 rounded-full border border-[#E52E2D] bg-transparent shrink-0 group-hover:bg-[#E52E2D] transition-colors" />
                    <Link
                      href={cat.href}
                      className="text-xs sm:text-sm font-medium text-[#272522] group-hover:text-[#E52E2D] hover:underline transition-colors"
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
