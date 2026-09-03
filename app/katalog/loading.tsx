import { BookCardSkeletonGrid } from "@/components/BookCardSkeleton";

/**
 * Katalog route loading skeleton.
 * NOTE: Static export does not support Suspense streaming — see root loading.tsx.
 */
export default function KatalogLoading() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Page header skeleton */}
        <div className="mb-8 border-b border-gray-100 pb-6 space-y-3">
          <div className="h-2.5 w-28 bg-gray-200 rounded-full" />
          <div className="h-9 w-72 bg-gray-200 rounded" />
          <div className="h-3 w-80 bg-gray-200 rounded" />
        </div>

        {/* Sort bar skeleton */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-10 w-56 bg-gray-200 rounded-lg" />
        </div>

        {/* Book grid skeleton */}
        <BookCardSkeletonGrid count={8} />
      </div>
    </div>
  );
}
