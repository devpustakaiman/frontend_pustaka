"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Clock, Tag } from "lucide-react";
import BookCard from "@/components/BookCard";
import { getBookById, getBooks } from "@/lib/api";
import { Book, formatBookPrice, isActivePromo, getPromoDaysRemaining } from "@/lib/utils";

const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800";

const DUMMY_RELATED_BOOKS: Book[] = [
  {
    id: "related-1",
    title: "Islam & Peradaban Modern",
    author: "Prof. Dr. Nurcholish Madjid",
    category: "Pemikiran Islam",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    price: 85000,
  },
  {
    id: "related-2",
    title: "Tafsir Al-Mishbah Vol. 1",
    author: "Prof. Dr. M. Quraish Shihab",
    category: "Tafsir & Al-Qur'an",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    price: 150000,
  },
  {
    id: "related-3",
    title: "Lentera Hati: Kisah & Hikmah",
    author: "M. Quraish Shihab",
    category: "Akhlak & Tasawuf",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    price: 78000,
  },
  {
    id: "related-4",
    title: "Wawasan Al-Qur'an tentang Kehidupan",
    author: "Prof. Dr. M. Quraish Shihab",
    category: "Studi Islam",
    coverUrl: "https://images.unsplash.com/photo-1532012164546-f43249488629?auto=format&fit=crop&q=80&w=600",
    price: 110000,
  },
];

interface BookDetailClientProps {
  slug: string;
}

export default function BookDetailClient({ slug }: BookDetailClientProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);

  useEffect(() => {
    async function loadBookData() {
      setLoading(true);
      try {
        const [data, allBooks] = await Promise.all([
          getBookById(slug),
          getBooks(),
        ]);

        if (data) {
          setBook(data);
          const cover = data.cover_url || data.coverUrl || data.cover || PLACEHOLDER_COVER;
          setActiveImage(cover);
        } else {
          // Fallback mock book detail if not found by exact ID
          const fallbackCover = PLACEHOLDER_COVER;
          setBook({
            id: slug,
            title: "Filsafat Literasi Islam: Sejarah, Pemikiran & Spiritualitas",
            author: "Prof. Dr. H. M. Quraish Shihab",
            category: "Literasi & Pemikiran",
            price: 95000,
            coverUrl: fallbackCover,
            mizanstoreUrl: "https://www.mizanstore.com",
            synopsis: `Buku karya Prof. Dr. H. M. Quraish Shihab ini mengupas secara mendalam tentang sejarah, dinamika pemikiran, serta tradisi keilmuan literasi Islam yang tumbuh dan berkembang pesat sepanjang abad pertengahan hingga era kontemporer.\n\nDalam karya inspiratif ini, pembaca diajak menjelajahi bagaimana peradaban Islam menempatkan ilmu pengetahuan dan baca-tulis sebagai pondasi tertinggi kemajuan sosial dan spiritual. Penulis memaparkan argumentasi filosofis yang jernih namun kaya akan rujukan klasik serta kontemporer.\n\nSangat direkomendasikan bagi kalangan akademisi, mahasiswa, peneliti, dan segenap pecinta literasi keislaman yang mendambakan wawasan komprehensif mengenai pentingnya tradisi membaca dan menulis dalam konteks zaman hari ini.`,
          });
          setActiveImage(fallbackCover);
        }

        // Set related books from DB or fallback
        if (allBooks && allBooks.length > 0) {
          const filtered = allBooks
            .filter((b) => String(b.id) !== String(slug) && b.id !== data?.id)
            .slice(0, 4);
          if (filtered.length > 0) {
            setRelatedBooks(filtered);
          } else {
            setRelatedBooks(DUMMY_RELATED_BOOKS);
          }
        } else {
          setRelatedBooks(DUMMY_RELATED_BOOKS);
        }
      } catch (err) {
        console.error("Error loading book detail:", err);
        setRelatedBooks(DUMMY_RELATED_BOOKS);
      } finally {
        setLoading(false);
      }
    }

    loadBookData();
  }, [slug]);

  // Extract main cover URL from backend DB record
  const mainCover = book?.cover_url || book?.coverUrl || PLACEHOLDER_COVER;

  // Extract gallery photos array from backend DB record
  let backendGallery: string[] = [];
  const rawGallery: any =
    (book as any)?.gallery_urls ||
    (book as any)?.galleryUrls ||
    (book as any)?.gallery_images ||
    (book as any)?.galleryImages;

  if (Array.isArray(rawGallery)) {
    backendGallery = rawGallery;
  } else if (typeof rawGallery === "string" && (rawGallery as string).trim().length > 0) {
    try {
      const parsed = JSON.parse(rawGallery);
      if (Array.isArray(parsed)) {
        backendGallery = parsed;
      } else {
        backendGallery = (rawGallery as string).split(",").map((s: string) => s.trim());
      }
    } catch {
      backendGallery = (rawGallery as string).split(",").map((s: string) => s.trim());
    }
  }


  backendGallery = backendGallery.filter(
    (url) => typeof url === "string" && url.trim().length > 0
  );

  const galleryImages: string[] = [];
  if (mainCover) {
    galleryImages.push(mainCover);
  }

  backendGallery.forEach((url) => {
    if (!galleryImages.includes(url)) {
      galleryImages.push(url);
    }
  });

  if (galleryImages.length === 0) {
    galleryImages.push(PLACEHOLDER_COVER);
  }

  while (galleryImages.length > 0 && galleryImages.length < 4) {
    galleryImages.push(galleryImages[galleryImages.length % galleryImages.length]);
  }

  const currentDisplayImage = activeImage || mainCover;

  // Active promo calculations
  const hasActivePromo = isActivePromo(book);
  const formattedOriginalPrice = formatBookPrice(book?.price);
  const formattedPromoPrice = formatBookPrice(book?.promo_price);
  const isFallbackPrice = formattedOriginalPrice === "Lihat Harga di Mizanstore";
  const daysRemaining = getPromoDaysRemaining(book?.promo_end_date);

  let discountPct = book?.promo_percentage;
  if (!discountPct && hasActivePromo && typeof book?.price === "number" && typeof book?.promo_price === "number" && book.price > 0) {
    discountPct = Math.round(((book.price - book.promo_price) / book.price) * 100);
  }

  const mizanUrl = book?.mizanstoreUrl || book?.mizanstore_url || "https://www.mizanstore.com";

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 md:py-12 text-[#272522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
        
        {/* Navigation / Back Button */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-[#272522] bg-white border border-[#EAE5D9] rounded-full hover:bg-white/80 hover:border-[#B67A2D]/40 shadow-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Top Layout: 2 Columns Above the Fold */}
        <div className="bg-white border border-[#EAE5D9] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Book Cover + Mockup Gallery Row */}
            <div className="md:col-span-5 space-y-4">
              <div className="w-full aspect-[3/4] bg-[#F1E8D8] rounded-xl border border-[#EAE5D9] overflow-hidden shadow-md relative group flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentDisplayImage}
                  alt={book?.title || "Sampul Buku"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = mainCover;
                  }}
                />
                {hasActivePromo && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      <Tag size={13} />
                      <span>PROMO</span>
                      {discountPct && <span>-{discountPct}%</span>}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#76716A] uppercase tracking-wider mb-2">
                  Pratinjau Sampul & Detail Galeri
                </p>
                <div className="flex items-center gap-3">
                  {galleryImages.map((img, idx) => {
                    const isSelected = currentDisplayImage === img;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        type="button"
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#D32F2F] ring-2 ring-[#D32F2F]/20 shadow-md scale-105"
                            : "border-[#EAE5D9] hover:border-[#B67A2D]/60 opacity-75 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`${book?.title || "Buku"} Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = mainCover;
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Title, Author, Price & 'Beli di Mizanstore' CTA */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-[#FAF8F3] border border-[#EAE5D9] text-xs font-bold text-[#D32F2F] rounded-md uppercase tracking-wider">
                    {book?.category || "Literasi Utama"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#76716A] bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Stok Tersedia</span>
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#272522] leading-tight">
                  {book?.title || "Filsafat Literasi Islam: Sejarah, Pemikiran & Spiritualitas"}
                </h1>

                <p className="text-sm text-[#76716A]">
                  Penulis: <span className="text-[#272522] font-semibold text-base">{book?.author || "Prof. Dr. H. M. Quraish Shihab"}</span>
                </p>
              </div>

              {/* Price & CTA Section (Instant Visibility Above Fold) */}
              <div className="bg-[#FAF8F3] border border-[#EAE5D9] rounded-xl p-5 md:p-6 space-y-4">
                
                {/* FOMO Countdown Banner if Promo Active */}
                {hasActivePromo && (
                  <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border border-orange-300/80 rounded-lg p-3 flex items-center gap-2.5 text-orange-900 text-xs sm:text-sm font-semibold shadow-xs">
                    <span className="text-lg animate-bounce">🔥</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-orange-600 flex-shrink-0" />
                      <span>
                        {daysRemaining > 1
                          ? `Promo berakhir dalam ${daysRemaining} hari`
                          : "Promo berakhir hari ini!"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div>
                  <span className="text-xs text-[#76716A] uppercase font-bold tracking-wider block mb-1">
                    {hasActivePromo ? "Harga Promo Spesial" : "Harga Resmi Publisher"}
                  </span>
                  
                  {hasActivePromo ? (
                    <div className="flex items-baseline flex-wrap gap-2.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#D32F2F]">
                        {formattedPromoPrice}
                      </span>
                      <span className="line-through text-gray-400 text-lg font-normal">
                        {formattedOriginalPrice}
                      </span>
                      {discountPct && (
                        <span className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                  ) : isFallbackPrice ? (
                    <span className="text-xl font-bold text-[#B67A2D] italic block">
                      {formattedOriginalPrice}
                    </span>
                  ) : (
                    <span className="text-3xl font-black text-[#D32F2F]">
                      {formattedOriginalPrice}
                    </span>
                  )}

                  {/* Required Price Disclaimer */}
                  <p className="text-[11px] sm:text-xs text-gray-500 italic mt-2 block leading-normal">
                    Harga estimasi. Ketersediaan dan harga final dapat berubah sewaktu-waktu mengikuti kebijakan Mizanstore.
                  </p>
                </div>

                {/* Immediately Below Price: Beli di Mizanstore CTA Button */}
                <div className="pt-1">
                  <a
                    href={mizanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-center"
                  >
                    <span>Beli di Mizanstore</span>
                    <ExternalLink size={16} strokeWidth={2} />
                  </a>
                </div>
              </div>

              {/* Synopsis Section: line-clamp-4 with toggle */}
              <div className="border-t border-[#EAE5D9] pt-5 space-y-3">
                <h2 className="font-serif text-xl font-bold text-[#272522]">Sinopsis Buku</h2>
                <div className="relative">
                  <p
                    className={`text-[#272522]/90 text-sm leading-relaxed whitespace-pre-line transition-all ${
                      isSynopsisExpanded ? "" : "line-clamp-4"
                    }`}
                  >
                    {book?.synopsis ||
                      `Buku karya Prof. Dr. H. M. Quraish Shihab ini mengupas secara mendalam tentang sejarah, dinamika pemikiran, serta tradisi keilmuan literasi Islam yang tumbuh dan berkembang pesat sepanjang abad pertengahan hingga era kontemporer.\n\nDalam karya inspiratif ini, pembaca diajak menjelajahi bagaimana peradaban Islam menempatkan ilmu pengetahuan dan baca-tulis sebagai pondasi tertinggi kemajuan sosial dan spiritual. Penulis memaparkan argumentasi filosofis yang jernih namun kaya akan rujukan klasik serta kontemporer.\n\nSangat direkomendasikan bagi kalangan akademisi, mahasiswa, peneliti, dan segenap pecinta literasi keislaman yang mendambakan wawasan komprehensif mengenai pentingnya tradisi membaca dan menulis dalam konteks zaman hari ini.`}
                  </p>
                </div>
                <button
                  onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D32F2F] hover:underline focus:outline-none pt-1 cursor-pointer"
                >
                  <span>{isSynopsisExpanded ? "Tutup" : "Lihat Selengkapnya"}</span>
                  {isSynopsisExpanded ? (
                    <ChevronUp size={14} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={2} />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section: 'Buku Terkait' rendering 4 <BookCard /> components */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-[#EAE5D9] pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#B67A2D] font-bold uppercase tracking-wider">Rekomendasi Terbaik</span>
              <h2 className="font-serif text-2xl font-bold text-[#272522]">Buku Terkait</h2>
            </div>
            <Link
              href="/katalog"
              className="text-xs font-bold text-[#D32F2F] hover:underline"
            >
              Lihat Seluruh Katalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(relatedBooks && relatedBooks.length >= 4 ? relatedBooks : DUMMY_RELATED_BOOKS).map((relatedBook) => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
