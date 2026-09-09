"use client";

import { useState, useEffect } from "react";
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
  Globe,
  ChevronDown,
  BookOpen,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { Article } from "@/lib/api";
import { supabase } from "@/lib/supabase";

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

const DEFAULT_CONTACT_INFO = {
  address: "Jl. Purnawarman Blok A No. 37 Bukit Cirendeu, Pondok Cabe Ciputat, Tangerang Selatan",
  phone: "085100007692",
  whatsapp: "6285100007692",
  emails: ["Pt_iiman@yahoo.com", "Etera_imania@yahoo.com"],
};

const DEFAULT_SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/penerbit.imania/",
  x: "https://x.com/penerbitimania",
  instagram: "https://www.instagram.com/penerbitimania/",
  tiktok: "https://www.tiktok.com/@penerbitimania",
};

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

  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [isLoadingContact, setIsLoadingContact] = useState(true);

  // Fetch dynamic contact details from Supabase site_settings
  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("contact_address, contact_phone, contact_whatsapp, contact_emails, facebook_url, twitter_url, x_url, instagram_url, tiktok_url")
          .eq("id", "default")
          .maybeSingle();

        if (!error && data) {
          let parsedEmails: string[] = DEFAULT_CONTACT_INFO.emails;
          if (Array.isArray(data.contact_emails) && data.contact_emails.length > 0) {
            parsedEmails = data.contact_emails;
          } else if (typeof data.contact_emails === "string" && data.contact_emails.trim()) {
            parsedEmails = data.contact_emails
              .split(/[,;\n]+/)
              .map((e: string) => e.trim())
              .filter(Boolean);
          }

          setContactInfo({
            address: data.contact_address || DEFAULT_CONTACT_INFO.address,
            phone: data.contact_phone || DEFAULT_CONTACT_INFO.phone,
            whatsapp: data.contact_whatsapp || DEFAULT_CONTACT_INFO.whatsapp,
            emails: parsedEmails.length > 0 ? parsedEmails : DEFAULT_CONTACT_INFO.emails,
          });

          setSocialLinks({
            facebook: data.facebook_url || DEFAULT_SOCIAL_LINKS.facebook,
            x: data.twitter_url || data.x_url || DEFAULT_SOCIAL_LINKS.x,
            instagram: data.instagram_url || DEFAULT_SOCIAL_LINKS.instagram,
            tiktok: data.tiktok_url || DEFAULT_SOCIAL_LINKS.tiktok,
          });
        }
      } catch (err) {
        console.error("Error fetching contact info from site_settings:", err);
      } finally {
        setIsLoadingContact(false);
      }
    }
    fetchContactSettings();
  }, []);

  const rawWhatsapp = contactInfo.whatsapp || contactInfo.phone || "6285100007692";
  let cleanWhatsappPhone = rawWhatsapp.replace(/\D/g, "");
  if (cleanWhatsappPhone.startsWith("0")) {
    cleanWhatsappPhone = "62" + cleanWhatsappPhone.slice(1);
  }

  const [pageUrl, setPageUrl] = useState<string>("https://pustakaiiman.com/kontak");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);
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
              {contactInfo.address}
            </p>
          </div>

          <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-2 hover:border-[#E52E2D]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] border border-gray-200 flex items-center justify-center shadow-2xs">
              <Phone size={20} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">WhatsApp & Telepon</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Nomor Kontak Resmi:<br />
              <strong className="text-gray-900 font-mono text-sm">{contactInfo.phone}</strong>
            </p>
          </div>

          <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-2 hover:border-[#E52E2D]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white text-[#E52E2D] border border-gray-200 flex items-center justify-center shadow-2xs">
              <Mail size={20} />
            </div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Email Resmi</h4>
            <div className="text-xs text-gray-600 leading-relaxed font-medium break-all space-y-0.5">
              {contactInfo.emails.map((email, idx) => (
                <a
                  key={idx}
                  href={`mailto:${email}`}
                  className="block text-gray-700 hover:text-[#E52E2D] hover:underline transition-colors"
                >
                  {email}
                </a>
              ))}
            </div>
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
                  href={`https://wa.me/${cleanWhatsappPhone}?text=Halo%20Pustaka%20Iman,%20saya%20ingin%20bertanya%20mengenai...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  Chat WhatsApp &rarr;
                </a>
              </div>

              {/* Official Social Media Follow Strip */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={15} className="text-[#E52E2D]" />
                  <span>MEDIA SOSIAL RESMI:</span>
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1877F2] text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-md"
                    aria-label="Facebook Resmi Pustaka IIMaN"
                    title="Facebook Resmi"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={socialLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-md"
                    aria-label="X (Twitter) Resmi Pustaka IIMaN"
                    title="X (Twitter) Resmi"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-md"
                    aria-label="Instagram Resmi Pustaka IIMaN"
                    title="Instagram Resmi"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-md"
                    aria-label="TikTok Resmi Pustaka IIMaN"
                    title="TikTok Resmi"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.05.92.14V8.9a6.38 6.38 0 0 0-.92-.07A6.34 6.34 0 0 0 3 15.17a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.33-6.33V9.05a8.27 8.27 0 0 0 4.92 1.6V7.2a4.85 4.85 0 0 1-1-.51z" />
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${cleanWhatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-2xs hover:shadow-md"
                    aria-label="WhatsApp Resmi Pustaka IIMaN"
                    title="WhatsApp Resmi"
                  >
                    <MessageCircle size={18} fill="currentColor" />
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
                          href={`/warta/${art.slug || art.id}`}
                          prefetch={false}
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
