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



