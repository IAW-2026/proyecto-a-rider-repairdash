export default function ViajeEnCursoSkeleton() {
  return (
    <div className="w-full rounded-2xl p-6 sm:p-7 bg-rd-surface border border-rd-border-2">
      <div className="flex items-center justify-between mb-7">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-44 rounded-md skeleton-shimmer" />
          <div className="h-3 w-32 rounded skeleton-shimmer" />
        </div>
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
      </div>

      <div className="relative pl-1">
        <div className="absolute left-[25px] top-[26px] bottom-[26px] w-[2px] bg-rd-border-2 rounded-full" />
        {[1, 2, 3, 4].map((step, i, arr) => (
          <div
            key={step}
            className={`flex gap-5 relative z-10 ${i === arr.length - 1 ? "" : "mb-7"}`}
          >
            <div className="w-[50px] h-[50px] shrink-0 rounded-full skeleton-shimmer" />
            <div className="pt-1 flex flex-col gap-2 w-full max-w-sm">
              <div className="h-4 w-40 rounded skeleton-shimmer" />
              {step === 1 && <div className="h-3 w-56 rounded skeleton-shimmer" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 pt-5 border-t border-rd-border">
        <div className="flex justify-between mb-2">
          <div className="h-3 w-16 rounded skeleton-shimmer" />
          <div className="h-3 w-10 rounded skeleton-shimmer" />
        </div>
        <div className="h-1.5 w-full bg-rd-bg rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-rd-accent/30 rounded-full skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
