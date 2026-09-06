import { getArticles } from "@/lib/api";
import ArticleArchiveClient from "../warta/berita/ArticleArchiveClient";

export default async function ArtikelAliasPage() {
  const articles = await getArticles();
  return <ArticleArchiveClient initialArticles={articles} />;
}
