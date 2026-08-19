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
