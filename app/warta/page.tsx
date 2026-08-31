import { getArticles } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";

export default async function WartaPage() {
  const articles = await getArticles();

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#EAE5D9] pb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D]">
            Informasi Terkini
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Warta & Pengumuman
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
