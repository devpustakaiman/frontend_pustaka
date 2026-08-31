import NewsGrid, { Article } from "./NewsGrid";

export type { Article };

export default function NewsTimeline({ articles = [] }: { articles?: Article[] }) {
  return <NewsGrid articles={articles} />;
}
