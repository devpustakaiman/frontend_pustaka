import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

interface AuthorItem {
  name: string;
  role: string;
  initials: string;
}

const featuredAuthors: AuthorItem[] = [
  { name: "M. Quraish Shihab", role: "Tafsir & Pemikiran", initials: "QS" },
  { name: "Haidar Bagir", role: "Filsafat & Tasawuf", initials: "HB" },
  { name: "Jalaluddin Rakhmat", role: "Komunikasi & Islam", initials: "JR" },
  { name: "Buya Hamka", role: "Sastra & Sejarah", initials: "BH" },
  { name: "Ibnu 'Arabi", role: "Spiritualitas Klasik", initials: "IA" },
];

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F3] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Massive Serif Headline & Primary CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F1E8D8] border border-[#EAE5D9]">
              <span className="w-2 h-2 rounded-full bg-[#B67A2D]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8D5D20]">
                Pustaka Iman — Paper Haven
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-[#272522] tracking-tight">
              Temukan Bacaan <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#B67A2D]">Bermakna</span> untuk Jiwa
            </h1>

            <p className="text-base md:text-lg text-[#76716A] leading-relaxed max-w-xl font-sans">
              Menghadirkan karya-karya pemikiran, spiritualitas, sejarah, dan literasi bermutu 
              untuk mencerdaskan serta menutrisi kedalaman batin pembaca.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center gap-2 bg-[#B67A2D] hover:bg-[#8D5D20] text-white px-8 py-3.5 rounded-md font-medium transition-all shadow-sm text-sm uppercase tracking-wider"
              >
                <span>Jelajahi Katalog</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/kirim-naskah"
                className="inline-flex items-center justify-center bg-white hover:bg-[#F1E8D8] text-[#272522] px-6 py-3.5 rounded-md font-medium border border-[#EAE5D9] transition-all text-sm uppercase tracking-wider"
              >
                Kirim Naskah
              </Link>
            </div>
          </div>

          {/* Right Column: Staggered Display of 3 Book Covers in Arch-Shaped Backgrounds */}
          <div className="lg:col-span-6 flex justify-center items-center py-6">
            <div className="relative flex items-center justify-center gap-4 sm:gap-6 w-full max-w-lg">
              
              {/* Arch 1 (Left / Back Staggered) */}
              <div className="w-1/3 rounded-t-full rounded-b-xl bg-[#F1E8D8] p-3 sm:p-4 shadow-sm border border-[#EAE5D9] transform -rotate-6 translate-y-6 hover:rotate-0 hover:translate-y-2 transition-all duration-300">
                <div className="bg-white rounded-t-full rounded-b-lg p-2.5 sm:p-3 border border-[#EAE5D9] flex flex-col items-center text-center space-y-3">
                  <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#8D5D20] to-[#B67A2D] flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">
                    PI
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-[#B67A2D] tracking-wider block">
                      Tasawuf
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#272522] line-clamp-1">
                      Lentera Hati
                    </h4>
                  </div>
                </div>
              </div>

              {/* Arch 2 (Center / Main Featured Arch) */}
              <div className="w-1/3 rounded-t-full rounded-b-xl bg-[#F1E8D8] p-4 sm:p-5 shadow-md border border-[#EAE5D9] z-10 transform -translate-y-2 hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-t-full rounded-b-lg p-3 sm:p-4 border border-[#EAE5D9] flex flex-col items-center text-center space-y-3">
                  <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#272522] to-[#B67A2D] flex flex-center items-center justify-center text-white font-serif font-bold text-2xl shadow-md">
                    PI
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-[#B67A2D] tracking-widest block">
                      Pilihan Editor
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#272522] line-clamp-1">
                      Kedalaman Hikmah
                    </h4>
                    <p className="text-[10px] text-[#76716A] line-clamp-1">M. Quraish Shihab</p>
                  </div>
                </div>
              </div>

              {/* Arch 3 (Right / Back Staggered) */}
              <div className="w-1/3 rounded-t-full rounded-b-xl bg-[#F1E8D8] p-3 sm:p-4 shadow-sm border border-[#EAE5D9] transform rotate-6 translate-y-6 hover:rotate-0 hover:translate-y-2 transition-all duration-300">
                <div className="bg-white rounded-t-full rounded-b-lg p-2.5 sm:p-3 border border-[#EAE5D9] flex flex-col items-center text-center space-y-3">
                  <div className="w-full aspect-[2/3] rounded bg-gradient-to-br from-[#76716A] to-[#8D5D20] flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">
                    PI
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-[#B67A2D] tracking-wider block">
                      Filsafat
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#272522] line-clamp-1">
                      Cinta & Akal
                    </h4>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Strip: Horizontal Scrolling / Flex Row Showing Featured Authors */}
        <div className="mt-14 pt-8 border-t border-[#EAE5D9]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D]">
              Penulis Utama Pustaka Iman
            </span>
            <span className="text-xs text-[#76716A] font-medium hidden sm:inline">
              Tokoh & Pemikir Karismatik
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {featuredAuthors.map((author) => (
              <Link
                key={author.name}
                href={`/katalog?penulis=${encodeURIComponent(author.name)}`}
                className="group flex items-center gap-3 px-4 py-2.5 bg-white rounded-full border border-[#EAE5D9] shadow-sm hover:border-[#B67A2D] hover:shadow transition-all shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#F1E8D8] border border-[#EAE5D9] flex items-center justify-center font-serif text-xs font-bold text-[#B67A2D] group-hover:bg-[#B67A2D] group-hover:text-white transition-colors">
                  {author.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#272522] group-hover:text-[#B67A2D] transition-colors leading-tight">
                    {author.name}
                  </span>
                  <span className="text-[10px] text-[#76716A]">{author.role}</span>
                </div>
                <ChevronRight size={14} className="text-[#76716A] group-hover:translate-x-0.5 group-hover:text-[#B67A2D] transition-all ml-1" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
