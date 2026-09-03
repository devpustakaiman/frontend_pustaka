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
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .is("deleted_at", null)
    .eq("is_promo", true)
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
