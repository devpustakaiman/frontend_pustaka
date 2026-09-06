"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookDetailClient from "../[slug]/BookDetailClient";

function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || searchParams.get("slug") || "";
  return <BookDetailClient slug={id} />;
}

export default function KatalogDetailPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <DetailContent />
    </Suspense>
  );
}
