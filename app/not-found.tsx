import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-24 flex items-center justify-center text-[#272522] px-4">
      <div className="max-w-md w-full bg-white border border-[#EAE5D9] rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-[#F1E8D8] text-[#B67A2D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-[#EAE5D9]">
          404
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#272522] mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#76716A] text-sm mb-6">
          Maaf, halaman atau buku yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#B67A2D] hover:bg-[#8D5D20] font-medium text-[#FAF8F3] rounded-md shadow-sm transition-all text-xs uppercase tracking-wider"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
}
