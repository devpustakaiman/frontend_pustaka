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

export async function getBookById(id: string) {
  if (!id) return null;

  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.warn(`Gracefully handling getBookById error for id "${id}":`, error.message);
      return null;
    }

    return data;
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
