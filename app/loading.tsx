import { BookCardSkeletonGrid } from "@/components/BookCardSkeleton";

/**
 * Root-level loading.tsx
 * NOTE: Static export (output: "export") does not support streaming Suspense,
 * so this file exists for future-readiness / dynamic deployment compatibility.
 * In a dynamic deployment this skeleton would show during initial page load.
 */
export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-[480px] bg-gray-200" />

      {/* Section skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Section header skeleton */}
        <div className="space-y-3">
          <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <BookCardSkeletonGrid count={4} />

        {/* Category pills skeleton */}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-36 bg-gray-200 rounded-full flex-shrink-0" />
          ))}
        </div>

        {/* Second section */}
        <div className="space-y-3">
          <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <BookCardSkeletonGrid count={4} />
      </div>
    </div>
  );
}
