"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getArticleById } from "@/lib/api";
import RenderTextWithLinks from "@/components/RenderTextWithLinks";
import ShareSection from "@/components/ShareSection";
import { formatIndonesianDate, parseQuillJsonToParagraphs } from "@/lib/utils";
import { generateSlug } from "@/lib/slugify";

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200";

const MOCK_QUILL_JSON = JSON.stringify([
  {
    insert:
      "Pustaka Iman secara resmi meluncurkan inisiatif literasi digital baru yang dirancang untuk memperluas jangkauan bahan bacaan dan publikasi keislaman berkualitas di seluruh nusantara.\n\n",
  },
  {
    insert:
      "Peluncuran yang dihadiri oleh sejumlah tokoh literasi, akademisi, dan ulama terkemuka ini menandai babak baru dalam transformasi digital penerbitan buku Islam kontemporer.\n\n",
  },
  {
    insert:
      "Direktur Pustaka Iman menyampaikan bahwa melalui platform digital ini, masyarakat dapat mengakses ratusan judul buku klasik maupun modern dengan lebih mudah, ramah pengguna, dan responsif di berbagai perangkat.\n\n",
  },
  {
    insert:
      "Inisiatif ini juga mencakup program pendistribusian naskah digital dan kolaborasi bersama para penulis muda di seluruh Indonesia untuk mendorong lahirnya karya-karya pemikiran Islam yang jernih, mencerahkan, dan relevan dengan tantangan zaman.\n",
  },
]);

interface ArticleDetailClientProps {
  slug: string;
}

export default function ArticleDetailClient({ slug }: ArticleDetailClientProps) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const data = await getArticleById(slug);
        if (data) {
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Error loading article:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-16 text-[#272522]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-full w-44" />
          <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6">
            <div className="w-full aspect-[16/9] max-h-[480px] bg-gray-200 rounded-2xl" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !article) {
    return (
      <div className="bg-white min-h-screen py-20 text-[#272522] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-[#E52E2D] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            404
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#272522]">
            Warta Tidak Ditemukan
          </h1>
          <p className="text-sm text-[#76716A]">
            Maaf, warta atau artikel yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <div>
            <Link
              href="/warta"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#E52E2D] hover:bg-[#C12A26] rounded-full shadow-md transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Kembali ke Warta</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroImage = article?.image_url || article?.imageUrl || DEFAULT_HERO_IMAGE;
  const rawDate = article?.created_at || article?.date || "2026-08-13";
  const formattedDate = formatIndonesianDate(rawDate);
  const authorName = article?.author || "Redaksi Pustaka Iman";
  const categoryName = article?.category || "Warta & Berita";

  // Parse raw Quill JSON or string into clean readable paragraphs
  const rawContent = article?.content || MOCK_QUILL_JSON;
  const paragraphs = parseQuillJsonToParagraphs(rawContent);

  return (
    <div className="bg-white min-h-screen py-8 md:py-14 text-[#272522]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button: Kembali ke Warta */}
        <div>
          <Link
            href="/warta"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Warta</span>
          </Link>
        </div>

        {/* Hero Card & Content Header */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Large Hero Image at the Top */}
          <div className="w-full aspect-[16/9] max-h-[480px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner">
            <Image
              src={heroImage}
              alt={article?.title || "Warta Pustaka Iman"}
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title, Category, Author, and Date */}
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 bg-red-50 border border-red-200/60 text-xs font-bold text-[#E52E2D] rounded-full uppercase tracking-wider">
                {categoryName}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#272522] leading-tight">
              {article?.title || "Peluncuran Inisiatif Literasi Digital Pustaka Iman"}
            </h1>

            {/* Author and Date Meta Row */}
            <div className="flex items-center gap-6 text-xs md:text-sm text-[#76716A] pt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#E52E2D]" />
                <span>
                  Penulis:{" "}
                  <Link
                    href={`/katalog?author=${generateSlug(authorName)}`}
                    className="text-[#272522] font-semibold hover:text-[#E52E2D] hover:underline transition-colors"
                  >
                    {authorName}
                  </Link>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#E52E2D]" />
                <time dateTime={rawDate}>{formattedDate}</time>
              </div>
            </div>
          </div>

          {/* Body Content: Clean Readable Paragraphs */}
          <div className="prose prose-lg max-w-none text-[#272522]/90 leading-relaxed font-serif space-y-6 pt-2">
            {paragraphs && paragraphs.length > 0 ? (
              paragraphs.map((para, index) => (
                <p key={index} className="text-base sm:text-lg leading-relaxed text-[#272522]/90">
                  <RenderTextWithLinks text={para} />
                </p>
              ))
            ) : (
              <p className="text-base sm:text-lg leading-relaxed text-[#272522]/90">
                Konten warta sedang disiapkan oleh Redaksi Pustaka Iman.
              </p>
            )}
          </div>

          {/* Share Section */}
          <ShareSection title={article?.title || "Warta Pustaka Iman"} className="border-t border-gray-100 pt-6" />

          {/* Article Footer & Back Button */}
          <div className="border-t border-gray-100 pt-8 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/warta"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold text-[#272522] bg-gray-50 hover:bg-red-50 hover:text-[#E52E2D] hover:border-[#E52E2D] border border-gray-200 rounded-xl transition-all duration-200 shadow-2xs"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Kembali ke Warta</span>
            </Link>

            <span className="text-xs text-[#76716A] italic">
              Hak Cipta &copy; {new Date().getFullYear()} Pustaka Iman
            </span>
          </div>

        </div>
      </article>
    </div>
  );
}
