import { getMediaVideos } from "@/lib/api";
import VideoArchiveClient from "./VideoArchiveClient";

export default async function VideoArchivePage() {
  const videos = await getMediaVideos();
  return <VideoArchiveClient initialVideos={videos} />;
}
