import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticles } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";

export default async function WartaPage() {
  const articles = await getArticles();

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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

        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs uppercase tracking-wider font-bold text-[#E52E2D]">
            Informasi Terkini
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Warta & <span className="text-[#C12A26] italic font-serif">Pengumuman</span>
          </h1>
          <p className="text-sm text-[#76716A] mt-2">
            Kumpulan kabar, warta publikasi, dan artikel pilihan dari Pustaka Iman.
          </p>
        </div>

        <NewsGrid articles={articles} />
      </div>
    </div>
  );
}
