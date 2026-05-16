export default function IdentityCardSkeleton() {
  return (
    <div 
      className="rounded-2xl p-6 border border-rd-border flex flex-col items-center gap-3 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--color-rd-surface) 0%, var(--color-rd-bg-2) 100%)"
      }}
    >
      <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-full skeleton-shimmer relative z-10" />
      <div className="h-5 w-36 rounded skeleton-shimmer relative z-10" />
      <div className="h-3 w-44 rounded skeleton-shimmer relative z-10" />
      <div className="h-10 w-full rounded-xl skeleton-shimmer mt-2 relative z-10" />
    </div>
  );
}