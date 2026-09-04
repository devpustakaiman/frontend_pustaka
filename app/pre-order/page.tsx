"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkle,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  Truck,
  Gift,
  X,
  Loader2,
  FileText,
  Building2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { submitPreorder } from "@/lib/api";
import { Book, formatBookPrice } from "@/lib/utils";

interface BankAccount {
  bank_name?: string;
  bankName?: string;
  account_number?: string;
  accountNumber?: string;
  account_holder?: string;
  accountHolder?: string;
}

const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    bank_name: "BCA (Bank Central Asia)",
    account_number: "8830918237",
    account_holder: "PT Pustaka Iman Utama",
  },
  {
    bank_name: "Bank Mandiri",
    account_number: "1270098765432",
    account_holder: "PT Pustaka Iman Utama",
  },
];

export default function PreOrderPage() {
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");

  // File Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Catalog Books State
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Dynamic Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(DEFAULT_BANK_ACCOUNTS);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  // Copy Feedback State
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  // Fetch dynamic bank accounts from Supabase site_settings
  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("bank_accounts")
          .eq("id", "default")
          .maybeSingle();

        if (!error && data && Array.isArray(data.bank_accounts) && data.bank_accounts.length > 0) {
          setBankAccounts(data.bank_accounts);
        }
      } catch (err) {
        console.error("Error fetching bank accounts from site_settings:", err);
      } finally {
        setIsLoadingBankAccounts(false);
      }
    }
    fetchBankAccounts();
  }, []);

  // Fetch available books from Supabase for book selector dropdown
  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .is("deleted_at", null)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setAvailableBooks(data);
          // Default to first book if available
          if (data.length > 0) {
            setSelectedBook(data[0]);
            setBookTitle(data[0].title);
          }
        }
      } catch (err) {
        console.error("Error fetching books for preorder selector:", err);
      } finally {
        setIsLoadingBooks(false);
      }
    }
    fetchBooks();
  }, []);

  // Handle Book Selection Change
  const handleBookSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setSelectedBook(null);
      setBookTitle("");
    } else {
      const found = availableBooks.find((b) => String(b.id) === val);
      if (found) {
        setSelectedBook(found);
        setBookTitle(found.title);
      }
    }
  };

  // Drag and Drop File Handlers
  const handleFileChange = (file: File | null) => {
    if (!file) {
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran file bukti transfer maksimal 10MB.");
      return;
    }

    setErrorMessage(null);
    setReceiptFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
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

  // Copy Account Number Helper
  const handleCopyAccount = (accNum: string, index: number) => {
    navigator.clipboard.writeText(accNum);
    setCopiedBankIndex(index);
    setTimeout(() => setCopiedBankIndex(null), 2000);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!customerName.trim()) {
      setErrorMessage("Mohon lengkapi Nama Lengkap Anda.");
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      setErrorMessage("Mohon masukkan alamat Email yang valid.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage("Mohon masukkan Nomor WhatsApp yang aktif.");
      return;
    }
    if (!bookTitle.trim()) {
      setErrorMessage("Mohon pilih atau tuliskan Judul Buku yang dipesan.");
      return;
    }
    if (quantity < 1) {
      setErrorMessage("Jumlah pemesanan minimal 1 eksemplar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitPreorder(
        {
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          customer_phone: customerPhone.trim(),
          book_title: bookTitle.trim(),
          quantity,
          notes: notes.trim(),
        },
        receiptFile
      );

      if (result.success) {
        // Trigger email notification dispatch to /api/preorder/notify (non-blocking)
        fetch("/api/preorder/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim(),
            customer_phone: customerPhone.trim(),
            book_title: bookTitle.trim(),
            quantity,
            transfer_receipt: (result.data as any)?.[0]?.transfer_receipt || null,
          }),
        }).catch((notifyErr) => {
          console.warn("Background preorder notification dispatch warning:", notifyErr);
        });

        setSubmittedOrder({
          customerName,
          customerEmail,
          customerPhone,
          bookTitle,
          quantity,
          selectedBook,
          hasReceipt: !!receiptFile,
          orderId: `PO-${Date.now().toString().slice(-6)}`,
        });
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Pre-order submission error:", err);
      setErrorMessage(
        err.message || "Gagal mengirimkan formulir Pre-Order. Mohon coba beberapa saat lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#272522] bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-[#E52E2D] hover:text-[#E52E2D] shadow-2xs transition-all duration-200"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-[#E52E2D] uppercase tracking-wider">
              <Sparkle size={13} className="fill-[#E52E2D]" />
              Formulir Pre-Order Resmi
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#272522] tracking-tight">
              Pre-Order Buku <span className="text-[#C12A26] italic font-serif">Pustaka Iman</span>
            </h1>
            <p className="text-sm sm:text-base text-[#76716A] leading-relaxed">
              Amankan cetakan edisi pertama dengan penawaran spesial. Isi data diri dan bukti transfer Anda di bawah ini, tim kami akan memproses pesanan dan mengonfirmasinya melalui WhatsApp & Email.
            </p>
          </div>

          {/* Key Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#E52E2D] border border-gray-100 shadow-2xs shrink-0">
                <Gift size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Harga Spesial Promo</h4>
                <p className="text-[11px] text-gray-500">Hemat hingga 20% edisi awal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#E52E2D] border border-gray-100 shadow-2xs shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Prioritas Pengiriman</h4>
                <p className="text-[11px] text-gray-500">Dikirim langsung di hari cetak</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200/60">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#E52E2D] border border-gray-100 shadow-2xs shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Jaminan Asli & Garansi</h4>
                <p className="text-[11px] text-gray-500">100% Terbitan Pustaka Iman</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Form + Payment Bank Info Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Pre-Order Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Data Pemesan & Transfer
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Lengkapi seluruh kolom di bawah ini secara akurat.
                </p>
              </div>

              {/* Error Alert Banner */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-800 animate-in fade-in">
                  <AlertCircle size={18} className="text-[#E52E2D] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block">Perhatian</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Nama Lengkap */}
                <div>
                  <label htmlFor="customer_name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-[#E52E2D]">*</span>
                  </label>
                  <input
                    id="customer_name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Ahmad Hidayat"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                  />
                </div>

                {/* 2. Email & WhatsApp Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customer_email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Alamat Email <span className="text-[#E52E2D]">*</span>
                    </label>
                    <input
                      id="customer_email"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer_phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp <span className="text-[#E52E2D]">*</span>
                    </label>
                    <input
                      id="customer_phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Judul Buku (Dropdown Selector + Manual Text Option) */}
                <div>
                  <label htmlFor="book_select" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Pilih Judul Buku Pre-Order <span className="text-[#E52E2D]">*</span>
                  </label>
                  
                  {isLoadingBooks ? (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 size={14} className="animate-spin text-[#E52E2D]" />
                      <span>Memuat katalog buku...</span>
                    </div>
                  ) : (
                    <select
                      id="book_select"
                      value={selectedBook ? String(selectedBook.id) : "custom"}
                      onChange={handleBookSelectChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all mb-2"
                    >
                      {availableBooks.map((b) => (
                        <option key={b.id} value={String(b.id)}>
                          {b.title} {b.promo_price ? `(Rp${Number(b.promo_price).toLocaleString("id-ID")})` : b.price ? `(Rp${Number(b.price).toLocaleString("id-ID")})` : ""}
                        </option>
                      ))}
                      <option value="custom">-- Judul Buku Lainnya (Tulis Manual) --</option>
                    </select>
                  )}

                  {/* Manual Title Input if custom is chosen or no books exist */}
                  {(!selectedBook || availableBooks.length === 0) && (
                    <input
                      id="book_title"
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="Tuliskan judul buku yang diinginkan..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all mt-1"
                    />
                  )}
                </div>

                {/* 4. Kuantiti / Jumlah Buku */}
                <div>
                  <label htmlFor="quantity" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Jumlah Eksemplar / Kuantiti <span className="text-[#E52E2D]">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 text-center bg-gray-50 border border-gray-200 focus:border-[#E52E2D] rounded-xl text-sm font-bold text-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors active:scale-95"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-500 font-medium">Buku</span>
                  </div>
                </div>

                {/* 5. Catatan Tambahan (Optional) */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Catatan Tambahan <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Permintaan tanda tangan penulis, ucapan hadiah, dll."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#E52E2D] focus:bg-white rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E52E2D]/20 transition-all"
                  />
                </div>

                {/* 6. Drag & Drop Upload Zone for Transfer Receipt */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Lampiran Bukti Transfer <span className="text-gray-400 font-normal">(Opsional / Bisa Menyusul)</span>
                  </label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                      isDragOver
                        ? "border-[#E52E2D] bg-red-50/80 scale-[1.01]"
                        : receiptFile
                        ? "border-emerald-400 bg-emerald-50/40"
                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />

                    {receiptFile ? (
                      <div className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {receiptPreview ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={receiptPreview}
                              alt="Bukti Transfer"
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <FileText size={20} />
                            </div>
                          )}
                          <div className="text-left truncate">
                            <h5 className="text-xs font-bold text-gray-900 truncate">
                              {receiptFile.name}
                            </h5>
                            <p className="text-[10px] text-emerald-600 font-semibold">
                              {(receiptFile.size / 1024).toFixed(1)} KB • Bukti Terlampir ✓
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileChange(null);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-[#E52E2D] flex items-center justify-center mx-auto shadow-2xs">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Klik atau Seret Bukti Transfer ke Sini
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Format gambar JPG, PNG, WEBP atau PDF (Maks. 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#E52E2D] hover:bg-[#C12A26] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Mengirimkan Pesanan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Kirim Pre-Order Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

          {/* Right Column: Payment Info & Bank Account Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Bank Transfer Info Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E52E2D] uppercase tracking-wider">
                <Building2 size={16} />
                <span>Instruksi Pembayaran Transfer Bank</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                Rekening Resmi Pustaka Iman
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Silakan lakukan transfer sesuai total pemesanan ke salah satu nomor rekening bank resmi terverifikasi berikut:
              </p>

              <div className="space-y-3 pt-2">
                {bankAccounts.map((acc, idx) => {
                  const bankName = acc.bank_name || acc.bankName || "Bank";
                  const accountNumber = acc.account_number || acc.accountNumber || "";
                  const accountHolder = acc.account_holder || acc.accountHolder || "-";
                  const isCopied = copiedBankIndex === idx;

                  return (
                    <div
                      key={accountNumber ? `${accountNumber}-${idx}` : idx}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 hover:border-[#E52E2D] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{bankName}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(accountNumber, idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E52E2D] hover:bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="font-mono text-base font-black text-[#272522] tracking-wider">
                        {accountNumber}
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        a.n. <strong className="text-gray-800">{accountHolder}</strong>
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Estimate Card if book selected */}
              {selectedBook && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Ringkasan Estimasi Pesanan
                  </span>
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-gray-600">
                      <span>Buku:</span>
                      <strong className="text-gray-900 truncate max-w-[180px]">{selectedBook.title}</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Jumlah:</span>
                      <strong className="text-gray-900">{quantity} Eksemplar</strong>
                    </div>
                    {selectedBook.promo_price ? (
                      <div className="flex justify-between text-[#E52E2D] font-bold pt-1.5 border-t border-gray-200">
                        <span>Total Estimasi:</span>
                        <span>Rp{(Number(selectedBook.promo_price) * quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ) : selectedBook.price ? (
                      <div className="flex justify-between text-gray-900 font-bold pt-1.5 border-t border-gray-200">
                        <span>Total Estimasi:</span>
                        <span>Rp{(Number(selectedBook.price) * quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Setelah melakukan pembayaran, unggah foto/screenshot bukti transfer pada formulir agar pesanan dapat langsung terkonfirmasi.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Confirmation / Success Dialog Modal */}
      {showSuccessModal && submittedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Pemesanan Berhasil Dikirim
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 pt-2">
                Terima Kasih, {submittedOrder.customerName}!
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Formulir Pre-Order Anda telah tersimpan dengan nomor referensi <strong className="text-gray-900 font-mono">{submittedOrder.orderId}</strong>.
              </p>
            </div>

            {/* Submitted Order Details Table */}
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Judul Buku:</span>
                <strong className="text-gray-900 truncate max-w-[180px]">{submittedOrder.bookTitle}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Jumlah:</span>
                <strong className="text-gray-900">{submittedOrder.quantity} Eksemplar</strong>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">No. WhatsApp:</span>
                <strong className="text-gray-900">{submittedOrder.customerPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Pembayaran:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                  {submittedOrder.hasReceipt ? "Bukti Terunggah (Verifikasi)" : "Menunggu Pembayaran"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              Tim Pustaka Iman akan segera menghubungi WhatsApp Anda untuk konfirmasi nomor resi dan pengiriman.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href="/"
                className="flex-1 py-2.5 px-4 bg-[#E52E2D] hover:bg-[#C12A26] text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider shadow-sm"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/katalog"
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
              >
                Lihat Katalog
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
