import { supabase } from "./supabase";

export async function getBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }

  return data || [];
}

export async function getPromoBooks() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .is("deleted_at", null)
    .eq("is_promo", true)
    .gt("promo_end_date", now)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promo books:", error);
    return [];
  }

  return data || [];
}

export async function getRecommendedBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .is("deleted_at", null)
    .eq("is_recommended", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recommended books:", error);
    return [];
  }

  return data || [];
}

export async function getNewBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Error fetching new books:", error);
    return [];
  }

  return data || [];
}

export async function getBookById(id: string) {
  if (!id) return null;

  try {
    // 1. Try matching by exact ID (exclude soft-deleted)
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .is("deleted_at", null)
      .eq("id", id)
      .maybeSingle();

    if (data) return data;

    if (error) {
      console.warn(`Gracefully handling getBookById error for id "${id}":`, error.message);
    }

    // 2. Try matching by slug if column exists
    const { data: slugData } = await supabase
      .from("books")
      .select("*")
      .is("deleted_at", null)
      .eq("slug", id)
      .maybeSingle();

    if (slugData) return slugData;

    // 3. Fallback: search active books and match ID string or title
    const { data: allBooks } = await supabase
      .from("books")
      .select("*")
      .is("deleted_at", null);
      
    if (allBooks && allBooks.length > 0) {
      const match = allBooks.find(
        (b) =>
          String(b.id) === String(id) ||
          b.slug === id ||
          b.title?.toLowerCase() === decodeURIComponent(id).toLowerCase()
      );
      if (match) return match;
    }

    return null;
  } catch (err) {
    console.warn(`Exception caught in getBookById for id "${id}":`, err);
    return null;
  }
}

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

export async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return (data as Article[]) || [];
}

export async function getArticleById(id: string) {
  if (!id) return null;

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.warn(`Gracefully handling getArticleById error for id "${id}":`, error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.warn(`Exception caught in getArticleById for id "${id}":`, err);
    return null;
  }
}

export interface MediaVideo {
  id: string | number;
  title: string;
  category?: string;
  duration?: string;
  video_url?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  image_url?: string;
  is_featured?: boolean;
  order_index?: number;
  speaker_name?: string;
  speaker_role?: string;
  description?: string;
  created_at?: string;
}

export async function getMediaVideos(): Promise<MediaVideo[]> {
  try {
    const { data, error } = await supabase
      .from("media_videos")
      .select("*")
      .is("deleted_at", null)
      .order("order_index", { ascending: true });

    if (error) {
      console.warn("Could not fetch media_videos from Supabase:", error.message);
      return [];
    }

    return (data as MediaVideo[]) || [];
  } catch (err) {
    console.warn("Exception in getMediaVideos:", err);
    return [];
  }
}

export async function submitManuscript(
  formData: { senderName: string; email: string; synopsis: string },
  file: File
) {
  const fileName = `${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("naskah")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Error uploading manuscript file:", uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from("naskah")
    .getPublicUrl(fileName);

  const pdfDocumentUrl = urlData.publicUrl;

  const { error: insertError } = await supabase
    .from("submissions")
    .insert([
      {
        senderName: formData.senderName,
        email: formData.email,
        synopsis: formData.synopsis,
        pdfDocumentUrl,
        status: "pending",
      },
    ]);

  if (insertError) {
    console.error("Error inserting manuscript submission:", insertError);
    throw insertError;
  }

  return { success: true };
}

export interface SiteSettings {
  id?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  hero_banner_url?: string;
  featured_book_id?: string;
  featured_book?: {
    id: string;
    title: string;
    author: string;
    price?: number | string;
    promo_price?: number | string | null;
    is_promo?: boolean;
    cover_url?: string;
    coverUrl?: string;
    [key: string]: any;
  } | null;
  updated_at?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*, featured_book:books(*)")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      console.warn("Could not fetch site_settings:", error.message);
      return null;
    }

    return data as SiteSettings | null;
  } catch (err) {
    console.warn("Exception caught in getSiteSettings:", err);
    return null;
  }
}

export async function submitPreorder(
  formData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    book_title: string;
    quantity: number;
    notes?: string;
  },
  receiptFile?: File | null
) {
  let receiptUrl: string | null = null;

  if (receiptFile) {
    const sanitizedName = receiptFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;

    // 1. Upload payment proof to 'preorder-receipts' storage bucket
    const { error: uploadError } = await supabase.storage
      .from("preorder-receipts")
      .upload(fileName, receiptFile);

    if (uploadError) {
      console.warn("Upload to preorder-receipts failed:", JSON.stringify(uploadError, null, 2));
      // Fallback bucket attempt
      const { error: fallbackError } = await supabase.storage
        .from("naskah")
        .upload(`receipts/${fileName}`, receiptFile);

      if (!fallbackError) {
        const { data: urlData } = supabase.storage
          .from("naskah")
          .getPublicUrl(`receipts/${fileName}`);
        receiptUrl = urlData.publicUrl;
      }
    } else {
      const { data: urlData } = supabase.storage
        .from("preorder-receipts")
        .getPublicUrl(fileName);
      receiptUrl = urlData.publicUrl;
    }
  }

  // 2. Insert into 'preorders' database table matching public.preorders schema
  const insertPayload = {
    customer_name: formData.customer_name,
    customer_email: formData.customer_email,
    customer_phone: formData.customer_phone,
    book_title: formData.book_title,
    quantity: Number(formData.quantity),
    transfer_receipt: receiptUrl,
    status: "pending",
  };

  const { data, error } = await supabase
    .from("preorders")
    .insert([insertPayload])
    .select();

  if (error) {
    console.error("Error inserting preorder into Supabase:", JSON.stringify(error, null, 2));
    
    // Fallback insert if extra column constraints cause issues
    const { data: fallbackData, error: simpleError } = await supabase
      .from("preorders")
      .insert([{
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        book_title: formData.book_title,
        quantity: Number(formData.quantity),
        status: "pending"
      }])
      .select();

    if (simpleError) {
      console.error("Fallback insert failed:", JSON.stringify(simpleError, null, 2));
      throw error;
    }
    return { success: true, data: fallbackData };
  }

  // 3. Dispatch background notification email to /api/preorder/notify
  try {
    fetch("/api/preorder/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        book_title: formData.book_title,
        quantity: formData.quantity,
        transfer_receipt: receiptUrl,
        receiptUrl,
      }),
    }).catch((err) => console.warn("Failed to dispatch preorder notification:", err));
  } catch (err) {
    // Ignore notification error gracefully
  }

  return { success: true, data };
}
