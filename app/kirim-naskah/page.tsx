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
    <div className="bg-white text-[#272522] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-100 pb-6 text-center">
          <span className="text-xs uppercase tracking-wider font-bold text-[#E52E2D]">
            Penerbitan Karya
          </span>
          <h1 className="font-serif text-4xl font-bold text-[#272522] tracking-tight mt-1">
            Kirim <span className="text-[#C12A26] italic font-serif">Naskah Anda</span>
          </h1>
          <p className="text-[#76716A] text-sm mt-2">
            Kirimkan karya atau naskah ilmiah Anda untuk ditinjau oleh tim redaksi Pustaka Iman.
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-3xl p-6 sm:p-8 lg:p-10">
          {/* Feedback Alerts */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 text-[#E52E2D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Name Input */}
            <div>
              <label htmlFor="senderName" className="block text-xs font-bold uppercase tracking-wider text-[#272522] mb-2">
                Nama Lengkap <span className="text-[#E52E2D]">*</span>
              </label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:border-[#E52E2D] focus:ring-2 focus:ring-[#E52E2D]/20 transition-all text-sm"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#272522] mb-2">
                Alamat Email <span className="text-[#E52E2D]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:border-[#E52E2D] focus:ring-2 focus:ring-[#E52E2D]/20 transition-all text-sm"
              />
            </div>

            {/* Synopsis Input */}
            <div>
              <label htmlFor="synopsis" className="block text-xs font-bold uppercase tracking-wider text-[#272522] mb-2">
                Sinopsis Naskah <span className="text-[#E52E2D]">*</span>
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                rows={4}
                required
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Tuliskan ringkasan atau sinopsis singkat mengenai naskah Anda..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[#272522] placeholder-[#76716A]/60 focus:outline-none focus:border-[#E52E2D] focus:ring-2 focus:ring-[#E52E2D]/20 transition-all resize-none text-sm"
              />
            </div>

            {/* File Upload (PDF) */}
            <div>
              <label htmlFor="file" className="block text-xs font-bold uppercase tracking-wider text-[#272522] mb-2">
                Unggah File Naskah (PDF) <span className="text-[#E52E2D]">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-red-50/40 hover:border-[#E52E2D] transition-all"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-[#E52E2D]"
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
                    <p className="mb-1 text-sm text-[#272522] font-semibold">
                      {file ? file.name : "Klik untuk mengunggah file PDF"}
                    </p>
                    <p className="text-xs text-[#76716A]">
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
                className="w-full py-3.5 px-6 rounded-xl bg-[#E52E2D] hover:bg-[#C12A26] disabled:bg-[#E52E2D]/50 disabled:cursor-not-allowed font-bold text-white shadow-md transition-all text-center cursor-pointer uppercase tracking-wider text-xs active:scale-95"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Naskah Sekarang"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
