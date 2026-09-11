"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, MessageCircle, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Book, formatIndonesianDate } from "@/lib/utils";
import { generateSlug } from "@/lib/slugify";

interface UpcomingSectionProps {
  books?: Book[];
  whatsappPhone?: string; // Menerima nomor yang sama dengan bagian kontak
}

// Fallback demo upcoming books
const DEMO_UPCOMING_BOOKS: Book[] = [
  {
    id: "upcoming-1",
    title: "Ensiklopedi Sains Islam Modern: Rahasia Peradaban Keemasan",
    author: "Prof. Dr. Syed Muhammad Al-Attas",
    category: "Sains Islam",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    synopsis: "Karya monumental mendokumentasikan kontribusi para ilmuwan Muslim abad pertengahan yang membentuk lanskap sains modern masa kini.",
    is_upcoming: true,
    release_date: "2026-10-25",
    estimated_release_date: "25 Oktober 2026",
    slug: "ensiklopedi-sains-islam-modern",
  },
  {
    id: "upcoming-2",
    title: "Menyelami Filsafat Ghazali di Era Digital",
    author: "Dr. Haidar Bagir",
    category: "Filsafat & Tasawuf",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    synopsis: "Relevansi pemikiran Al-Ghazali dalam menghadapi krisis spiritual dan disrupsi kecerdasan buatan.",
    is_upcoming: true,
    release_date: null,
    estimated_release_date: null,
    slug: "menyelami-filsafat-ghazali",
  },
  {
    id: "upcoming-3",
    title: "Seni Mengasuh Anak dengan Cinta dan Hikmah",
    author: "Nafisah Ahmad",
    category: "Parenting",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    cover_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    synopsis: "Panduan praktis pengasuhan bernuansa Islami untuk membangun empati dan ketahanan mental anak generasi Alpha.",
    is_upcoming: true,
    release_date: "2026-11-15",
    estimated_release_date: "15 November 2026",
    slug: "seni-mengasuh-anak-cinta-hikmah",
  },
  {
    id: "upcoming-4",
    title: "Jejak Peradaban Al-Andalus",
    author: "Tariq Ramadan",
    category: "Sejarah Islam",
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
    cover_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
    synopsis: "Kisah kejayaan dan harmonisasi budaya Islam di Spanyol yang menginspirasi kebangkitan Renaisans Eropa.",
    is_upcoming: true,
    release_date: null,
    estimated_release_date: null,
    slug: "jejak-peradaban-al-andalus",
  },
  {
    id: "upcoming-5",
    title: "Tafsir Tematik Akhlak Mulia",
    author: "K.H. Quraish Shihab",
    category: "Tafsir Al-Qur'an",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    cover_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    synopsis: "Penjelasan mendalam tentang pembentukan karakter Islami berlandaskan ayat-ayat suci Al-Qur'an.",
    is_upcoming: true,
    release_date: "2026-12-01",
    estimated_release_date: "1 Desember 2026",
    slug: "tafsir-tematik-akhlak-mulia",
  },
];

interface ReleaseInfo {
  hasValidFutureDate: boolean;
  releaseDateText: string;
  targetTime: number;
}

export function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr || String(dateStr).trim() === "") return null;
  const str = String(dateStr).trim();

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return d;
}

function getReleaseInfo(book?: Book | null): ReleaseInfo {
  if (!book) {
    return { hasValidFutureDate: false, releaseDateText: "Segera Terbit", targetTime: 0 };
  }

  const rawDate = book.release_date || book.promo_start_date || book.promo_start_at;

  if (!rawDate || String(rawDate).trim() === "") {
    const est = book.estimated_release_date;
    if (est && String(est).trim() !== "") {
      return {
        hasValidFutureDate: false,
        releaseDateText: String(est),
        targetTime: 0,
      };
    }
    return {
      hasValidFutureDate: false,
      releaseDateText: "Segera Terbit",
      targetTime: 0,
    };
  }

  const parsedLocalDate = parseLocalDate(rawDate);
  if (!parsedLocalDate) {
    return {
      hasValidFutureDate: false,
      releaseDateText: String(rawDate),
      targetTime: 0,
    };
  }

  const targetTime = parsedLocalDate.getTime();
  const now = Date.now();

  if (targetTime > now) {
    return {
      hasValidFutureDate: true,
      releaseDateText: formatIndonesianDate(parsedLocalDate),
      targetTime,
    };
  }

  return {
    hasValidFutureDate: false,
    releaseDateText: formatIndonesianDate(parsedLocalDate),
    targetTime: 0,
  };
}

// Helper WhatsApp link generator yang menggunakan nomor dinamis
function getWhatsAppReminderUrl(book: Book, rawPhone?: string): string {
  let phone = (rawPhone || "").replace(/\D/g, "");
  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  }
  if (!phone) {
    phone = "6281234567890"; // Fallback nomor default jika kontak belum diset
  }

  const message = `Halo Pustaka Iman, saya tertarik dengan buku "${book.title}" yang akan segera terbit. Mohon kabari saya jika pre-order atau pemesanan sudah dibuka. Terima kasih!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function FeaturedBookCard({
  book,
  whatsappPhone,
  priorityCover = false,
}: {
  book: Book;
  whatsappPhone?: string;
  priorityCover?: boolean;
}) {
  const releaseInfo = getReleaseInfo(book);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!book || !releaseInfo.hasValidFutureDate) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetTime = releaseInfo.targetTime;

    const updateTimer = () => {
      const now = new Date();
      const diff = targetTime - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [book, releaseInfo.hasValidFutureDate, releaseInfo.targetTime]);

  const cover = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";
  const target = book.slug || generateSlug(book.title) || book.id;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-red-100/90 shadow-sm flex flex-col justify-between relative overflow-hidden group h-full w-full">
      <div className="grid grid-cols-12 gap-4 sm:gap-5 items-center flex-1 h-full">
        
        {/* Cover Buku Container */}
        <div className="col-span-5 flex flex-col items-center justify-center h-full relative py-1">
          <div className="relative w-full max-w-[190px] sm:max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-50/90 border border-gray-100 p-2 sm:p-2.5 shadow-md flex items-center justify-center my-auto group-hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
              <span className="bg-amber-500 text-white font-extrabold text-[8px] sm:text-[10px] uppercase px-2 py-0.5 rounded-md shadow-md tracking-wider">
                PRE-ORDER
              </span>
            </div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={cover}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 180px, 300px"
                className="object-contain p-1 w-full h-full drop-shadow-xs"
                priority={priorityCover}
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Metadata, Date Block, Countdown, CTA WhatsApp */}
        <div className="col-span-7 flex flex-col justify-between h-full space-y-2.5">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#E52E2D] uppercase tracking-wider block">
              {book.category || "Literasi"}
            </span>

            <h3 className="font-serif text-base sm:text-xl font-bold text-[#272522] leading-tight sm:leading-snug line-clamp-2 hover:text-[#E52E2D] transition-colors">
              <Link href={`/katalog/${target}`}>{book.title}</Link>
            </h3>

            <p className="text-xs text-gray-600 line-clamp-3 mt-1 leading-relaxed">
              {book.synopsis || "Dapatkan bacaan inspiratif ini pertama kali saat resmi diterbitkan."}
            </p>
          </div>

          <div className="space-y-2.5 pt-0.5 mt-auto">
            {/* Box Tanggal Terbit */}
            <div className="bg-[#FFF5F3] border border-red-100/90 rounded-xl p-2 sm:p-2.5 flex items-center gap-1.5 text-xs text-[#272522] font-semibold w-full">
              <Calendar size={14} className="text-[#E52E2D] shrink-0" />
              {releaseInfo.hasValidFutureDate ? (
                <span className="truncate">Rilis: <strong className="text-[#E52E2D]">{releaseInfo.releaseDateText}</strong></span>
              ) : (
                <span className="truncate">Perkiraan: <strong className="text-[#E52E2D]">{releaseInfo.releaseDateText}</strong></span>
              )}
            </div>

            {/* Countdown Timer */}
            {releaseInfo.hasValidFutureDate && (
              <div className="w-full">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Clock size={11} className="text-[#E52E2D]" />
                  <span>Hitung Mundur Rilis:</span>
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-[#FAF7F2] border border-[#EAE5D9] rounded-xl p-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#272522] block">{String(countdown.days).padStart(2, "0")}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#76716A] font-bold uppercase">Hari</span>
                  </div>
                  <div className="bg-[#FAF7F2] border border-[#EAE5D9] rounded-xl p-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#272522] block">{String(countdown.hours).padStart(2, "0")}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#76716A] font-bold uppercase">Jam</span>
                  </div>
                  <div className="bg-[#FAF7F2] border border-[#EAE5D9] rounded-xl p-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#272522] block">{String(countdown.minutes).padStart(2, "0")}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#76716A] font-bold uppercase">Mnt</span>
                  </div>
                  <div className="bg-[#FAF7F2] border border-[#EAE5D9] rounded-xl p-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#E52E2D] block">{String(countdown.seconds).padStart(2, "0")}</span>
                    <span className="text-[8px] sm:text-[9px] text-[#76716A] font-bold uppercase">Det</span>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Link WhatsApp */}
            <a
              href={getWhatsAppReminderUrl(book, whatsappPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
            >
              <MessageCircle size={15} />
              <span>INGATKAN SAYA VIA WHATSAPP</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UpcomingSection({ books = [], whatsappPhone }: UpcomingSectionProps) {
  const [upcomingList, setUpcomingList] = useState<Book[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth / 2 : containerWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const filtered = (books || []).filter(
      (b) =>
        b.is_upcoming === true &&
        !b.deleted_at &&
        (b as any).is_deleted !== true &&
        (b as any).status !== "trash" &&
        (b as any).status !== "draft" &&
        (b as any).is_active !== false
    );

    if (books && books.length > 0) {
      setUpcomingList(filtered);
    } else if (books && books.length === 0) {
      setUpcomingList([]);
    } else {
      setUpcomingList(DEMO_UPCOMING_BOOKS);
    }
  }, [books]);

  if (upcomingList.length === 0) return null;

  const totalCount = upcomingList.length;
  const featuredBook = upcomingList[0];
  const rightGridBooks = upcomingList.slice(1);
  const showArrowNav = totalCount >= 4;

  return (
    <section className="w-full py-10 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Container */}
        <div className="bg-[#FFF8F5] border border-[#FEECE7] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-[#FEECE7] gap-3 sm:gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-red-100/70 text-[#C12A26] border border-red-200/60 uppercase tracking-wider mb-1.5 sm:mb-2">
                <span>✦</span>
                <span>SEGERA HADIR</span>
              </span>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#272522] tracking-tight mt-0.5">
                Buku yang <span className="text-[#E52E2D] italic font-serif">Akan Terbit</span>
              </h2>

              <p className="text-xs sm:text-base text-[#76716A] mt-1 sm:mt-1.5 font-medium">
                Nantikan berbagai bacaan baru pilihan Pustaka Iman.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              {showArrowNav && (
                <div className="hidden md:flex items-center gap-1.5">
                  <button
                    onClick={() => scrollCarousel('left')}
                    aria-label="Scroll Kiri"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    aria-label="Scroll Kanan"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              <Link
                href="/katalog?filter=segera-terbit"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-white border border-gray-200 hover:border-[#E52E2D] text-[#272522] hover:text-[#E52E2D] rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-md shrink-0 group cursor-pointer"
              >
                <span>Lihat Semua Buku</span>
                <ArrowRight size={15} className="text-[#E52E2D] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* LAYOUT CONTENT */}
          {totalCount === 1 ? (
            <div className="max-w-3xl mx-auto w-full">
              <FeaturedBookCard book={featuredBook} whatsappPhone={whatsappPhone} priorityCover={true} />
            </div>
          ) : totalCount === 2 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch w-full">
              <FeaturedBookCard book={upcomingList[0]} whatsappPhone={whatsappPhone} priorityCover={true} />
              <FeaturedBookCard book={upcomingList[1]} whatsappPhone={whatsappPhone} />
            </div>
          ) : totalCount === 3 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
              <div className="lg:col-span-6">
                <FeaturedBookCard book={featuredBook} whatsappPhone={whatsappPhone} priorityCover={true} />
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-stretch">
                {rightGridBooks.slice(0, 2).map((book) => {
                  const cover = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                  const target = book.slug || generateSlug(book.title) || book.id;
                  const relInfo = getReleaseInfo(book);

                  return (
                    <div
                      key={book.id}
                      className="w-full bg-white border border-red-100/90 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all duration-200 group relative h-full"
                    >
                      <div>
                        <div className="relative w-full aspect-[3/4] rounded-xl border border-gray-100 bg-neutral-50/90 p-2 mb-2.5 flex items-center justify-center overflow-hidden">
                          <span className="absolute top-1.5 left-1.5 z-10 bg-[#E52E2D] text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                            SEGERA TERBIT
                          </span>
                          <Link href={`/katalog/${target}`} className="block w-full h-full relative">
                            <Image
                              src={cover}
                              alt={book.title}
                              fill
                              sizes="(max-width: 640px) 140px, 200px"
                              className="object-contain p-1 w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>

                        <span className="text-[8px] sm:text-[9px] font-bold text-[#E52E2D] uppercase tracking-wider block">
                          {book.category || "Literasi"}
                        </span>

                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2 mt-0.5" title={book.title}>
                          <Link href={`/katalog/${target}`}>{book.title}</Link>
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 space-y-2">
                        <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                          <Calendar size={12} className="text-[#E52E2D] shrink-0" />
                          <span className="truncate">Rilis: {relInfo.releaseDateText}</span>
                        </div>

                        <Link
                          href={`/katalog/${target}`}
                          className="w-full py-2 px-2 border border-gray-200 group-hover:border-[#E52E2D] text-gray-700 group-hover:text-[#E52E2D] hover:bg-red-50 font-bold rounded-xl text-[10px] text-center transition-all duration-200 uppercase tracking-wider block"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
              <div className="lg:col-span-6">
                <FeaturedBookCard book={featuredBook} whatsappPhone={whatsappPhone} priorityCover={true} />
              </div>

              <div className="lg:col-span-6 overflow-hidden flex flex-col justify-between h-full">
                <div className="flex md:hidden items-center justify-between mb-2.5 px-0.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Segera Hadir Lainnya
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => scrollCarousel('left')}
                      aria-label="Scroll Kiri Mobile"
                      className="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      aria-label="Scroll Kanan Mobile"
                      className="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-gray-700 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-colors cursor-pointer active:scale-95"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div
                  ref={carouselRef}
                  className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none items-stretch h-full pb-1 -mx-2 px-2 sm:mx-0 sm:px-0"
                >
                  {rightGridBooks.map((book) => {
                    const cover = book.coverUrl || book.cover_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                    const target = book.slug || generateSlug(book.title) || book.id;
                    const relInfo = getReleaseInfo(book);

                    return (
                      <div
                        key={book.id}
                        className="w-[160px] xs:w-[180px] sm:w-[calc((100%-2rem)/3)] shrink-0 snap-start bg-white border border-red-100/90 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-red-300 hover:shadow-md transition-all duration-200 group relative self-stretch"
                      >
                        <div>
                          <div className="relative w-full aspect-[3/4] rounded-xl border border-gray-100 bg-neutral-50/90 p-2 mb-2 sm:mb-2.5 flex items-center justify-center overflow-hidden">
                            <span className="absolute top-1.5 left-1.5 z-10 bg-[#E52E2D] text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                              SEGERA TERBIT
                            </span>

                            <Link href={`/katalog/${target}`} className="block w-full h-full relative">
                              <Image
                                src={cover}
                                alt={book.title}
                                fill
                                sizes="(max-width: 640px) 140px, 200px"
                                className="object-contain p-1 w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          </div>

                          <span className="text-[8px] sm:text-[9px] font-bold text-[#E52E2D] uppercase tracking-wider block">
                            {book.category || "Literasi"}
                          </span>

                          <h4 className="text-[11px] sm:text-xs font-bold text-gray-900 group-hover:text-[#E52E2D] transition-colors leading-snug line-clamp-2 mt-0.5" title={book.title}>
                            <Link href={`/katalog/${target}`}>{book.title}</Link>
                          </h4>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5 sm:space-y-2">
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-600 font-medium">
                            <Calendar size={11} className="text-[#E52E2D] shrink-0" />
                            <span className="truncate">Rilis: {relInfo.releaseDateText}</span>
                          </div>

                          <Link
                            href={`/katalog/${target}`}
                            className="w-full py-1.5 px-2 border border-gray-200 group-hover:border-[#E52E2D] text-gray-700 group-hover:text-[#E52E2D] hover:bg-red-50 font-bold rounded-xl text-[9px] sm:text-[10px] text-center transition-all duration-200 uppercase tracking-wider block"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}