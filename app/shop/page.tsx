"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ShopRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    if (params) {
      router.replace(`/katalog?${params}`);
    } else {
      router.replace("/katalog");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E52E2D]" />
    </div>
  );
}

export default function ShopRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E52E2D]" />
        </div>
      }
    >
      <ShopRedirectContent />
    </Suspense>
  );
}
