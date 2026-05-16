export default function MenuSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Hero / Viaje en curso */}
      <div className="mb-6 min-h-[200px] sm:min-h-[172px] rounded-2xl border border-rd-border-3 relative overflow-hidden">
        <div 
          className="absolute inset-0 skeleton-shimmer" 
          style={{
            background: "linear-gradient(135deg, rgba(217,64,204,0.18), rgba(141,98,165,0.10))"
          }}
        />
      </div>

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
