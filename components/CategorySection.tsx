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
  icon: React.ElementType;
  bg: string;
  borderColor: string;
  iconBg: string;
}

const categories: CategoryCardProps[] = [
  {
    name: "Agama & Filsafat",
    icon: BookOpen,
    bg: "bg-red-50/50",
    borderColor: "border-red-200/60",
    iconBg: "bg-red-100 text-[#E52E2D]",
  },
  {
    name: "Fiksi & Novel",
    icon: Feather,
    bg: "bg-[#F4FBF7]",
    borderColor: "border-emerald-200/80",
    iconBg: "bg-emerald-100/90 text-emerald-800",
  },
  {
    name: "Buku Anak & Komik",
    icon: Sparkles,
    bg: "bg-[#F4FAFF]",
    borderColor: "border-sky-200/80",
    iconBg: "bg-sky-100/90 text-sky-800",
  },
  {
    name: "Non Fiksi & Biografi",
    icon: Scroll,
    bg: "bg-rose-50/50",
    borderColor: "border-rose-200/60",
    iconBg: "bg-rose-100 text-rose-800",
  },
  {
    name: "Pengembangan Diri",
    icon: Compass,
    bg: "bg-[#F6F5FF]",
    borderColor: "border-indigo-200/80",
    iconBg: "bg-indigo-100/90 text-indigo-800",
  },
  {
    name: "Social Science",
    icon: Globe,
    bg: "bg-[#F4F8FF]",
    borderColor: "border-blue-200/80",
    iconBg: "bg-blue-100/90 text-blue-800",
  },
  {
    name: "Psikologi & Humaniora",
    icon: Heart,
    bg: "bg-[#FFF5F7]",
    borderColor: "border-rose-200/80",
    iconBg: "bg-rose-100/90 text-rose-800",
  },
  {
    name: "Sains & Teknologi",
    icon: Layers,
    bg: "bg-[#F3FAF9]",
    borderColor: "border-teal-200/80",
    iconBg: "bg-teal-100/90 text-teal-800",
  },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Neutral Outer Container */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-gray-200/70 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-2">
                <CompassIcon size={13} className="text-[#E52E2D]" />
                EKSPLORASI LITERASI
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#272522] tracking-tight">
                Kategori <span className="text-[#C12A26] italic font-serif">Pilihan</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-1 font-medium">
                Temukan buku berdasarkan genre favorit dan topik yang menggugah jiwamu.
              </p>
            </div>

            <Link
              href="/katalog"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Lihat Semua Kategori</span>
              <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>

          {/* Clean Modern Category Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white border border-gray-200/80 hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-[#272522] leading-snug truncate group-hover:text-[#E52E2D] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-[#E52E2D] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5"
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
