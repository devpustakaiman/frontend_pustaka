import Link from "next/link";
import {
  BookOpen,
  Feather,
  Sparkles,
  Scroll,
  Compass,
  Globe,
  Heart,
} from "lucide-react";

interface CategoryItemData {
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const topLevelCategories: CategoryItemData[] = [
  {
    name: "Agama & Filsafat",
    icon: BookOpen,
    color: "text-[#B67A2D]",
    bg: "bg-[#F1E8D8] hover:bg-[#B67A2D]",
  },
  {
    name: "Fiksi",
    icon: Feather,
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-600",
  },
  {
    name: "Buku Anak",
    icon: Sparkles,
    color: "text-sky-600",
    bg: "bg-sky-50 hover:bg-sky-600",
  },
  {
    name: "Non Fiksi",
    icon: Scroll,
    color: "text-amber-600",
    bg: "bg-amber-50 hover:bg-amber-600",
  },
  {
    name: "Pengembangan Diri & Karier",
    icon: Compass,
    color: "text-indigo-600",
    bg: "bg-indigo-50 hover:bg-indigo-600",
  },
  {
    name: "Social Science",
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-600",
  },
  {
    name: "Psikologi",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50 hover:bg-rose-600",
  },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-[#FEFDF7] pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B67A2D] block mb-1">
              Eksplorasi Literasi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#272522] tracking-tight">
              Kategori Pilihan
            </h2>
          </div>
          <Link
            href="/katalog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#76716A] hover:text-[#B67A2D] transition-colors"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {/* Horizontally scrollable pill row */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {topLevelCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/katalog?category=${encodeURIComponent(cat.name)}`}
                className={`group flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#EAE5D9] bg-white transition-all duration-200 hover:border-transparent hover:shadow-md hover:text-white active:scale-95 ${cat.bg}`}
              >
                <span className={`transition-colors duration-200 group-hover:text-white ${cat.color}`}>
                  <Icon size={16} strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-[#272522] group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
