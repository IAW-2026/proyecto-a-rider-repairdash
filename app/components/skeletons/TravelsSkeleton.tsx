export default function TravelsSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      <div className="mb-8 flex flex-col gap-2">
        <div className="h-10 w-72 bg-brand-surface/60 rounded-xl skeleton-shimmer"></div>
        <div className="h-6 w-96 bg-brand-surface/40 rounded-lg skeleton-shimmer"></div>
      </div>
      
      <div className="min-h-[700px] w-full rounded-3xl bg-brand-surface/40 border border-brand-purple/20 backdrop-blur-md skeleton-shimmer shadow-[0_8px_30px_#8D62A515]"></div>
      
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="w-28 h-10 rounded-xl bg-brand-surface/50 border border-brand-purple/20 skeleton-shimmer"></div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-xl bg-brand-surface/50 border border-brand-purple/20 skeleton-shimmer"></div>
          ))}
        </div>
        <div className="w-32 h-10 rounded-xl bg-brand-surface/50 border border-brand-purple/20 skeleton-shimmer"></div>
      </div>
    </div>
  );
}
