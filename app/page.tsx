import HeroBanner from "@/components/HeroBanner";
import BookGrid from "@/components/BookGrid";
import NewsTimeline from "@/components/NewsTimeline";
import { getBooks, getArticles } from "@/lib/api";

export default async function Home() {
  const [allBooks, allArticles] = await Promise.all([getBooks(), getArticles()]);

  const books = allBooks.slice(0, 4);
  const articles = allArticles.slice(0, 3);

  return (
    <div>
      <HeroBanner />
      <section className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Buku Pilihan
            </h2>
            <p className="text-slate-400 mt-1">
              Koleksi buku penerbitan terbaru dan rekomendasi terbaik.
            </p>
          </div>
          <BookGrid books={books} />
        </div>
      </section>
      <NewsTimeline articles={articles} />
    </div>
  );
}
