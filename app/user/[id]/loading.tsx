export default function UserLoading() {
  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full">
      <div className="mb-6 flex flex-col gap-2">
        <div className="h-3.5 w-20 rounded skeleton-shimmer" />
        <div className="h-8 w-44 rounded-md skeleton-shimmer" />
        <div className="h-4 w-72 rounded skeleton-shimmer" />
      </div>
      <div className="h-44 rounded-2xl bg-rd-surface border border-rd-border skeleton-shimmer mb-6" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-rd-surface border border-rd-border skeleton-shimmer"
          />
        ))}
      </div>
    </div>
  );
}
