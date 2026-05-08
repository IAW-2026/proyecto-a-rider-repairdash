export default function MenuSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="h-10 w-56 bg-brand-surface/60 rounded-xl skeleton-shimmer"></div>
        <div className="h-6 w-72 bg-brand-surface/40 rounded-lg skeleton-shimmer"></div>
      </div>

      {/* Action card / Viaje en Curso */}
      <div className="mb-8 rounded-3xl p-6 h-56 bg-brand-surface/50 border border-brand-purple/30 backdrop-blur-md skeleton-shimmer shadow-[0_8px_30px_#8D62A515]"></div>

      {/* Recent jobs */}
      <div className="mt-8">
        <div className="h-8 w-48 bg-brand-surface/60 rounded-xl mb-5 skeleton-shimmer"></div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-brand-surface/40 border border-brand-purple/20 skeleton-shimmer flex items-center justify-between p-5">
              <div className="flex flex-col gap-3 w-full">
                <div className="h-5 w-1/3 bg-brand-surface/80 rounded-md"></div>
                <div className="h-4 w-1/4 bg-brand-surface/60 rounded-md"></div>
              </div>
              <div className="h-8 w-24 bg-brand-surface/60 rounded-full shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
