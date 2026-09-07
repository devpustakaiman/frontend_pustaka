import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient";
import { getBooks } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/slugify";

export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const books = await getBooks();

    if (!books || books.length === 0) {
      return [{ slug: "1" }, { slug: "default" }];
    }

    return books.map((book: any) => ({
      slug: book.slug || generateSlug(book.title) || String(book.id),
    }));
  } catch (err) {
    console.warn("Failed to generateStaticParams for katalog:", err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string | string[] }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  const cleanSlug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "")
    .replace(/\/+$/, "")
    .trim();

  if (!cleanSlug) {
    notFound();
  }

  // 1. Direct match: query non-deleted books with .or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`)
  let book: any = null;

  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .is("deleted_at", null)
      .or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`)
      .maybeSingle();

    if (data) {
      book = data;
    } else if (error) {
      // Postgres error fallback (e.g. invalid UUID format when comparing id column)
      const { data: slugData } = await supabase
        .from("books")
        .select("*")
        .is("deleted_at", null)
        .eq("slug", cleanSlug)
        .maybeSingle();

      if (slugData) {
        book = slugData;
      } else {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
        if (isUUID) {
          const { data: idData } = await supabase
            .from("books")
            .select("*")
            .is("deleted_at", null)
            .eq("id", cleanSlug)
            .maybeSingle();
          if (idData) book = idData;
        }
      }
    }
  } catch (_) {
    // ignore query exception and try fallback
  }

  // 2. Fallback: If no direct match is returned, fetch active book titles and match using generateSlug(book.title) === cleanSlug
  if (!book) {
    try {
      const { data: allBooks } = await supabase
        .from("books")
        .select("*")
        .is("deleted_at", null);

      if (allBooks && allBooks.length > 0) {
        const match = allBooks.find((b: any) => {
          if (b.deleted_at || b.is_deleted === true) return false;
          const titleSlug = generateSlug(b.title || "");
          return (
            b.slug === cleanSlug ||
            String(b.id) === cleanSlug ||
            (titleSlug && titleSlug === cleanSlug)
          );
        });
        if (match) {
          book = match;
        }
      }
    } catch (_) {}
  }

  // Return notFound() only if all lookups fail
  if (!book) {
    notFound();
  }

  return <BookDetailClient slug={cleanSlug} initialBook={book} />;
}
