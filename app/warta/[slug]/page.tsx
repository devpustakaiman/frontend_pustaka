import ArticleDetailClient from "./ArticleDetailClient";
import { getArticles } from "@/lib/api";

export const dynamicParams = true; // Allow new slugs created post-build to be fetched on-demand
export const revalidate = 0; // Revalidate immediately so newly uploaded articles appear without stale cache

export async function generateStaticParams() {
  try {
    const articles = await getArticles();

    if (!articles || articles.length === 0) {
      return [];
    }

    return articles.map((article: any) => ({
      slug: article.slug || String(article.id),
    }));
  } catch (err) {
    console.warn("Failed to generateStaticParams for warta:", err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string | string[] }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  const cleanSlug = Array.isArray(rawSlug)
    ? rawSlug[0]
    : rawSlug?.replace(/\/$/, "") || "";

  return <ArticleDetailClient slug={cleanSlug} />;
}
