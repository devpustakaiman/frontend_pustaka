import { getArticles, getMediaVideos } from "@/lib/api";
import WartaPageClient from "./WartaPageClient";

export default async function WartaPage() {
  const [articles, videos] = await Promise.all([
    getArticles(),
    getMediaVideos(),
  ]);

  return <WartaPageClient articles={articles} videos={videos} />;
}
