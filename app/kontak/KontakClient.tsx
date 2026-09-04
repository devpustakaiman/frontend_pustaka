"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Share2,
  ChevronDown,
  BookOpen,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { Article } from "@/lib/api";

interface KontakClientProps {
  articles: Article[];
}

const FAQS = [
  {
    question: "Bagaimana cara melakukan pembelian buku?",
    answer: "Anda dapat memesan buku melalui Katalog Produk kami, WhatsApp resmi, atau marketplace seperti Mizanstore dan Tokopedia resmi Pustaka Iman.",
  },
  {
    question: "Berapa lama proses pengiriman buku pesanan?",
    answer: "Pesanan akan diproses dalam 1-2 hari kerja setelah verifikasi pembayaran. Estimasi pengiriman mengikuti ekspedisi terpesan.",
  },
  {
    question: "Bagaimana prosedur pengiriman naskah ke Pustaka IIMaN?",
    answer: "Anda dapat mengirimkan naskah dalam format PDF beserta sinopsis lengkap melalui halaman Kirim Naskah di website resmi kami.",
  },
];

export default function KontakClient({ articles = [] }: KontakClientProps) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telpon: "",
    subjek: "Pertanyaan Umum",
    pesan: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "https://pustakaiiman.com/kontak";
  const shareText = "Hubungi Pustaka IIMaN - Penerbit Buku Berkualitas di Indonesia";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: "", email: "", telpon: "", subjek: "Pertanyaan Umum", pesan: "" });
    }, 5000);
  };

  // Recent 5 articles for sidebar
  const recentArticles = articles.slice(0, 5);

  const categories = [
    { name: "Agama & Filsafat", href: "/katalog?category=Agama%20%26%20Filsafat" },
    { name: "Fiksi & Novel", href: "/katalog?category=Fiksi" },
    { name: "Buku Anak & Komik", href: "/katalog?category=Buku%20Anak" },
    { name: "Non Fiksi & Biografi", href: "/katalog?category=Non%20Fiksi" },
    { name: "Pengembangan Diri", href: "/katalog?category=Pengembangan%20Diri" },
    { name: "Warta & Berita Terbaru", href: "/warta" },
  ];

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

        {/* Header Banner */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-[#E52E2D] uppercase tracking-wider">
            <Mail size={13} />
            Hubungi Penerbit Pustaka IIMaN
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272522] tracking-tight">
            Kontak & <span className="text-[#C12A26] italic font-serif">Layanan Pelanggan</span>
          </h1>
          <p className="text-sm sm:text-base text-[#76716A] max-w-3xl leading-relaxed">
            Ada pertanyaan seputar pemesanan buku, pengiriman naskah, atau kerjasama penerbitan? Silakan hubungi kami melalui formulir di bawah ini atau kanal layanan resmi kami.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-2 hover:border-[#E52E2D]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] border border-gray-200 flex items-center justify-center shadow-2xs">
              <MapPin size={20} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Alamat Redaksi & Kantor</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Jl. Purnawarman Blok A No. 37 Bukit Cirendeu, Pondok Cabe Ciputat, Tangerang Selatan
            </p>
          </div>

          <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-2 hover:border-[#E52E2D]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] border border-gray-200 flex items-center justify-center shadow-2xs">
              <Phone size={20} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">WhatsApp & Telepon</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Nomor Kontak Resmi:<br />
              <strong className="text-gray-900 font-mono text-sm">085100007692</strong>
            </p>
          </div>

          <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-2 hover:border-[#E52E2D]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] border border-gray-200 flex items-center justify-center shadow-2xs">
              <Mail size={20} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Email Resmi</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium break-all">
              Pt_iiman@yahoo.com<br />
              Etera_imania@yahoo.com
            </p>
          </div>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Direct WhatsApp Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Kirimkan Pesan Anda
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Isi formulir di bawah ini, tim kami akan merespons melalui Email / WhatsApp.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 size={44} className="text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-emerald-900">
                    Pesan Berhasil Terkirim!
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Terima kasih telah menghubungi Pustaka IIMaN. Pesan Anda telah kami terima dan tim kami akan memberikan jawaban terbaik melalui email/WhatsApp Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap <span className="text-[#E52E2D]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Alamat Email <span className="text-[#E52E2D]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Nomor WhatsApp / Telepon
                      </label>
                      <input
                        type="tel"
                        value={formData.telpon}
                        onChange={(e) => setFormData({ ...formData, telpon: e.target.value })}
                        placeholder="0812xxxxxxxx"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subjek */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Subjek Keperluan
                    </label>
                    <select
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                    >
                      <option value="Pertanyaan Umum">Pertanyaan Umum / Informasi Buku</option>
                      <option value="Pemesanan Buku">Pemesanan & Pre-Order Buku</option>
                      <option value="Pengiriman Naskah">Informasi Pengiriman Naskah</option>
                      <option value="Kerjasama & Reseller">Kerjasama Penerbitan / Reseller</option>
                    </select>
                  </div>

                  {/* Isi Pesan */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Pesan / Pertanyaan <span className="text-[#E52E2D]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.pesan}
                      onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                      placeholder="Tuliskan detail pertanyaan atau keperluan Anda..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#E52E2D] hover:bg-[#C12A26] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 shadow-md inline-flex items-center justify-center gap-2"
                    >
                      <span>Kirim Pesan Sekarang</span>
                      <Send size={15} />
                    </button>
                  </div>

                </form>
              )}

              {/* Direct WhatsApp Quick Chat Box */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Respons Cepat via WhatsApp</h4>
                    <p className="text-[11px] text-gray-600">Butuh bantuan langsung? Obrolan langsung dengan tim customer care kami.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/6285100007692?text=Halo%20Pustaka%20Iman,%20saya%20ingin%20bertanya%20mengenai..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs whitespace-nowrap"
                >
                  Chat WhatsApp &rarr;
                </a>
              </div>

              {/* Social Sharing Bar */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 size={14} className="text-[#E52E2D]" />
                  <span>Bagikan Kontak:</span>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-[#1877F2] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 shadow-2xs"
                    aria-label="Share via Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 shadow-2xs"
                    aria-label="Share via Twitter"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${pageUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-[#25D366] text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 shadow-2xs"
                    aria-label="Share via WhatsApp"
                  >
                    <MessageCircle size={16} fill="currentColor" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Warta Sidebar + Category Links + FAQ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Section 1: Dynamic Warta / Pos-pos Terbaru */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <Newspaper size={15} className="text-[#E52E2D]" />
                  <span>Pos & Warta Terbaru</span>
                </span>
                <Link
                  href="/warta"
                  className="text-[11px] font-bold text-[#E52E2D] hover:underline"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>

              {recentArticles.length > 0 ? (
                <ul className="space-y-3">
                  {recentArticles.map((art) => (
                    <li key={art.id} className="group flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E52E2D] shrink-0 mt-2 group-hover:scale-125 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/warta/${art.id}`}
                          className="text-xs font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2 block"
                        >
                          {art.title}
                        </Link>
                        {art.created_at && (
                          <span className="text-[10px] text-gray-400 mt-0.5 block">
                            {new Date(art.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3 text-xs">
                  <li className="flex items-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E52E2D] shrink-0 mt-1.5" />
                    <Link href="/warta" className="font-semibold text-gray-800 hover:text-[#E52E2D] line-clamp-2">
                      Pustaka Iman Meluncurkan Inisiatif Literasi Digital Nusantara
                    </Link>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E52E2D] shrink-0 mt-1.5" />
                    <Link href="/warta" className="font-semibold text-gray-800 hover:text-[#E52E2D] line-clamp-2">
                      Rekomendasi Buku Islam Kontemporer Terbaik Tahun Ini
                    </Link>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E52E2D] shrink-0 mt-1.5" />
                    <Link href="/warta" className="font-semibold text-gray-800 hover:text-[#E52E2D] line-clamp-2">
                      Panduan Lengkap Pengiriman Naskah ke Redaksi Pustaka Iman
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Section 2: Kategori Pilihan */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-3 block">
                <BookOpen size={15} className="text-[#E52E2D]" />
                <span>Kategori Utama</span>
              </span>
              <ul className="space-y-2">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <Link
                      href={cat.href}
                      className="flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-[#E52E2D] py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400 group-hover:text-[#E52E2D]">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: FAQ Accordion */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-3 block">
                <Sparkles size={15} className="text-[#E52E2D]" />
                <span>Pertanyaan Sering Diajukan (FAQ)</span>
              </span>

              <div className="space-y-2">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-gray-900 bg-gray-50/80 hover:bg-gray-100 transition-colors"
                      >
                        <span className="pr-2">{faq.question}</span>
                        <ChevronDown
                          size={14}
                          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#E52E2D]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
