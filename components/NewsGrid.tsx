import Link from "next/link";
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
    <section className="w-full bg-[#F7F4E9] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Kabar Terkini"
          title="Warta & Pengumuman"
          href="/warta"
          linkLabel="Lihat Semua Warta"
        />

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#EAE5D9] max-w-2xl mx-auto shadow-sm">
            <p className="text-[#7A7A7A] text-sm font-medium">Belum ada warta atau pengumuman saat ini.</p>
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
                  className="group bg-white rounded-xl border border-[#EAE5D9] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Thumbnail */}
                  <Link href={`/warta/${item.id}`} className="block overflow-hidden bg-[#FEFDF7]">
                    {imgUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgUrl}
                        alt={item.title}
                        className="aspect-video w-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="aspect-video w-full rounded-t-xl bg-gradient-to-br from-[#F7F4E9] to-[#FEFDF7] flex items-center justify-center border-b border-[#EAE5D9]">
                        <span className="font-serif font-bold text-2xl text-[#B67A2D]">
                          Pustaka Iman
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content Area */}
                  <div className="bg-white p-5 rounded-b-xl flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-xs text-[#B67A2D] uppercase font-bold tracking-wider mb-2 block">
                        {item.category || displayDate}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-[#272522] line-clamp-2 mb-2 group-hover:text-[#B67A2D] transition-colors leading-snug">
                        <Link href={`/warta/${item.id}`}>
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-[#7A7A7A] line-clamp-2 leading-relaxed">
                        {cleanExcerpt || "Baca selengkapnya mengenai kabar dan informasi penerbitan Pustaka Iman."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EAE5D9] flex items-center justify-between">
                      <span className="text-[11px] text-[#7A7A7A]">{displayDate}</span>
                      <Link
                        href={`/warta/${item.id}`}
                        className="text-xs font-bold text-[#B67A2D] group-hover:underline"
                      >
                        Baca Selengkapnya &rarr;
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
