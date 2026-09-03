import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen py-24 flex items-center justify-center text-[#272522] px-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-50 text-[#E52E2D] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black border border-red-200">
          404
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#272522] mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#76716A] text-sm mb-6">
          Maaf, halaman atau buku yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <div className="flex justify-center">
          <Link
            href="/katalog"
            className="inline-flex items-center justify-center gap-2 bg-[#E52E2D] hover:bg-[#C12A26] text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
