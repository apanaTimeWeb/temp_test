// RESPONSIBILITY: Server-rendered semantic loading skeleton for the Finance route segment.
export default function Loading() {
  return (
    <section className="flex h-full w-full items-center justify-center p-8" aria-busy="true" role="status">
      <div className="motion-safe:animate-pulse space-y-4 w-full max-w-3xl" aria-hidden="true">
        <div className="h-8 bg-floating border border-border rounded w-1/4" />
        <div className="h-24 bg-card border border-border rounded w-full" />
        <div className="h-64 bg-card border border-border rounded w-full" />
      </div>
    </section>
  );
}
