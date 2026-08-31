/**
 * BookCardSkeleton
 * A pulse-animated placeholder that visually mimics a real BookCard.
 * Used in loading.tsx files and anywhere a deferred load needs a skeleton UI.
 */
export default function BookCardSkeleton() {
  return (
    <div className="bg-white border border-[#E7E1D8] rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      {/* Cover block */}
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg" />
      {/* Category badge */}
      <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
      {/* Title – two lines */}
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-full" />
        <div className="h-3.5 bg-gray-200 rounded w-4/5" />
      </div>
      {/* Author */}
      <div className="h-2.5 bg-gray-200 rounded w-1/2" />
      {/* Divider */}
      <div className="border-t border-gray-100 mt-1" />
      {/* Price + CTA row */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-7 w-16 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

/** Grid of N skeletons — convenience wrapper */
export function BookCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
