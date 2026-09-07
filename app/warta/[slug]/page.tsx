import ArticleDetailClient from "./ArticleDetailClient";
import { getArticles } from "@/lib/api";

export async function generateStaticParams() {
  const articles = await getArticles();

  if (!articles || articles.length === 0) {
    return [{ slug: "1" }, { slug: "default" }];
  }

  return articles.map((article: any) => ({
    slug: article.slug || String(article.id),
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
