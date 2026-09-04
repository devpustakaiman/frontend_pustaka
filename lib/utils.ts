export interface Book {
  id: string | number;
  title: string;
  author: string;
  category?: string;
  coverUrl?: string;
  cover_url?: string;
  price?: string | number;
  synopsis?: string;
  pdfPreviewUrl?: string;
  pdf_preview_url?: string;
  mizanstoreUrl?: string;
  mizanstore_url?: string;
  gallery_urls?: string[] | null;
  galleryUrls?: string[] | null;
  gallery_images?: string[] | null;
  galleryImages?: string[] | null;
  gallery_url_1?: string | null;
  gallery_url_2?: string | null;
  gallery_url_3?: string | null;
  gallery_url_4?: string | null;
  slug?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  // New marketing columns
  is_promo?: boolean;
  promo_price?: number | string | null;
  promo_percentage?: number | null;
  promo_start_date?: string | null;
  promo_start_at?: string | null;
  promo_end_date?: string | null;
  is_recommended?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
}

/**
 * Converts a selected date string (YYYY-MM-DD) to an end-of-day ISO string (23:59:59.999 WIB).
 * Ensures a promo set for a date (e.g. 04/09/2026) remains active until 23:59:59 WIB tonight.
 */
export function formatPromoEndDateToIso(selectedDate: string): string {
  if (!selectedDate) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    return new Date(`${selectedDate}T23:59:59.999+07:00`).toISOString();
  }
  const dateObj = new Date(selectedDate);
  if (isNaN(dateObj.getTime())) return selectedDate;
  dateObj.setHours(23, 59, 59, 999);
  return dateObj.toISOString();
}

/**
 * Formats date string to DD/MM/YY format.
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/**
 * Checks whether a book's promotion is currently active.
 * A promo is ONLY valid if:
 * 1. is_promo === true
 * 2. promo_end_date exists and is strictly greater than current local time (new Date()).
 * 
 * Note: promo_end_date is locked to 23:59:59.999 local time so promos don't expire prematurely at 00:00 UTC (7:00 AM local).
 */
export function isActivePromo(book?: Book | null): boolean {
  if (!book || !book.is_promo || !book.promo_end_date) {
    return false;
  }
  const endDate = new Date(book.promo_end_date);
  if (isNaN(endDate.getTime())) return false;
  return endDate.getTime() > Date.now();
}

/**
 * Calculates remaining days until promo_end_date.
 * Returns 0 if expired or invalid.
 */
export function getPromoDaysRemaining(promoEndDate?: string | null): number {
  if (!promoEndDate) return 0;
  const endDate = new Date(promoEndDate);
  if (isNaN(endDate.getTime())) return 0;

  const diffTime = endDate.getTime() - Date.now();
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export interface PromoCountdownDetails {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
  totalHours: number;
  isExpired: boolean;
  formattedTime: string;
}

/**
 * Calculates exact real-time countdown breakdown from backend promo_end_date timestamptz.
 */
export function getPromoCountdownDetails(promoEndDate?: string | null): PromoCountdownDetails {
  const now = new Date();
  let endDate: Date;
  
  if (promoEndDate) {
    endDate = new Date(promoEndDate);
    if (isNaN(endDate.getTime())) {
      endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    }
  } else {
    endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  }

  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      millis: 0,
      totalHours: 0,
      isExpired: true,
      formattedTime: "00 : 00 : 00",
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const millis = Math.floor((diff % 1000) / 10);
  const totalHours = Math.floor(diff / (1000 * 60 * 60));

  const pad = (n: number) => String(n).padStart(2, "0");
  
  const formattedTime = days > 0
    ? `0${days}D : ${pad(hours)}H : ${pad(minutes)}M`
    : `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;

  return {
    days,
    hours,
    minutes,
    seconds,
    millis,
    totalHours,
    isExpired: false,
    formattedTime,
  };
}




/**
 * Utility function to strip raw JSON (e.g. Quill rich text ops [{"insert":"tes\n"}])
 * or HTML tags into clean plain text for article excerpts and summaries.
 */
export function parseRichTextToPlainText(content?: string): string {
  if (!content) return "";
  const trimmed = content.trim();

  // If content starts with JSON array or object notation
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((op) => {
            if (typeof op === "string") return op;
            if (op && typeof op.insert === "string") return op.insert;
            if (op && typeof op.insert === "object") return "";
            return "";
          })
          .join("")
          .replace(/\n+/g, " ")
          .trim();
      }
      if (parsed && typeof parsed === "object" && typeof parsed.insert === "string") {
        return parsed.insert.replace(/\n+/g, " ").trim();
      }
    } catch {
      // Fallback to string handling if JSON parsing fails
    }
  }

  // Strip basic HTML tags if any and replace newlines with spaces
  return trimmed.replace(/<[^>]*>?/gm, "").replace(/\n+/g, " ").trim();
}

/**
 * Parses raw Quill JSON (e.g. [{"insert":"tes\n"}] or {"ops":[{"insert":"tes\n"}]})
 * or plain/HTML text into an array of clean readable paragraphs.
 */
export function parseQuillJsonToParagraphs(content?: string): string[] {
  if (!content) return [];
  const trimmed = content.trim();

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      let opsArray: any[] = [];
      if (Array.isArray(parsed)) {
        opsArray = parsed;
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.ops)) {
          opsArray = parsed.ops;
        } else if (typeof parsed.insert === "string") {
          opsArray = [parsed];
        }
      }

      if (opsArray.length > 0) {
        const fullText = opsArray
          .map((op) => {
            if (typeof op === "string") return op;
            if (op && typeof op.insert === "string") return op.insert;
            return "";
          })
          .join("");

        const paragraphs = fullText
          .split(/\n+/)
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        if (paragraphs.length > 0) {
          return paragraphs;
        }
      }
    } catch {
      // Fallback if parsing fails
    }
  }

  // Handle HTML or multiline plain text fallback
  const cleanText = trimmed.replace(/<[^>]*>?/gm, "");
  const paragraphs = cleanText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs;
}

/**
 * Formats ISO date strings (like 2026-08-13T00:00:00.000) or Date objects
 * into localized readable Indonesian format (e.g. 13 Agustus 2026).
 */
export function formatIndonesianDate(dateInput?: string | Date): string {
  if (!dateInput) return "13 Agustus 2026";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats book price using Intl.NumberFormat ('id-ID', IDR).
 * Fallback: If price is 0, null, or undefined, returns 'Lihat Harga di Mizanstore'.
 */
export function formatBookPrice(price?: number | string | null): string {
  if (price === null || price === undefined || price === "" || price === 0) {
    return "Lihat Harga di Mizanstore";
  }

  let numPrice: number;
  if (typeof price === "number") {
    numPrice = price;
  } else {
    const cleaned = String(price).replace(/[^\d]/g, "");
    numPrice = parseInt(cleaned, 10);
  }

  if (isNaN(numPrice) || numPrice <= 0) {
    return "Lihat Harga di Mizanstore";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numPrice);
}




