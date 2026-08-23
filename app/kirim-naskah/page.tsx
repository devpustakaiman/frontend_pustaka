"use client";

import { useState } from "react";
import { submitManuscript } from "@/lib/api";

export default function KirimNaskah() {
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setErrorMsg("Silakan unggah file PDF naskah Anda.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await submitManuscript(
        {
          senderName,
          email,
          synopsis,
        },
        file
      );

      setSuccessMsg("Naskah berhasil dikirim! Tim redaksi kami akan meninjau submission Anda.");
      setSenderName("");
      setEmail("");
      setSynopsis("");
      setFile(null);
    } catch (err: unknown) {
      console.error("Gagal mengirim naskah:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim naskah. Silakan coba lagi.";
      setErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen py-12 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-800 pb-6 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Kirim Naskah
          </h1>
          <p className="text-slate-400 mt-2">
            Kirimkan karya atau naskah ilmiah Anda untuk ditinjau oleh tim redaksi Pustaka Iman.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Feedback Alerts */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-300 text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Name Input */}
            <div>
              <label htmlFor="senderName" className="block text-sm font-medium text-slate-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Tuliskan ringkasan atau sinopsis singkat mengenai naskah Anda..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* File Upload (PDF) */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-slate-300 mb-2">
                Unggah File Naskah (PDF)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
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
                      {file ? file.name : "Klik untuk mengunggah file PDF"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Format file: PDF (Maksimal 10MB)"}
                    </p>
                  </div>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed font-bold text-white shadow-lg shadow-emerald-600/30 transition-all text-center cursor-pointer"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Naskah"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
