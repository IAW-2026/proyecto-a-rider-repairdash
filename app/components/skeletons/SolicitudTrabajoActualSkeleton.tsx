export default function SolicitudTrabajoActualSkeleton() {
  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full">
      <div className="h-4 w-24 rounded skeleton-shimmer mb-3" />
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-44 rounded skeleton-shimmer" />
        <div className="h-8 w-44 rounded-md skeleton-shimmer" />
        <div className="h-4 w-80 rounded skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="rounded-2xl p-6 bg-rd-surface border border-rd-border-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-12 rounded-xl skeleton-shimmer" />
            <div className="h-12 rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-28 rounded-xl skeleton-shimmer" />
          <div className="h-12 rounded-xl skeleton-shimmer" />
          <div className="h-12 rounded-xl skeleton-shimmer" />
          <div className="h-20 rounded-xl skeleton-shimmer" />
          <div className="h-12 rounded-xl skeleton-shimmer mt-2" />
        </div>

        <div className="rounded-2xl p-6 bg-rd-surface border border-rd-border h-fit flex flex-col gap-3">
          <div className="h-3.5 w-28 rounded skeleton-shimmer mb-1" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-lg skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
