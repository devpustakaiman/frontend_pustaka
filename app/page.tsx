import HeroBanner from "@/components/HeroBanner";
import RecommendedSection from "@/components/RecommendedSection";
import CategorySection from "@/components/CategorySection";
import RecentlyAddedSection from "@/components/RecentlyAddedSection";
import BestSellerSection from "@/components/BestSellerSection";
import FeaturedVideo from "@/components/FeaturedVideo";
import NewsGrid from "@/components/NewsGrid";
import { getBooks, getArticles } from "@/lib/api";

export default async function Home() {
  const [allBooks, allArticles] = await Promise.all([getBooks(), getArticles()]);

  // Sliced data streams for homepage sections
  const recommendedBooks = allBooks.slice(0, 4);
  const recentlyAddedBooks = allBooks.slice(0, 10);
  const bestSellerBooks = allBooks.slice(0, 10);
  const articles = allArticles.slice(0, 3);

  return (
    <main className="w-full min-h-screen bg-[#FEFDF7]">
      {/* Hero Section */}
      <HeroBanner />

      {/* 1. Recommended Books Section (bg-[#FEFDF7]) */}
      <RecommendedSection books={recommendedBooks} />

      {/* 2. Category Section (bg-[#FEFDF7]) */}
      <CategorySection />

      {/* 3. Recently Added Books Section (bg-[#F7F4E9]) */}
      <RecentlyAddedSection books={recentlyAddedBooks} />

      {/* 4. Best Seller Books Section (bg-[#FEFDF7]) */}
      <BestSellerSection books={bestSellerBooks} />

      {/* 5. Featured Video Section (bg-[#F7F4E9]) */}
      <FeaturedVideo />

      {/* 6. Overhauled Warta & Pengumuman 3-Column Grid (bg-[#F7F4E9]) */}
      <NewsGrid articles={articles} />
    </main>
  );
}
