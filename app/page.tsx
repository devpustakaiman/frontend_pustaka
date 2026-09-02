import HeroBanner from "@/components/HeroBanner";
import PromoSection from "@/components/PromoSection";
import RecommendedSection from "@/components/RecommendedSection";
import RecentlyAddedSection from "@/components/RecentlyAddedSection";
import CategorySection from "@/components/CategorySection";
import FeaturedVideo from "@/components/FeaturedVideo";
import NewsGrid from "@/components/NewsGrid";
import { getPromoBooks, getRecommendedBooks, getNewBooks, getArticles } from "@/lib/api";

export default async function Home() {
  // Fetch real backend data from Supabase
  const [promoBooks, recommendedBooks, newBooks, articles] = await Promise.all([
    getPromoBooks(),
    getRecommendedBooks(),
    getNewBooks(),
    getArticles(),
  ]);

  // Fallbacks if database table records for promo or recommended are not populated yet
  const displayPromo = promoBooks.length > 0 ? promoBooks : newBooks;
  const displayRecommended =
    recommendedBooks.length > 0 ? recommendedBooks : newBooks.slice(0, 4);

  return (
    <main className="w-full min-h-screen bg-[#FEFDF7]">
      {/* 1. Hero / Banner Section */}
      <HeroBanner />

      {/* 2. Promo Section: 🔥 FLASH SALE & PROMO SPESIAL */}
      <PromoSection books={displayPromo} />

      {/* 3. Recommendation Section: ⭐ Pilihan Editor */}
      <RecommendedSection books={displayRecommended} title="⭐ Pilihan Editor" />

      {/* 4. New Arrivals Section: ✨ Buku Baru Terbit */}
      <RecentlyAddedSection books={newBooks} />

      {/* Secondary Sections */}
      <CategorySection />
      <FeaturedVideo />
      <NewsGrid articles={articles.slice(0, 3)} />
    </main>
  );
}



