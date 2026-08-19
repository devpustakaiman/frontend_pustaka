export interface Article {
  id: string | number;
  title: string;
  date?: string;
  created_at?: string;
  content?: string;
  summary?: string;
  imageUrl?: string;
  image_url?: string;
}

interface NewsTimelineProps {
  articles?: Article[];
}

export default function NewsTimeline({ articles = [] }: NewsTimelineProps) {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Kabar & Pengumuman</h2>
          <p className="text-slate-400 mt-2">
            Informasi terbaru seputar penerbitan, agenda, dan kegiatan Pustaka Iman.
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/60 rounded-xl border border-slate-800 max-w-2xl mx-auto">
            <p className="text-slate-400 font-medium">Belum ada berita atau pengumuman saat ini.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-1/2 before:w-0.5 before:-ml-px before:bg-slate-800">
            {articles.map((item, idx) => {
              const displayDate =
                item.date ||
                (item.created_at
                  ? new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "");
              const rawContent = item.content || item.summary || "";
              const snippet =
                rawContent.length > 150 ? rawContent.slice(0, 150) + "..." : rawContent;
              const imgUrl = item.imageUrl || item.image_url;

              return (
                <div
                  key={item.id}
                  className={`relative flex items-center justify-between md:justify-between flex-col ${
                    idx % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
                  }`}
                >
                  <div className="flex items-center w-full sm:w-1/2">
                    <div
                      className={`w-full p-6 bg-slate-950 border border-slate-800 rounded-xl shadow-lg ${
                        idx % 2 === 0 ? "sm:ml-6" : "sm:mr-6"
                      }`}
                    >
                      {imgUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={imgUrl}
                          alt={item.title}
                          className="w-full h-40 object-cover rounded-lg mb-3 border border-slate-800"
                        />
                      )}
                      {displayDate && (
                        <span className="text-xs font-semibold text-emerald-400">{displayDate}</span>
                      )}
                      <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                      {snippet && <p className="text-sm text-slate-400 mt-2">{snippet}</p>}
                    </div>
                  </div>
                  <div className="absolute left-3 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow-md" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
