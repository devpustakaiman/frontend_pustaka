import Link from "next/link";
import {
  Share2,
  Send,
  MessageCircle,
  ArrowLeft,
  Building2,
  Target,
  Eye,
} from "lucide-react";


export const metadata = {
  title: "Tentang Kami - Pustaka IIMaN",
  description:
    "Profil penerbit Pustaka IIMaN. Didirikan pada tahun 2001, penerbit profesional dan berpengalaman di Indonesia.",
};

export default function TentangKamiPage() {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "https://pustakaiiman.com/tentang-kami";
  const shareText = "Pustaka IIMaN - Penerbit Profesional & Berpengalaman";

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10 md:py-16 text-[#272522]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation / Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-[#272522] bg-white border border-[#EAE5D9] rounded-full hover:bg-white/80 hover:border-[#B67A2D]/40 shadow-sm transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <article className="bg-white border border-[#EAE5D9] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="border-b border-[#EAE5D9] pb-6 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F3] border border-[#EAE5D9] text-xs font-bold text-[#B67A2D] rounded-md uppercase tracking-wider">
              <Building2 size={13} />
              Profil Penerbit
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272522] leading-tight">
              Tentang Pustaka IIMaN
            </h1>
          </div>

          {/* Typography Content */}
          <div className="prose prose-amber max-w-none text-[#272522]/90 leading-relaxed text-base sm:text-lg space-y-6">
            <p className="text-base sm:text-lg leading-relaxed">
              Didirikan pada tahun 2001, Pustaka IIMaN adalah penerbit yang profesional dan berpengalaman. Menerbitkan berbagai macam buku yang diterjemahkan dari bahasa Inggris dan Arab dan juga buku-buku berkualitas yang ditulis oleh penulis-penulis Indonesia. Beberapa buku kami telah dicetak ulang dan mendapat kategori best-seller.
            </p>

            {/* Visi Card */}
            <div className="bg-[#FAF8F3] border border-[#EAE5D9] rounded-2xl p-6 md:p-8 space-y-3 my-6">
              <div className="flex items-center gap-2 text-[#B67A2D]">
                <Eye size={22} strokeWidth={2} />
                <h2 className="font-serif text-2xl font-bold text-[#272522] m-0">Visi</h2>
              </div>
              <p className="text-base sm:text-lg text-[#272522]/90 m-0 font-medium leading-relaxed">
                Ikut berpartisipasi membangun kebudayaan dan pendidikan manusia Indonesia.
              </p>
            </div>

            {/* Misi Card */}
            <div className="bg-[#FAF8F3] border border-[#EAE5D9] rounded-2xl p-6 md:p-8 space-y-3 my-6">
              <div className="flex items-center gap-2 text-[#D32F2F]">
                <Target size={22} strokeWidth={2} />
                <h2 className="font-serif text-2xl font-bold text-[#272522] m-0">Misi</h2>
              </div>
              <p className="text-base sm:text-lg text-[#272522]/90 m-0 font-medium leading-relaxed">
                Menerbitkan buku-buku berkualitas yang memberikan kontribusi besar untuk tujuan pendidikan dan pembentukan karakter nasional.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-[#EAE5D9] pt-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#76716A] uppercase tracking-wider">
              <Share2 size={16} className="text-[#B67A2D]" />
              <span>Bagikan Halaman Ini:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter / X</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${pageUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <MessageCircle size={16} fill="currentColor" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Send size={16} />
                <span>Telegram</span>
              </a>

              {/* Line */}
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <span className="font-black text-xs">LINE</span>
                <span>Line</span>
              </a>
            </div>
          </div>

        </article>

      </div>
    </div>
  );
}
