// RESPONSIBILITY: Renders the route-shaped loading skeleton for admin_communication.
// DATA FLOW: Next.js App Router -> loading.tsx.
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('ADMIN_COMMUNICATION.ROUTE_LOADING');
  return (
    <div className="space-y-6 p-6" role="status" aria-label={t('ARIA_LABEL')} aria-busy="true">
      <div className="motion-safe:animate-pulse space-y-3">
        <div className="h-7 w-1/3 rounded bg-skeleton-base" />
        <div className="h-4 w-2/3 rounded bg-skeleton-highlight" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <div key={`skeleton-${index + 1}`} className="h-24 rounded-lg border border-border bg-skeleton-base" />)}
      </div>
      <div className="space-y-3 rounded-lg border border-border bg-card p-4 motion-safe:animate-pulse">
        {Array.from({ length: 5 }, (_, index) => <div key={`skeleton-${index + 1}`} className="h-10 rounded bg-skeleton-highlight" />)}
      </div>
      <span className="sr-only">{t('SCREEN_READER_TEXT')}</span>
    </div>
  );
}
