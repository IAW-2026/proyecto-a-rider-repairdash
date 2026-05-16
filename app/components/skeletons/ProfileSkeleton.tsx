export default function ProfileSkeleton() {
  return (
    <div className="py-2 sm:py-4 max-w-6xl mx-auto w-full">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-28 rounded skeleton-shimmer" />
        <div className="h-8 w-44 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
        <div className="rounded-2xl p-6 bg-rd-surface border border-rd-border flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full skeleton-shimmer" />
          <div className="h-5 w-36 rounded skeleton-shimmer" />
          <div className="h-3 w-44 rounded skeleton-shimmer" />
          <div className="h-10 w-full rounded-xl skeleton-shimmer mt-2" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-rd-surface border border-rd-border skeleton-shimmer"
              />
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-rd-surface border border-rd-border skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
