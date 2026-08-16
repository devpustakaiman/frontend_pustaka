const dummyNews = [
  {
    id: 1,
    date: "15 Agustus 2026",
    title: "Penerimaan Naskah Gelombang II Resmi Dibuka",
    summary:
      "Pustaka Ilman membuka kembali kesempatan bagi para penulis dan akademisi untuk menerbitkan karya terbaiknya.",
  },
  {
    id: 2,
    date: "01 Agustus 2026",
    title: "Peluncuran Seri Buku Sains Terapan & Kebijakan",
    summary:
      "Peluncuran resmi 5 seri buku ilmiah yang bekerja sama dengan peneliti utama dari berbagai institusi.",
  },
  {
    id: 3,
    date: "20 Juli 2026",
    title: "Bazar Buku Digital & Diskon Spesial Kemerdekaan",
    summary:
      "Dapatkan potongan harga hingga 30% untuk pembelian seluruh produk pustaka pilihan.",
  },
];

export default function NewsTimeline() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Kabar & Pengumuman</h2>
          <p className="text-slate-400 mt-2">Informasi terbaru seputar penerbitan, agenda, dan kegiatan Pustaka Ilman.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-1/2 before:w-0.5 before:-ml-px before:bg-slate-800">
          {dummyNews.map((item, idx) => (
            <div
              key={item.id}
              className={`relative flex items-center justify-between md:justify-between flex-col ${
                idx % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
              }`}
            >
              <div className="flex items-center w-full sm:w-1/2">
                <div className={`w-full p-6 bg-slate-950 border border-slate-800 rounded-xl shadow-lg ${idx % 2 === 0 ? "sm:ml-6" : "sm:mr-6"}`}>
                  <span className="text-xs font-semibold text-emerald-400">{item.date}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-2">{item.summary}</p>
                </div>
              </div>
              <div className="absolute left-3 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
