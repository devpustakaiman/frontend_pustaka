export default function BookDetailLoading() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="mb-6 h-8 w-36 bg-gray-200 rounded-full" />

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Cover skeleton */}
            <div className="md:col-span-5 w-full aspect-[3/4] bg-gray-200 rounded-xl" />

            {/* Details skeleton */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded-full" />
                <div className="h-8 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>

              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
