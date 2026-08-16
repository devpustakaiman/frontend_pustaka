import BookGrid from "@/components/BookGrid";

export default function KatalogPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Katalog Buku
          </h1>
          <p className="text-slate-400 mt-2">
            Jelajahi seluruh koleksi publikasi dan penerbitan berkualitas dari Pustaka Ilman.
          </p>
        </div>
        <BookGrid />
      </div>
    </div>
  );
}
