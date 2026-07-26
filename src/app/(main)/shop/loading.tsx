export default function ShopLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 animate-pulse">
      <div className="flex flex-col items-center mb-12">
        <div className="h-4 w-24 bg-outline-variant/20 mb-4"></div>
        <div className="h-10 w-48 md:w-64 bg-outline-variant/20 mb-6"></div>
        <div className="h-4 w-64 md:w-96 bg-outline-variant/20"></div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Skeleton */}
        <div className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="h-8 w-32 bg-outline-variant/20 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="h-4 w-4 bg-outline-variant/20"></div>
                <div className="h-4 w-24 bg-outline-variant/20"></div>
              </div>
            ))}
          </div>
          <div className="h-8 w-32 bg-outline-variant/20 mt-10 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="h-4 w-4 bg-outline-variant/20"></div>
                <div className="h-4 w-24 bg-outline-variant/20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-32 bg-outline-variant/20"></div>
            <div className="h-10 w-48 bg-outline-variant/20"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-gutter gap-y-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="relative w-full aspect-[4/5] bg-outline-variant/10 mb-6"></div>
                <div className="h-4 w-3/4 bg-outline-variant/20 mb-2"></div>
                <div className="h-3 w-1/2 bg-outline-variant/20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
