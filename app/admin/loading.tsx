export default function AdminLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-28 rounded skeleton-shimmer" />
        <div className="h-8 w-56 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="h-10 w-80 rounded-xl skeleton-shimmer" />
        <div className="h-7 w-24 rounded-full skeleton-shimmer" />
      </div>

      <div className="rounded-2xl overflow-hidden border border-rd-border bg-rd-surface">
        <div className="h-11 bg-rd-bg-2 border-b border-rd-border" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-rd-border last:border-b-0 flex items-center gap-3 px-4"
          >
            <div className="w-9 h-9 rounded-full skeleton-shimmer" />
            <div className="h-4 w-40 rounded skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer ml-auto" />
            <div className="h-5 w-20 rounded-full skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
