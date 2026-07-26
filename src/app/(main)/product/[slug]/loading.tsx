export default function ProductLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-outline-variant/20 mb-8 md:mb-12"></div>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Gallery Skeleton */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative w-full aspect-square md:aspect-[4/5] bg-outline-variant/10"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square bg-outline-variant/10"></div>
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="h-8 w-64 bg-outline-variant/20 mb-4"></div>
          <div className="h-6 w-32 bg-outline-variant/20 mb-8"></div>
          
          <div className="space-y-4 mb-8">
            <div className="h-4 w-full bg-outline-variant/20"></div>
            <div className="h-4 w-5/6 bg-outline-variant/20"></div>
            <div className="h-4 w-4/6 bg-outline-variant/20"></div>
          </div>
          
          <div className="h-16 w-full bg-outline-variant/20 mb-8"></div>
          
          <div className="space-y-4">
            <div className="h-12 w-full bg-outline-variant/20"></div>
            <div className="h-12 w-full bg-outline-variant/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
