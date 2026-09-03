"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContactRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/kontak");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E52E2D]" />
    </div>
  );
}
