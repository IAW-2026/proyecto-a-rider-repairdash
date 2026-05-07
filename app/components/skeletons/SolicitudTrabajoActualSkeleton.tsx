export default function SolicitudTrabajoActualSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      <div className="rounded-3xl p-6 sm:p-10 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md shadow-[0_8px_48px_#8D62A520]">
        <div className="flex flex-col gap-3 mb-10 items-center text-center">
          <div className="h-10 w-72 bg-brand-surface/80 rounded-xl skeleton-shimmer"></div>
          <div className="h-5 w-56 bg-brand-surface/50 rounded-lg skeleton-shimmer"></div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Ubicacion selector skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-6 w-40 bg-brand-surface/80 rounded-lg skeleton-shimmer"></div>
            <div className="h-14 w-full bg-brand-surface/50 rounded-2xl border border-brand-purple/20 skeleton-shimmer"></div>
            <div className="h-10 w-56 bg-brand-surface/50 rounded-xl mx-auto mt-2 skeleton-shimmer"></div>
          </div>

          {/* Tipo de problema skeleton */}
          <div className="flex flex-col gap-3 mt-4">
            <div className="h-6 w-48 bg-brand-surface/80 rounded-lg skeleton-shimmer"></div>
            <div className="h-36 w-full bg-brand-surface/50 rounded-2xl border border-brand-purple/20 skeleton-shimmer"></div>
          </div>

          {/* Submit button skeleton */}
          <div className="h-14 w-full bg-brand-accent/30 rounded-2xl mt-6 skeleton-shimmer shadow-[0_0_15px_#F500F130]"></div>
        </div>
      </div>
    </div>
  );
}
