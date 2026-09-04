import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CatalogClient from "@/components/CatalogClient";
import { BookCardSkeletonGrid } from "@/components/BookCardSkeleton";
import { getBooks } from "@/lib/api";

export default async function KatalogPage() {
  const books = await getBooks();

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Modern Back to Home Button at Top Left */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-white hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* CatalogClient handles Dynamic Header, Promo Banner, Filters & BookGrid on Client */}
        <Suspense fallback={<BookCardSkeletonGrid count={8} />}>
          <CatalogClient books={books} />
        </Suspense>
      </div>
    </div>
  );
}
