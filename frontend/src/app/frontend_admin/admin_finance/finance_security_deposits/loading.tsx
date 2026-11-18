'use client';

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="motion-safe:animate-pulse space-y-4 w-full max-w-5xl">
        <div className="h-8 bg-surface-highlight rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-surface-highlight rounded-2xl"></div>
          <div className="h-28 bg-surface-highlight rounded-2xl"></div>
          <div className="h-28 bg-surface-highlight rounded-2xl"></div>
          <div className="h-28 bg-surface-highlight rounded-2xl"></div>
        </div>
        <div className="h-64 bg-surface-highlight rounded-2xl"></div>
      </div>
    </div>
  );
}
