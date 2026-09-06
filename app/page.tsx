import HeroBanner from "@/components/HeroBanner";
import PromoSection from "@/components/PromoSection";
import RecommendedSection from "@/components/RecommendedSection";
import RecentlyAddedSection from "@/components/RecentlyAddedSection";
import CategorySection from "@/components/CategorySection";
import WartaSection from "@/components/WartaSection";
import {
  getPromoBooks,
  getRecommendedBooks,
  getNewBooks,
  getArticles,
  getMediaVideos,
  getSiteSettings,
} from "@/lib/api";

export default async function Home() {
  // Fetch real backend data from Supabase with safe catch fallbacks
  const [promoBooks, recommendedBooks, newBooks, articles, videos, settings] = await Promise.all([
    getPromoBooks().catch(() => []),
    getRecommendedBooks().catch(() => []),
    getNewBooks().catch(() => []),
    getArticles().catch(() => []),
    getMediaVideos().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const safePromo = Array.isArray(promoBooks) ? promoBooks : [];
  const safeRecommended = Array.isArray(recommendedBooks) ? recommendedBooks : [];
  const safeNew = Array.isArray(newBooks) ? newBooks : [];
  const safeArticles = Array.isArray(articles) ? articles : [];
  const safeVideos = Array.isArray(videos) ? videos : [];

  // Fallbacks if database table records for promo or recommended are not populated yet
  const displayPromo = safePromo.length > 0 ? safePromo : safeNew;
  const displayRecommended =
    safeRecommended.length > 0 ? safeRecommended : safeNew.slice(0, 4);

  // Featured book for Hero Floating Badge ('Pilihan Minggu Ini')
  const featuredBook =
    settings?.featured_book ||
    displayRecommended[0] ||
    displayPromo[0] ||
    safeNew[0] ||
    null;

  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Hero / Banner Section */}
      <HeroBanner settings={settings || null} featuredBook={featuredBook} />

      {/* 2. Promo Section: 🔥 FLASH SALE & PROMO SPESIAL */}
      <PromoSection books={displayPromo} />

      {/* 3. Recommendation Section: ⭐ Pilihan Editor */}
      <RecommendedSection books={displayRecommended} title="⭐ Pilihan Editor" />

      {/* 4. New Arrivals Section: ✨ Buku Baru Terbit */}
      <RecentlyAddedSection books={safeNew} />

      {/* Secondary Sections */}
      <CategorySection />
      
      {/* 5. Warta & Media Preview Section */}
      <WartaSection articles={safeArticles} videos={safeVideos} />
    </main>
  );
}
