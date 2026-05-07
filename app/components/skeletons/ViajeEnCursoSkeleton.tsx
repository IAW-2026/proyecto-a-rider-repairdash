export default function ViajeEnCursoSkeleton() {
  return (
    <div className="w-full rounded-3xl p-6 sm:p-10 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md shadow-[0_8px_48px_#8D62A520] animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="h-10 w-64 bg-brand-surface/80 rounded-xl skeleton-shimmer"></div>
        <div className="h-8 w-28 bg-brand-surface/50 rounded-full border border-brand-accent/30 skeleton-shimmer"></div>
      </div>

      {/* Stepper Skeleton */}
      <div className="flex flex-col relative">
        <div className="absolute left-7 top-7 bottom-7 w-0.5 bg-brand-purple/20 rounded-full z-0" />

        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex gap-6 relative z-10 mb-10 last:mb-0">
            <div className="w-14 h-14 shrink-0 rounded-full bg-brand-surface/80 border border-brand-purple/30 z-10 skeleton-shimmer shadow-md"></div>
            <div className="flex flex-col justify-center gap-3 w-full max-w-sm">
              <div className="h-7 w-40 bg-brand-surface/80 rounded-lg skeleton-shimmer"></div>
              {step === 1 && <div className="h-5 w-64 bg-brand-surface/50 rounded-lg skeleton-shimmer"></div>}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar Skeleton */}
      <div className="mt-12 pt-8 border-t border-brand-purple/20">
        <div className="flex justify-between mb-3">
          <div className="h-5 w-20 bg-brand-surface/80 rounded-lg skeleton-shimmer"></div>
          <div className="h-5 w-10 bg-brand-surface/80 rounded-lg skeleton-shimmer"></div>
        </div>
        <div className="h-2.5 w-full bg-brand-surface/40 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-brand-accent/30 rounded-full skeleton-shimmer shadow-[0_0_10px_#F500F150]"></div>
        </div>
      </div>
    </div>
  );
}
