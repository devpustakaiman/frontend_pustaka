"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Feather,
  Sparkles,
  Scroll,
  Compass,
  ChevronRight,
  Star,
} from "lucide-react";

import { generateSlug } from "@/lib/slugify";
import { getFeaturedCategories, FeaturedCategoriesConfig } from "@/lib/api";

interface CategorySectionProps {
  initialFeaturedData?: FeaturedCategoriesConfig | null;
}

// Helper link katalog terintegrasi ganda (query kategori & category)
const buildKatalogUrl = (categoryName: string, customSlug?: string) => {
  if (!categoryName) return "/katalog";
  const slug = customSlug || generateSlug(categoryName);
  return `/katalog?kategori=${slug}&category=${slug}`;
};

const DEFAULT_MAIN_CATEGORY = {
  name: "Agama & Filsafat",
  desc: "Memahami iman, pemikiran, dan kehidupan.",
  slug: "agama-filsafat",
  href: buildKatalogUrl("Agama & Filsafat", "agama-filsafat"),
  covers: [
    "/assets/categories/agama/BA-066-cov1.jpg",
    "/assets/categories/agama/NA-271-cov1.jpg",
    "/assets/categories/agama/agama.png",
  ],
};

const DEFAULT_CATEGORIES = [
  {
    name: "Fiksi & Novel",
    slug: generateSlug("Fiksi & Novel"),
    icon: Feather,
    href: buildKatalogUrl("Fiksi & Novel"),
    bg: "bg-red-50/70 border-red-100/90",
    iconBg: "bg-red-100 text-[#E52E2D]",
    covers: [
      "/assets/categories/fiksi-novel/BE-183-cov1.jpg",
      "/assets/categories/fiksi-novel/QN-165-cov1.jpg",
    ],
  },
  {
    name: "Buku Anak & Komik",
    slug: generateSlug("Buku Anak & Komik"),
    icon: Sparkles,
    href: buildKatalogUrl("Buku Anak & Komik"),
    bg: "bg-blue-50/70 border-blue-100/90",
    iconBg: "bg-blue-100 text-blue-700",
    covers: [
      "/assets/categories/buku-anak-komik/MC-1728-cov1.jpg",
      "/assets/categories/buku-anak-komik/RK-1990-cov1.jpg",
    ],
  },
  {
    name: "Non Fiksi & Biografi",
    slug: generateSlug("Non Fiksi & Biografi"),
    icon: Scroll,
    href: buildKatalogUrl("Non Fiksi & Biografi"),
    bg: "bg-amber-50/70 border-amber-100/90",
    iconBg: "bg-amber-100 text-amber-800",
    covers: [
      "/assets/categories/nonfiksi-biografi/sukarno-khrushchev-pre-order.jpg",
      "/assets/categories/nonfiksi-biografi/cover_dewi_langit1.png",
    ],
  },
  {
    name: "Pengembangan Diri",
    slug: generateSlug("Pengembangan Diri"),
    icon: Compass,
    href: buildKatalogUrl("Pengembangan Diri"),
    bg: "bg-emerald-50/70 border-emerald-100/90",
    iconBg: "bg-emerald-100 text-emerald-800",
    covers: [
      "/assets/categories/pengembangan-diri/BACA0136-cov1.jpg",
      "/assets/categories/pengembangan-diri/cover_who.jpg",
    ],
  },
];

export default function CategorySection({ initialFeaturedData }: CategorySectionProps) {
  const [featuredData, setFeaturedData] = useState<FeaturedCategoriesConfig | null>(
    initialFeaturedData || null
  );

  useEffect(() => {
    async function loadFreshSettings() {
      try {
        const fresh = await getFeaturedCategories();
        if (fresh) {
          setFeaturedData(fresh);
        }
      } catch (err) {
        console.error("[CategorySection] Error loading dynamic featured categories:", err);
      }
    }
    loadFreshSettings();
  }, []);

  const rawMain = featuredData?.main;
  const mainName = rawMain?.name || DEFAULT_MAIN_CATEGORY.name;
  const mainSlug = rawMain?.slug || generateSlug(mainName);

  const dbMainCovers = rawMain?.covers?.filter(Boolean) || [];
  const mainCovers =
    dbMainCovers.length > 0
      ? [
          dbMainCovers[0] || DEFAULT_MAIN_CATEGORY.covers[0],
          dbMainCovers[1] || DEFAULT_MAIN_CATEGORY.covers[1],
          dbMainCovers[2] || DEFAULT_MAIN_CATEGORY.covers[2],
        ]
      : DEFAULT_MAIN_CATEGORY.covers;

  const mainCategory = {
    name: mainName,
    desc: rawMain?.desc || (rawMain as any)?.description || DEFAULT_MAIN_CATEGORY.desc,
    href: buildKatalogUrl(mainName, mainSlug),
    covers: mainCovers,
  };

  const rawCats = featuredData?.categories || [];
  const categories = DEFAULT_CATEGORIES.map((defaultCat, idx) => {
    const rawCat = rawCats[idx];
    const name = rawCat?.name || defaultCat.name;
    const slug = rawCat?.slug || generateSlug(name);
    const href = buildKatalogUrl(name, slug);

    const dbCovers = rawCat?.covers?.filter(Boolean) || [];
    const covers =
      dbCovers.length > 0
        ? [dbCovers[0] || defaultCat.covers[0], dbCovers[1] || defaultCat.covers[1]]
        : defaultCat.covers;

    return {
      ...defaultCat,
      name,
      slug,
      href,
      covers,
    };
  });

  return (
    <section className="w-full bg-white py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Parchment Box */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-xs relative overflow-hidden">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200/80 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E52E2D] bg-red-50 px-3 py-1 rounded-full border border-red-200/80 mb-1.5">
                <Star size={13} className="text-[#E52E2D] fill-[#E52E2D]" />
                EKSPLORASI LITERASI
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#272522] tracking-tight">
                Kategori <span className="text-[#C12A26] italic font-serif">Pilihan</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#76716A] mt-0.5 font-medium">
                Temukan buku berdasarkan genre favorit dan topik yang menggugah jiwamu.
              </p>
            </div>

            <Link
              href="/katalog"
              prefetch={false}
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#272522] hover:text-[#E52E2D] transition-colors bg-white px-4 py-2.5 rounded-full border border-gray-200/80 shadow-2xs hover:shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Lihat Semua Kategori</span>
              <ChevronRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform text-[#E52E2D]" />
            </Link>
          </div>

          {/* MOBILE & SMALL SCREENS (< lg) */}
          <div className="block lg:hidden">
            <Link
              href={mainCategory.href}
              prefetch={false}
              className="w-full bg-[#E52E2D] rounded-2xl p-4 sm:p-5 flex flex-row items-center justify-between text-white overflow-hidden relative shadow-md group block"
            >
              <div className="flex-1 min-w-0 pr-3 z-10">
                <span className="bg-white/20 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1.5">
                  ★ KATEGORI UTAMA
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white group-hover:text-amber-200 transition-colors">
                  {mainCategory.name}
                </h3>
                <p className="text-xs text-red-100/90 mt-1 line-clamp-1">
                  {mainCategory.desc}
                </p>
                <div className="bg-white text-[#E52E2D] font-bold px-3.5 py-1.5 rounded-xl text-xs inline-flex items-center gap-1 mt-3 shadow-xs">
                  <span>Jelajahi Kategori</span>
                  <ChevronRight size={13} strokeWidth={3} />
                </div>
              </div>

              {/* Peeking 2 Book Covers */}
              <div className="flex items-center -space-x-4 shrink-0 z-10">
                <div className="relative w-14 sm:w-18 aspect-[3/4] transform -rotate-6 filter drop-shadow-[-8px_12px_14px_rgba(0,0,0,0.35)]">
                  <Image
                    src={mainCategory.covers[0]}
                    alt={`${mainCategory.name} Cover 1`}
                    fill
                    sizes="72px"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
                <div className="relative w-14 sm:w-18 aspect-[3/4] transform rotate-3 filter drop-shadow-[-8px_12px_14px_rgba(0,0,0,0.35)]">
                  <Image
                    src={mainCategory.covers[1]}
                    alt={`${mainCategory.name} Cover 2`}
                    fill
                    sizes="72px"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>

            {/* Compact Mobile Category Grid (4 Cards) */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    prefetch={false}
                    className="bg-white border border-gray-200/80 rounded-xl p-3 flex items-center gap-2.5 shadow-2xs active:scale-98 transition-transform group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${cat.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-serif font-bold text-xs text-[#272522] group-hover:text-[#E52E2D] transition-colors truncate">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* DESKTOP ASYMMETRICAL BENTO GRID (lg: Breakpoint) */}
          <div className="hidden lg:grid grid-cols-12 gap-5 items-stretch mt-2">
            
            {/* A. Left Main Featured Card (lg:col-span-5) */}
            <div className="col-span-5 h-full">
              <Link
                href={mainCategory.href}
                prefetch={false}
                className="bg-gradient-to-br from-[#E52E2D] to-[#C12A26] rounded-3xl p-7 text-white relative flex flex-col justify-between overflow-hidden shadow-lg min-h-[420px] h-full group border border-red-500/30 block"
              >
                <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_70%)]" />

                <div className="flex flex-row justify-between items-stretch h-full z-20 relative">
                  {/* Left: Text Details */}
                  <div className="max-w-[55%] z-20 flex flex-col justify-between h-full">
                    <div>
                      <span className="bg-white/20 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full uppercase w-fit inline-flex items-center gap-1">
                        ★ KATEGORI UTAMA
                      </span>
                      <h3 className="text-3xl xl:text-4xl font-serif font-black leading-tight mt-3 text-white group-hover:text-amber-200 transition-colors">
                        {mainCategory.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed mt-2 line-clamp-3">
                        {mainCategory.desc}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="bg-white hover:bg-gray-100 text-[#E52E2D] font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 w-fit transition-all shadow-sm group-hover:shadow-md">
                        <span>Jelajahi Kategori</span>
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                  {/* Dedicated Fanned 3-Book Deck Container */}
                  <div className="relative h-56 sm:h-64 w-44 sm:w-52 ml-auto mt-auto flex items-end justify-end pointer-events-auto z-10">
                    {/* Book 1 (Back / Leftmost) */}
                    <div className="absolute bottom-2 right-16 sm:right-20 w-28 sm:w-32 aspect-[3/4] -rotate-12 z-10 transition-transform duration-300 origin-bottom-left hover:-translate-y-2 hover:-rotate-16 filter drop-shadow-[-8px_12px_14px_rgba(0,0,0,0.35)]">
                      <Image
                        src={mainCategory.covers[0]}
                        alt={`${mainCategory.name} Cover 1`}
                        fill
                        sizes="128px"
                        loading="lazy"
                        className="object-contain"
                      />
                    </div>

                    {/* Book 2 (Middle) */}
                    <div className="absolute bottom-1 right-8 sm:right-10 w-28 sm:w-32 aspect-[3/4] -rotate-2 z-20 transition-transform duration-300 origin-bottom hover:-translate-y-3 filter drop-shadow-[-8px_12px_14px_rgba(0,0,0,0.35)]">
                      <Image
                        src={mainCategory.covers[1]}
                        alt={`${mainCategory.name} Cover 2`}
                        fill
                        sizes="128px"
                        loading="lazy"
                        className="object-contain"
                      />
                    </div>

                    {/* Book 3 (Front / Rightmost) */}
                    <div className="absolute bottom-0 right-0 w-28 sm:w-32 aspect-[3/4] rotate-8 z-30 transition-transform duration-300 origin-bottom-right hover:-translate-y-2 hover:rotate-12 filter drop-shadow-[-8px_12px_14px_rgba(0,0,0,0.35)]">
                      <Image
                        src={mainCategory.covers[2]}
                        alt={`${mainCategory.name} Cover 3`}
                        fill
                        sizes="128px"
                        loading="lazy"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* B. Right Category Bento Grid (lg:col-span-7) — 2x2 Grid */}
            <div className="col-span-7 grid grid-cols-2 gap-4 h-full">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    prefetch={false}
                    className={`${cat.bg} border rounded-2xl flex flex-row items-center justify-between p-5 h-full overflow-hidden hover:shadow-md transition-all group relative min-h-[195px]`}
                  >
                    {/* Left: Category Icon, Title, and Link */}
                    <div className="flex flex-col justify-between h-full z-10 flex-1 min-w-0 pr-2">
                      <div className={`w-10 h-10 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 shadow-2xs mb-3`}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>
                      
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#272522] group-hover:text-[#E52E2D] transition-colors leading-snug">
                          {cat.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#E52E2D] mt-2 group-hover:translate-x-1 transition-transform">
                          <span>Jelajahi</span>
                          <ChevronRight size={13} strokeWidth={3} />
                        </span>
                      </div>
                    </div>

                    {/* Right: Display 2 Overlapping Mini Book Covers */}
                    <div className="relative w-28 h-24 flex items-center justify-end flex-shrink-0 z-10">
                      {/* Book 1 (back) */}
                      {cat.covers[0] && (
                        <div className="absolute right-6 w-14 aspect-[3/4] rotate-[-6deg] filter drop-shadow-[-4px_6px_8px_rgba(0,0,0,0.18)]">
                          <Image
                            src={cat.covers[0]}
                            alt={`${cat.name} Cover 1`}
                            fill
                            sizes="60px"
                            loading="lazy"
                            className="object-contain"
                          />
                        </div>
                      )}
                      {/* Book 2 (front) */}
                      {cat.covers[1] && (
                        <div className="absolute right-0 w-15 aspect-[3/4] rotate-[4deg] hover:rotate-0 transition-transform filter drop-shadow-[-4px_6px_8px_rgba(0,0,0,0.18)]">
                          <Image
                            src={cat.covers[1]}
                            alt={`${cat.name} Cover 2`}
                            fill
                            sizes="60px"
                            loading="lazy"
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}