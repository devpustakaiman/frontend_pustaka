"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
        const fetchedBook = await getBookById(slug);
        setBook(fetchedBook);

        if (fetchedBook) {
          const cover = fetchedBook.coverUrl || fetchedBook.cover_url || PLACEHOLDER_COVER;
          setActiveImage(cover);
        }

        const allBooks = await getBooks();
        if (allBooks && allBooks.length > 0) {
          const related = allBooks
            .filter((b: any) => String(b.id) !== String(slug))
            .slice(0, 4);
          setRelatedBooks(related);
        }
      } catch (err) {
        console.error("Gagal memuat detail buku:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadBookData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-16 text-[#272522]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded-full w-44" />
            <div className="bg-white border border-gray-200 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 aspect-[3/4] bg-gray-200 rounded-2xl" />
              <div className="md:col-span-7 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-28" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-100 rounded-2xl" />
                <div className="h-12 bg-gray-200 rounded-xl w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mainCover = book?.cover_url || book?.coverUrl || PLACEHOLDER_COVER;

  // Support all possible gallery column names from Supabase
  const rawGallery = book
    ? Array.isArray(book.gallery_urls) && book.gallery_urls.length > 0
      ? book.gallery_urls
      : Array.isArray(book.gallery_images) && book.gallery_images.length > 0
      ? book.gallery_images
      : Array.isArray(book.galleryUrls) && book.galleryUrls.length > 0
      ? book.galleryUrls
      : Array.isArray(book.galleryImages) && book.galleryImages.length > 0
      ? book.galleryImages
      : [book.gallery_url_1, book.gallery_url_2, book.gallery_url_3, book.gallery_url_4].filter(
          (url): url is string => typeof url === "string" && url.trim().length > 0
        )
    : [];

  // Combine cover and gallery items, filter nulls/empties, and remove duplicates
  const allImages = Array.from(
    new Set([mainCover, ...rawGallery].filter((img): img is string => typeof img === "string" && img.trim().length > 0))
  );

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
    <div className="bg-white min-h-screen py-8 md:py-12 text-[#272522]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
        
        {/* Navigation / Back Button */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Top Layout: 2 Columns Above the Fold */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Book Cover + Mockup Gallery Row */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative w-full aspect-[3/4] max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-xl bg-gray-50 flex items-center justify-center p-4">
                <Image
                  src={currentDisplayImage}
                  alt={book?.title || "Sampul Buku"}
                  fill
                  sizes="(max-width: 768px) 100vw, 340px"
                  priority
                  className="w-full h-full object-contain drop-shadow-md transition-all duration-300"
                />
                {hasActivePromo && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-[#E52E2D] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      <Tag size={13} />
                      <span>PROMO</span>
                      {discountPct && <span>-{discountPct}%</span>}
                    </span>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="mt-4">
                  <p className="text-[11px] font-bold text-[#76716A] uppercase tracking-wider mb-2">
                    PRATINJAU SAMPUL & DETAIL GALERI
                  </p>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(imgUrl)}
                        className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-gray-50 cursor-pointer ${
                          currentDisplayImage === imgUrl
                            ? "border-[#E52E2D] ring-2 ring-red-200 shadow-sm scale-105"
                            : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${book?.title || "Buku"} preview ${idx + 1}`}
                          fill
                          sizes="64px"
                          loading="lazy"
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Title, Author, Price & 'Beli di Mizanstore' CTA */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-red-50 border border-red-200/60 text-xs font-bold text-[#E52E2D] rounded-full uppercase tracking-wider">
                    {book?.category || "Literasi Utama"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#76716A] bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full font-medium">
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
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 space-y-4">
                
                {/* FOMO Countdown Banner if Promo Active */}
                {hasActivePromo && (
                  <div className="bg-red-50/80 border border-red-200/70 rounded-xl p-3 flex items-center gap-2.5 text-red-950 text-xs sm:text-sm font-semibold shadow-2xs">
                    <span className="text-lg animate-bounce">🔥</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-[#E52E2D] flex-shrink-0" />
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
                      <span className="text-3xl sm:text-4xl font-black text-[#E52E2D]">
                        {formattedPromoPrice}
                      </span>
                      <span className="line-through text-gray-400 text-lg font-normal">
                        {formattedOriginalPrice}
                      </span>
                      {discountPct && (
                        <span className="bg-[#E52E2D] text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-sm">
                          -{discountPct}%
                        </span>
                      )}
                    </div>
                  ) : isFallbackPrice ? (
                    <span className="text-xl font-bold text-[#E52E2D] italic block">
                      {formattedOriginalPrice}
                    </span>
                  ) : (
                    <span className="text-3xl font-black text-[#E52E2D]">
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
                    className="w-full px-6 py-4 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-center"
                  >
                    <span>Beli di Mizanstore</span>
                    <ExternalLink size={16} strokeWidth={2} />
                  </a>
                </div>
              </div>

              {/* Synopsis Section: line-clamp-4 with toggle */}
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <h2 className="font-serif text-xl font-bold text-[#272522]">Deskripsi Buku</h2>
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E52E2D] hover:underline focus:outline-none pt-1 cursor-pointer"
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
          <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#E52E2D] font-bold uppercase tracking-wider">Rekomendasi Terbaik</span>
              <h2 className="font-serif text-2xl font-bold text-[#272522]">
                Buku <span className="text-[#C12A26] italic font-serif">Terkait</span>
              </h2>
            </div>
            <Link
              href="/katalog"
              className="text-xs font-bold text-[#E52E2D] hover:underline flex items-center gap-1"
            >
              <span>Lihat Seluruh Katalog</span>
              <span>&rarr;</span>
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
