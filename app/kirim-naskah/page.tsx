export default function KirimNaskahPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-12 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-800 pb-6 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Kirim Naskah
          </h1>
          <p className="text-slate-400 mt-2">
            Kirimkan karya atau naskah ilmiah Anda untuk ditinjau oleh tim redaksi Pustaka Ilman.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form className="space-y-6">
            {/* Nama Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Synopsis Input */}
            <div>
              <label htmlFor="synopsis" className="block text-sm font-medium text-slate-300 mb-2">
                Sinopsis Naskah
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                rows={4}
                placeholder="Tuliskan ringkasan atau sinopsis singkat mengenai naskah Anda..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* File Upload (PDF) */}
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
                Unggah File Naskah (PDF)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-1 text-sm text-slate-300 font-medium">
                      Klik untuk mengunggah atau drag & drop
                    </p>
                    <p className="text-xs text-slate-500">Format file: PDF (Maksimal 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/30 transition-all text-center"
              >
                Kirim Naskah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
