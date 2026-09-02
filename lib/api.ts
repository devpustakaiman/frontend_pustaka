import { supabase } from "./supabase";

export async function getBooks() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
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
    // 1. Try matching by exact ID
    const { data, error } = await supabase
      .from("books")
      .select("*")
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
      .eq("slug", id)
      .maybeSingle();

    if (slugData) return slugData;

    // 3. Fallback: search all books and match ID string or title
    const { data: allBooks } = await supabase.from("books").select("*");
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


export async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return data || [];
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


