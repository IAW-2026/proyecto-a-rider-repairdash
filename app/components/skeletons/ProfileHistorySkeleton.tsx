export default function ProfileHistorySkeleton() {
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl h-[300px] bg-rd-surface border border-rd-border skeleton-shimmer" />
      </div>
      <div className="mt-6 lg:col-span-2 h-[400px] rounded-2xl bg-rd-surface border border-rd-border skeleton-shimmer" />
    </>
  );
}
