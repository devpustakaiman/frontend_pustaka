import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CatalogClient from "@/components/CatalogClient";
import { BookCardSkeletonGrid } from "@/components/BookCardSkeleton";
import { getBooks } from "@/lib/api";

export default async function KatalogPage() {
  const books = await getBooks();

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Modern Back to Home Button at Top Left */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#272522] bg-white border border-[#EAE5D9] rounded-full hover:bg-white/80 hover:border-[#B67A2D]/40 shadow-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>&lt;- Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page header */}
        <div className="border-b border-[#EAE5D9] pb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D]">
            Katalog Lengkap
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Katalog Buku Pustaka Iman
          </h1>
          <p className="text-sm text-[#76716A] mt-2">
            Jelajahi seluruh koleksi publikasi dan penerbitan berkualitas dari
            Pustaka Iman.
          </p>
        </div>

        {/* CatalogClient wraps category filter pills, sorting dropdown, and BookGrid */}
        <Suspense fallback={<BookCardSkeletonGrid count={8} />}>
          <CatalogClient books={books} />
        </Suspense>
      </div>
    </div>
  );
}
