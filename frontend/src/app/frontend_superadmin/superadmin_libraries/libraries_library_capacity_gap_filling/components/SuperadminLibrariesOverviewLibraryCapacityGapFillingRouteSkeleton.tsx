// RESPONSIBILITY: Render a loading skeleton that mirrors the gap-filling page's heading, preview notices, and seat timeline cards.
import { useTranslations } from 'next-intl';

const timelineKeys = ['seat-1', 'seat-2', 'seat-3', 'seat-4'];

export default function SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton() {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <section className="min-w-0 space-y-6 p-4 md:p-6" role="status" aria-busy="true" aria-label={t('COPY.LOADING_MODULE')} data-testid="superadmin_libraries-libraries_library_capacity_gap_filling-route-skeleton">
      <span className="sr-only">{t('COPY.LOADING_MODULE')}</span>
      <div className="space-y-3" aria-hidden="true">
        <div className="h-3 w-48 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-9 w-72 max-w-full rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-4 w-3/5 max-w-full rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-16 rounded-lg border border-border bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-16 rounded-lg border border-border bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="flex items-center justify-between gap-3" aria-hidden="true">
        <div className="h-6 w-56 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-7 w-28 rounded-full bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="space-y-4" aria-hidden="true">
        {timelineKeys.map((key) => (
          <div key={key} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-5 w-14 shrink-0 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
              <div className="h-12 min-w-[12rem] flex-1 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
              <div className="flex w-64 shrink-0 items-center gap-3">
                <div className="h-8 flex-1 rounded bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
                <div className="h-9 w-28 rounded-lg bg-skeleton-base motion-safe:animate-pulse motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
