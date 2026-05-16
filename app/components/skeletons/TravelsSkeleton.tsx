export default function TravelsSkeleton() {
  return (
    <div className="py-2 sm:py-4 max-w-6xl mx-auto w-full">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-32 rounded skeleton-shimmer" />
        <div className="h-8 w-72 rounded-md skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
      </div>

      <div className="rounded-2xl overflow-hidden border border-rd-border bg-rd-surface">
        <div className="bg-rd-bg-2 h-11 border-b border-rd-border" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-14 border-b border-rd-border last:border-b-0 flex items-center gap-4 px-4"
          >
            <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-4 w-24 rounded skeleton-shimmer ml-auto" />
            <div className="h-5 w-20 rounded-full skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-6">
        <div className="h-9 w-24 rounded-lg skeleton-shimmer" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-9 rounded-lg skeleton-shimmer" />
        ))}
        <div className="h-9 w-24 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}
