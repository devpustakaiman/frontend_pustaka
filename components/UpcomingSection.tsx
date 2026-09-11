"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Bell, Calendar, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Book, formatIndonesianDate } from "@/lib/utils";
import { generateSlug } from "@/lib/slugify";

interface UpcomingSectionProps {
  books?: Book[];
}

// Fallback demo upcoming books showing both books with future release dates & books with null release dates
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

/**
 * Parses a date string into a local Date object set to 00:00:00 local time.
 * Prevents UTC offset shifts (e.g. YYYY-MM-DD parsed as UTC 00:00 -> 07:00 WIB in local browser).
 */
export function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr || String(dateStr).trim() === "") return null;
  const str = String(dateStr).trim();

  // Match YYYY-MM-DD or YYYY-MM-DDT...
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed month in JS Date
    const day = parseInt(match[3], 10);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Helper to determine release date validity and countdown timer necessity.
 */
function getReleaseInfo(book?: Book | null): ReleaseInfo {
  if (!book) {
    return { hasValidFutureDate: false, releaseDateText: "Segera Terbit", targetTime: 0 };
  }

  const rawDate = book.release_date || book.promo_start_date || book.promo_start_at;

  // Case A: release_date is null/undefined/empty
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

  // Case B: release_date is provided -> parse to 00:00:00 local time
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

  // If date exists but is in the past or today
  return {
    hasValidFutureDate: false,
    releaseDateText: formatIndonesianDate(parsedLocalDate),
    targetTime: 0,
  };
}

/**
 * Reusable Featured Book Card component for Sorotan / Twin Cards.
 * Fully responsive horizontal layout with left cover aspect-[3/4] & right metadata column.
 */
function FeaturedBookCard({
  book,
  onOpenReminder,
  priorityCover = false,
}: {
  book: Book;
  onOpenReminder: (book: Book) => void;
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
        
        {/* Kolom Kiri Dalam: Cover Buku Container (Padded Soft Neutral Container & 100% Uncropped Cover) */}
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

        {/* Kolom Kanan Dalam: Metadata, Date Block, Countdown, CTA */}
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

            {/* Countdown Timer (Aktif jika release_date di masa depan) */}
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

            {/* Tombol Merah INGATKAN SAYA */}
            <button
              onClick={() => onOpenReminder(book)}
              type="button"
              className="w-full py-2.5 px-3 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
            >
              <Bell size={14} />
              <span>INGATKAN SAYA</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UpcomingSection({ books = [] }: UpcomingSectionProps) {
  const [upcomingList, setUpcomingList] = useState<Book[]>([]);

  // Carousel ref & smooth scroll handler
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const containerWidth = carouselRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth / 2 : containerWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Reminder Modal State
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderSubmitted, setReminderSubmitted] = useState(false);
  const [selectedBookForReminder, setSelectedBookForReminder] = useState<Book | null>(null);

  useEffect(() => {
    // Filter out soft-deleted, trashed, draft, or inactive books
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
      // Real database fetch returned 0 items (or all upcoming items were deleted/trashed) -> show empty
      setUpcomingList([]);
    } else {
      // Standalone fallback demo books only if books prop is undefined
      setUpcomingList(DEMO_UPCOMING_BOOKS);
    }
  }, [books]);

  const handleOpenReminder = (book: Book) => {
    setSelectedBookForReminder(book);
    setReminderSubmitted(false);
    setReminderEmail("");
    setReminderModalOpen(true);
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail.trim()) return;
    setReminderSubmitted(true);
    setTimeout(() => {
      setReminderModalOpen(false);
      setReminderSubmitted(false);
    }, 2500);
  };

  if (upcomingList.length === 0) return null;

  const totalCount = upcomingList.length;
  const featuredBook = upcomingList[0];
  const rightGridBooks = upcomingList.slice(1);
  const showArrowNav = totalCount >= 4; // Kasus D (≥ 4 buku) - hanya aktifkan panah jika ada ≥ 4 buku

  return (
    <section className="w-full py-10 sm:py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Container: Soft Warm Cream Background & Subtle Reddish Border */}
        <div className="bg-[#FFF8F5] border border-[#FEECE7] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-[#FEECE7] gap-3 sm:gap-4">
            <div>
              {/* Spark badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-red-100/70 text-[#C12A26] border border-red-200/60 uppercase tracking-wider mb-1.5 sm:mb-2">
                <span>✦</span>
                <span>SEGERA HADIR</span>
              </span>

              {/* Title with Serif font */}
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#272522] tracking-tight mt-0.5">
                Buku yang <span className="text-[#E52E2D] italic font-serif">Akan Terbit</span>
              </h2>

              <p className="text-xs sm:text-base text-[#76716A] mt-1 sm:mt-1.5 font-medium">
                Nantikan berbagai bacaan baru pilihan Pustaka Iman.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              
              {/* Arrow Buttons for Slider Navigation (Visible ONLY for Case D: ≥ 4 books) */}
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

              {/* Header Action Button: White pill button */}
              <Link
                href="/katalog?filter=segera-terbit"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-white border border-gray-200 hover:border-[#E52E2D] text-[#272522] hover:text-[#E52E2D] rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs hover:shadow-md shrink-0 group cursor-pointer"
              >
                <span>Lihat Semua Buku</span>
                <ArrowRight size={15} className="text-[#E52E2D] transition-transform group-hover:translate-x-1" />
              </Link>

            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* LAYOUT CONTENT: Adaptif berdasarkan jumlah buku (1, 2, 3, atau ≥ 4) */}
          {/* ══════════════════════════════════════════════════════════════════ */}

          {totalCount === 1 ? (
            /* ── KASUS A: Tepat 1 Buku (Tampil Centered Terpusat di Tengah max-w-3xl) ── */
            <div className="max-w-3xl mx-auto w-full">
              <FeaturedBookCard book={featuredBook} onOpenReminder={handleOpenReminder} priorityCover={true} />
            </div>
          ) : totalCount === 2 ? (
            /* ── KASUS B: Tepat 2 Buku (Dua Featured Cards Kembar Berdampingan Simetris 50:50) ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch w-full">
              <FeaturedBookCard book={upcomingList[0]} onOpenReminder={handleOpenReminder} priorityCover={true} />
              <FeaturedBookCard book={upcomingList[1]} onOpenReminder={handleOpenReminder} />
            </div>
          ) : totalCount === 3 ? (
            /* ── KASUS C: Tepat 3 Buku (Card Utama di Kiri + 2 Card Mengisi Penuh Sisa Ruang Kanan 50:50) ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
              
              {/* Kolom Kiri: Featured Card (lg:col-span-6) */}
              <div className="lg:col-span-6">
                <FeaturedBookCard book={featuredBook} onOpenReminder={handleOpenReminder} priorityCover={true} />
              </div>

              {/* Kolom Kanan: 2 Card Mengisi Penuh 50:50 (lg:col-span-6 grid-cols-2) */}
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
            /* ── KASUS D: 4 Buku atau Lebih (Default Carousel Layout dengan Slider & Panah Navigasi) ── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
              
              {/* SISI KIRI: Featured / Buku Sorotan Utama (lg:col-span-6) */}
              <div className="lg:col-span-6">
                <FeaturedBookCard book={featuredBook} onOpenReminder={handleOpenReminder} priorityCover={true} />
              </div>

              {/* SISI KANAN: Slider Carousel 3 Cards per View (lg:col-span-6) */}
              <div className="lg:col-span-6 overflow-hidden flex flex-col justify-between h-full">
                
                {/* Mobile Slider Navigation Bar (Visible ONLY for Case D: ≥ 4 books) */}
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

      {/* Interactive Reminder Modal */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setReminderModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {!reminderSubmitted ? (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E52E2D] mb-4">
                  <Bell size={24} />
                </div>

                <h3 className="font-serif text-xl font-bold text-gray-900 tracking-tight">
                  Dapatkan Pengingat Rilis Buku
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Kami akan mengirimkan notifikasi saat <strong className="text-gray-900">"{selectedBookForReminder?.title}"</strong> resmi diterbitkan dan siap dipesan.
                </p>

                <form onSubmit={handleReminderSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Alamat Email / Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="Contoh: nama@email.com atau 081234567890"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer"
                  >
                    Kirim Pengingat Saya
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check size={28} strokeWidth={3} />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900">
                  Pengingat Berhasil Ditambahkan!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Terima kasih! Kami akan memberi tahu Anda begitu buku ini resmi dirilis.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
