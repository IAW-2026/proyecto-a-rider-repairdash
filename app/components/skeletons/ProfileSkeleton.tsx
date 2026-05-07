export default function ProfileSkeleton() {
  return (
    <div className="py-6 animate-pulse">
      {/* Header */}
      <div className="h-10 w-40 bg-brand-surface/60 rounded-xl mb-8 skeleton-shimmer"></div>

      {/* Profile card */}
      <div className="rounded-3xl p-10 flex flex-col items-center gap-5 bg-brand-surface/50 border border-brand-purple/30 backdrop-blur-md shadow-[0_8px_30px_#8D62A515]">
        <div className="w-28 h-28 rounded-full bg-brand-surface/80 border-[4px] border-brand-accent/30 skeleton-shimmer shadow-[0_0_20px_#F500F140]"></div>
        <div className="h-8 w-56 bg-brand-surface/80 rounded-xl mt-3 skeleton-shimmer"></div>
        <div className="w-full h-14 rounded-2xl mt-4 bg-brand-accent/10 border border-brand-accent/20 skeleton-shimmer"></div>
      </div>
    </div>
  );
}
