"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Send,
  MessageCircle,
  ListOrdered,
  FileCheck,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { submitManuscript } from "@/lib/api";
import { supabase } from "@/lib/supabase";

const GENRE_OPTIONS = [
  "Agama & Filsafat",
  "Fiksi & Sastra",
  "Buku Anak",
  "Pengembangan Diri",
  "Lain-lain",
];

interface ManuscriptStep {
  step_number?: number | string;
  title: string;
  description: string;
}

const DEFAULT_MANUSCRIPT_STEPS: ManuscriptStep[] = [
  {
    step_number: 1,
    title: "Step 1: Kirim berkas & sinopsis lengkap",
    description:
      "Lengkapi formulir pengiriman beserta berkas naskah lengkap (PDF/DOCX) dan sinopsis komprehensif.",
  },
  {
    step_number: 2,
    title: "Step 2: Kurasi substansi & orisinalitas oleh tim redaksi",
    description:
      "Tim redaksi akan melakukan peninjauan substansi dan keaslian karya (estimasi 14–30 hari kerja).",
  },
  {
    step_number: 3,
    title: "Step 3: Pemberitahuan kelayakan terbit via Email / WhatsApp resmi",
    description:
      "Pemberitahuan hasil peninjauan dan status kelayakan terbit akan dikirimkan secara resmi.",
  },
];

const DEFAULT_MANUSCRIPT_CRITERIA: string[] = [
  "Naskah orisinal (bukan plagiasi)",
  "Format rapi (A4, 1.5 spasi, Font standar)",
  "Menyertakan daftar isi dan bab pembuka",
];

const DEFAULT_MANUSCRIPT_CONTACT_DESC: string =
  "Punya pertanyaan seputar syarat penerbitan naskah? Hubungi langsung meja redaksi kami melalui WhatsApp resmi.";

const DEFAULT_CONTACT_WHATSAPP = "6285100007692";

export default function KirimNaskah() {
  const [senderName, setSenderName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Agama & Filsafat");
  const [synopsis, setSynopsis] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dynamic Right-Column Content States with Fallback Defaults (prevents hydration mismatch)
  const [manuscriptSteps, setManuscriptSteps] = useState<ManuscriptStep[]>(DEFAULT_MANUSCRIPT_STEPS);
  const [manuscriptCriteria, setManuscriptCriteria] = useState<string[]>(DEFAULT_MANUSCRIPT_CRITERIA);
  const [manuscriptContactDesc, setManuscriptContactDesc] = useState<string>(DEFAULT_MANUSCRIPT_CONTACT_DESC);
  const [manuscriptWhatsapp, setManuscriptWhatsapp] = useState<string>(DEFAULT_CONTACT_WHATSAPP);

  // Fetch dynamic manuscript settings from Supabase site_settings (id = 'default')
  useEffect(() => {
    async function fetchManuscriptSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select(
            "manuscript_steps, manuscript_criteria, manuscript_contact_desc, manuscript_whatsapp, contact_whatsapp, contact_phone"
          )
          .eq("id", "default")
          .maybeSingle();

        if (!error && data) {
          // 1. manuscript_steps
          if (data.manuscript_steps) {
            let rawSteps = data.manuscript_steps;
            if (typeof rawSteps === "string") {
              try {
                rawSteps = JSON.parse(rawSteps);
              } catch (e) {
                console.warn("Failed to parse manuscript_steps JSON string:", e);
              }
            }
            if (Array.isArray(rawSteps) && rawSteps.length > 0) {
              const parsedSteps: ManuscriptStep[] = rawSteps.map((item: any, idx: number) => {
                if (typeof item === "string") {
                  return {
                    step_number: idx + 1,
                    title: item,
                    description: "",
                  };
                }
                return {
                  step_number: item.step_number || item.stepNumber || idx + 1,
                  title: item.title || item.name || `Langkah ${idx + 1}`,
                  description: item.description || item.desc || "",
                };
              });
              setManuscriptSteps(parsedSteps);
            }
          }

          // 2. manuscript_criteria
          if (data.manuscript_criteria) {
            let rawCriteria = data.manuscript_criteria;
            if (typeof rawCriteria === "string") {
              try {
                rawCriteria = JSON.parse(rawCriteria);
              } catch (e) {
                console.warn("Failed to parse manuscript_criteria JSON string:", e);
              }
            }
            if (Array.isArray(rawCriteria) && rawCriteria.length > 0) {
              setManuscriptCriteria(rawCriteria.map((c: any) => String(c)));
            }
          }

          // 3. manuscript_contact_desc
          if (
            data.manuscript_contact_desc &&
            typeof data.manuscript_contact_desc === "string" &&
            data.manuscript_contact_desc.trim()
          ) {
            setManuscriptContactDesc(data.manuscript_contact_desc.trim());
          }

          // 4. manuscript_whatsapp
          const rawWa = data.manuscript_whatsapp || data.contact_whatsapp || data.contact_phone;
          if (rawWa && typeof rawWa === "string" && rawWa.trim()) {
            setManuscriptWhatsapp(rawWa.trim());
          }
        }
      } catch (err) {
        console.error("Error fetching manuscript settings for right column:", err);
      }
    }
    fetchManuscriptSettings();
  }, []);

  // Clean WhatsApp phone number (strip symbols, format international number)
  const rawWaNumber = manuscriptWhatsapp || DEFAULT_CONTACT_WHATSAPP;
  let cleanWaNumber = rawWaNumber.replace(/\D/g, "");
  if (cleanWaNumber.startsWith("0")) {
    cleanWaNumber = "62" + cleanWaNumber.slice(1);
  }
  if (!cleanWaNumber) {
    cleanWaNumber = DEFAULT_CONTACT_WHATSAPP;
  }

  const handleFileValidation = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Allowed extensions: PDF, DOCX, DOC
    const allowedExtensions = [".pdf", ".docx", ".doc"];
    const fileNameLower = selectedFile.name.toLowerCase();
    const isValidExt = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValidExt) {
      setErrorMsg("Format file harus berupa PDF atau DOCX.");
      return;
    }

    // Size limit: 10MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran file naskah maksimal 10MB.");
      return;
    }

    setErrorMsg("");
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderName.trim()) {
      setErrorMsg("Silakan masukkan Nama Lengkap Anda.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Silakan masukkan alamat Email yang valid.");
      return;
    }

    if (!whatsapp.trim()) {
      setErrorMsg("Silakan masukkan Nomor WhatsApp Anda.");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Silakan masukkan Judul Naskah.");
      return;
    }

    if (!synopsis.trim()) {
      setErrorMsg("Silakan isi Sinopsis / Ringkasan Naskah.");
      return;
    }

    if (!file) {
      setErrorMsg("Silakan unggah file naskah Anda (PDF / DOCX).");
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await submitManuscript(
        {
          senderName: senderName.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          title: title.trim(),
          genre,
          synopsis: synopsis.trim(),
        },
        file
      );

      setSuccessMsg("Naskah berhasil dikirim! Tim redaksi Pustaka Iman akan meninjau submission Anda.");
      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("Gagal mengirim naskah:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim naskah. Silakan coba lagi.";
      setErrorMsg(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSenderName("");
    setEmail("");
    setWhatsapp("");
    setTitle("");
    setGenre("Agama & Filsafat");
    setSynopsis("");
    setFile(null);
    setShowSuccessModal(false);
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 text-[#272522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-[#dc2626] hover:text-[#dc2626] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header Banner Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-[#dc2626] uppercase tracking-wider">
            <Sparkles size={13} className="text-[#dc2626]" />
            Penerbitan Karya & Naskah
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272522] tracking-tight">
            Kirim <span className="text-[#dc2626] italic font-serif">Naskah Anda</span>
          </h1>
          <p className="text-sm sm:text-base text-[#76716A] max-w-3xl leading-relaxed">
            Kirimkan karya atau naskah ilmiah Anda untuk ditinjau oleh tim redaksi Pustaka Iman. Kami menyambut penulis berbakat yang ingin menginspirasi pembaca melalui karya bermakna.
          </p>
        </div>

        {/* 2-Column Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Form Submission - ~60%) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Formulir Pengiriman Naskah
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Isi informasi penulis dan naskah secara lengkap di bawah ini.
                </p>
              </div>

              {/* Success Alert */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Alert Banner */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-3 animate-in fade-in">
                  <AlertCircle size={18} className="text-[#dc2626] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block mb-0.5">Perhatian</span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Nama Lengkap (Required) */}
                <div>
                  <label htmlFor="senderName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    name="senderName"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all"
                  />
                </div>

                {/* 2. Alamat Email & Nomor WhatsApp (2-column row, Required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Alamat Email <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Judul Naskah & Genre/Kategori Naskah */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Judul Naskah <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul naskah Anda"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="genre" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Genre / Kategori Naskah <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all cursor-pointer"
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Sinopsis / Ringkasan Naskah (Textarea, min 4 rows) */}
                <div>
                  <label htmlFor="synopsis" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Sinopsis / Ringkasan Naskah <span className="text-[#dc2626]">*</span>
                  </label>
                  <textarea
                    id="synopsis"
                    name="synopsis"
                    rows={4}
                    required
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Tuliskan ringkasan atau sinopsis singkat mengenai isi, latar belakang, dan keunggulan naskah Anda..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#dc2626] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20 transition-all resize-y min-h-[100px]"
                  />
                </div>

                {/* 5. Dropzone Upload File Naskah (PDF/DOCX maks 10MB) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Unggah File Naskah (PDF / DOCX) <span className="text-[#dc2626]">*</span>
                  </label>
                  
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                      isDragOver
                        ? "border-[#dc2626] bg-red-50/80 scale-[1.01]"
                        : file
                        ? "border-emerald-400 bg-emerald-50/40"
                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileValidation(e.target.files[0]);
                        }
                      }}
                    />

                    {file ? (
                      <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="text-left truncate">
                            <h5 className="text-xs font-bold text-gray-900 truncate">
                              {file.name}
                            </h5>
                            <p className="text-[11px] text-emerald-600 font-semibold">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB • Berkas Terlampir ✓
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#dc2626] rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto shadow-2xs">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Klik atau Seret Berkas Naskah ke Sini
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Format file PDF atau DOCX (Maksimal 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Primary CTA: 'Kirim Naskah Sekarang' */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Mengirimkan Naskah...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Kirim Naskah Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

          {/* Right Column (Sidebar Panduan Redaksi - Dinamis dari site_settings) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Alur & Panduan Pengiriman Naskah */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#dc2626] uppercase tracking-wider border-b border-gray-100 pb-3">
                <ListOrdered size={16} />
                <span>Alur & Panduan Pengiriman Naskah</span>
              </div>
              
              <div className="space-y-4 pt-1">
                {manuscriptSteps.map((st, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-50 text-[#dc2626] font-bold text-xs flex items-center justify-center shrink-0 border border-red-100">
                      {st.step_number || idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-gray-900">{st.title}</h4>
                      {st.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {st.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Kriteria Naskah */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
                <FileCheck size={16} className="text-[#dc2626]" />
                <span>Kriteria Naskah</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                {manuscriptCriteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#dc2626] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Pertanyaan Redaksi? */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <HelpCircle size={16} className="text-emerald-700" />
                <span>Pertanyaan Redaksi?</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {manuscriptContactDesc}
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Halo%20Redaksi%20Pustaka%20Iman,%20saya%20ingin%20bertanya%20mengenai%20pengiriman%20naskah...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <MessageCircle size={16} fill="currentColor" />
                  <span>Chat Redaksi via WhatsApp &rarr;</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation / Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Submission Berhasil
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 pt-2">
                Naskah Terkirim!
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Terima kasih, <strong className="text-gray-900">{senderName}</strong>. Naskah Anda berjudul <strong className="text-gray-900">"{title}"</strong> telah berhasil kami terima.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Genre/Kategori:</span>
                <strong className="text-gray-900">{genre}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Berkas Naskah:</span>
                <strong className="text-gray-900 truncate max-w-[180px]">{file?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimasi Kurasi:</span>
                <span className="font-bold text-emerald-700">14–30 Hari Kerja</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              Hasil evaluasi akan kami infokan secara berkala melalui Email ({email}) dan WhatsApp ({whatsapp}).
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 py-2.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Kirim Naskah Lain
              </button>
              <Link
                href="/"
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors uppercase tracking-wider text-center"
              >
                Kembali Beranda
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
