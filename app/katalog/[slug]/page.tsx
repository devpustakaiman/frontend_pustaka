import BookDetailClient from "./BookDetailClient";
import { getBooks } from "@/lib/api";

export async function generateStaticParams() {
  const books = await getBooks();

  if (!books || books.length === 0) {
    return [{ slug: "1" }, { slug: "default" }];
  }

  return books.map((book: any) => ({
    slug: String(book.id),
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <BookDetailClient slug={slug} />;
}
