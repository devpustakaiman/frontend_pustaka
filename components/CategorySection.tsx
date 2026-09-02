import Link from "next/link";
import {
  BookOpen,
  Feather,
  Sparkles,
  Scroll,
  Compass,
  Globe,
  Heart,
  Layers,
  ChevronRight,
  Compass as CompassIcon,
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  count: string;
  icon: React.ElementType;
  bg: string;
  borderColor: string;
  iconBg: string;
}

const categories: CategoryCardProps[] = [
  {
    name: "Agama & Filsafat",
    count: "140+ Buku",
    icon: BookOpen,
    bg: "bg-[#FFFDF7]",
    borderColor: "border-amber-200/80",
    iconBg: "bg-amber-100/90 text-amber-800",
  },
  {
    name: "Fiksi & Novel",
    count: "250+ Buku",
    icon: Feather,
    bg: "bg-[#F4FBF7]",
    borderColor: "border-emerald-200/80",
    iconBg: "bg-emerald-100/90 text-emerald-800",
  },
  {
    name: "Buku Anak & Komik",
    count: "180+ Buku",
    icon: Sparkles,
    bg: "bg-[#F4FAFF]",
    borderColor: "border-sky-200/80",
    iconBg: "bg-sky-100/90 text-sky-800",
  },
  {
    name: "Non Fiksi & Biografi",
    count: "110+ Buku",
    icon: Scroll,
    bg: "bg-[#FFF9F3]",
    borderColor: "border-orange-200/80",
    iconBg: "bg-orange-100/90 text-orange-800",
  },
  {
    name: "Pengembangan Diri",
    count: "95+ Buku",
    icon: Compass,
    bg: "bg-[#F6F5FF]",
    borderColor: "border-indigo-200/80",
    iconBg: "bg-indigo-100/90 text-indigo-800",
  },
  {
    name: "Social Science",
    count: "80+ Buku",
    icon: Globe,
    bg: "bg-[#F4F8FF]",
    borderColor: "border-blue-200/80",
    iconBg: "bg-blue-100/90 text-blue-800",
  },
  {
    name: "Psikologi & Humaniora",
    count: "120+ Buku",
    icon: Heart,
    bg: "bg-[#FFF5F7]",
    borderColor: "border-rose-200/80",
    iconBg: "bg-rose-100/90 text-rose-800",
  },
  {
    name: "Sains & Teknologi",
    count: "75+ Buku",
    icon: Layers,
    bg: "bg-[#F3FAF9]",
    borderColor: "border-teal-200/80",
    iconBg: "bg-teal-100/90 text-teal-800",
  },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-[#FEFDF7] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Parchment Outer Container */}
        <div className="bg-[#FAF7F0] border border-[#EAE3D2] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-[#EAE3D2] gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B67A2D] bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200/80 mb-2">
                <CompassIcon size={13} className="text-[#B67A2D]" />
                EKSPLORASI LITERASI
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
                Kategori Pilihan
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Temukan buku berdasarkan genre favorit dan topik favoritmu.
              </p>
            </div>

            <Link
              href="/katalog"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#B67A2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-[#EAE3D2] shadow-2xs hover:shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Lihat Semua Kategori</span>
              <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Responsive Category Grid (2 Cols on Mobile, 4 Cols on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                  className={`bg-white border ${cat.borderColor} hover:border-[#B67A2D] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-xs sm:text-sm text-[#272522] leading-snug truncate group-hover:text-[#B67A2D] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-[#76716A] font-medium block truncate mt-0.5">
                        {cat.count}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-[#B67A2D] group-hover:translate-x-1 transition-all shrink-0 ml-1"
                  />
                </Link>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

