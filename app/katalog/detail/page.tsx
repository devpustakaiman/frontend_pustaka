import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KatalogDetailRedirectPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const rawId = resolvedSearchParams?.id || resolvedSearchParams?.slug;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (id && id.trim()) {
    redirect(`/katalog/${encodeURIComponent(id.trim())}`);
  }

  redirect("/katalog");
}
