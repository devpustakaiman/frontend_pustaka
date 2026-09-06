import { getArticles } from "@/lib/api";
import ArticleArchiveClient from "./ArticleArchiveClient";

export default async function ArticleArchivePage() {
  const articles = await getArticles();
  return <ArticleArchiveClient initialArticles={articles} />;
}
