import Link from "next/link";
import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { parseRichTextToPlainText, formatIndonesianDate } from "@/lib/utils";

export interface Article {
  id: string | number;
  title: string;
  date?: string;
  created_at?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  image_url?: string;
  category?: string;
}

interface NewsGridProps {
  articles?: Article[];
}

export default function NewsGrid({ articles = [] }: NewsGridProps) {
  return (
    <section className="w-full bg-white py-12 md:py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Kabar Terkini"
          title={
            <>
              Warta & <span className="text-[#C12A26] italic font-serif">Pengumuman</span>
            </>
          }
          href="/warta"
          linkLabel="Lihat Semua Warta"
        />

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 max-w-2xl mx-auto shadow-sm">
            <p className="text-[#76716A] text-sm font-medium">Belum ada warta atau pengumuman saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((item) => {
              const rawDate = item.created_at || item.date;
              const displayDate = formatIndonesianDate(rawDate);

              const rawContent = item.content || item.summary || "";
              const cleanExcerpt = parseRichTextToPlainText(rawContent);
              const imgUrl = item.imageUrl || item.image_url;

              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#FCA5A5] hover:ring-2 hover:ring-red-100 hover:shadow-xl transition-all overflow-hidden flex flex-col"
                >
                  {/* Thumbnail */}
                  <Link href={`/warta/${item.id}`} className="block overflow-hidden bg-gray-50 aspect-video relative">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="aspect-video w-full rounded-t-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border-b border-gray-100">
                        <span className="font-serif font-bold text-2xl text-[#E52E2D]">
                          Pustaka Iman
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content Area */}
                  <div className="bg-white p-5 rounded-b-2xl flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-xs text-[#E52E2D] uppercase font-bold tracking-wider mb-2 block">
                        {item.category || displayDate}
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#272522] line-clamp-2 mb-2 group-hover:text-[#E52E2D] transition-colors leading-snug">
                        <Link href={`/warta/${item.id}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#76716A] line-clamp-2 leading-relaxed">
                        {cleanExcerpt || "Baca selengkapnya mengenai kabar dan informasi penerbitan Pustaka Iman."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-[#76716A] font-medium">{displayDate}</span>
                      <Link
                        href={`/warta/${item.id}`}
                        className="text-xs font-bold text-[#E52E2D] hover:text-[#C12A26] flex items-center gap-1 group-hover:underline"
                      >
                        <span>Baca Selengkapnya</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
