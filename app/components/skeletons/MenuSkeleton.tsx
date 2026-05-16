export default function MenuSkeleton() {
  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-20 rounded skeleton-shimmer" />
        <div className="h-8 w-56 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
      </div>

      {/* Hero / Viaje en curso */}
      <div className="mb-6 h-44 rounded-2xl bg-rd-surface border border-rd-border skeleton-shimmer" />

      {/* Recent jobs */}
      <div className="mt-8">
        <div className="h-6 w-44 rounded skeleton-shimmer mb-4" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-rd-surface border border-rd-border skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
